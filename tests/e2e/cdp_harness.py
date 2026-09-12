"""
The Brew App • Headless Chrome DevTools Protocol (CDP) Test Harness
Lightweight, robust browser driver without third-party webdriver overhead.
"""

import asyncio
import websockets
import json
import subprocess
import time
import urllib.request
import os
import base64

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
DEFAULT_USER_DATA = r"C:\Users\gmasc\AppData\Local\Temp\brew-qa-edge-profile"

class BrewBrowserSession:
    def __init__(self, port=9250, width=1280, height=800):
        self.port = port
        self.width = width
        self.height = height
        self.proc = None
        self.ws = None
        self.msg_id = 1
        self.console_messages = []
        self.runtime_exceptions = []
        self._listen_task = None

    async def start(self):
        # Terminate any stale process on this port if needed
        try:
            out = subprocess.check_output(f"netstat -ano | findstr :{self.port}", shell=True).decode()
            for line in out.strip().splitlines():
                parts = line.split()
                if len(parts) >= 5 and "LISTENING" in line:
                    pid = parts[-1]
                    subprocess.run(["taskkill", "/F", "/PID", pid], capture_output=True)
        except Exception:
            pass
        time.sleep(0.5)

        args = [
            EDGE_PATH,
            "--headless=new",
            f"--window-size={self.width},{self.height}",
            f"--remote-debugging-port={self.port}",
            f"--user-data-dir={DEFAULT_USER_DATA}",
            "--disable-gpu",
            "--no-first-run",
            "--no-default-browser-check"
        ]
        self.proc = subprocess.Popen(args)
        
        # Wait for debugging endpoint
        endpoint_url = f"http://127.0.0.1:{self.port}/json"
        connected = False
        for _ in range(15):
            time.sleep(0.5)
            try:
                with urllib.request.urlopen(endpoint_url, timeout=1) as resp:
                    targets = json.loads(resp.read().decode())
                    if targets and len(targets) > 0:
                        ws_url = targets[0]["webSocketDebuggerUrl"]
                        self.ws = await websockets.connect(ws_url, max_size=20*1024*1024)
                        connected = True
                        break
            except Exception:
                pass
        
        if not connected:
            raise RuntimeError("Could not connect to Edge CDP endpoint")

        await self.send("Page.enable")
        await self.send("Runtime.enable")
        await self.send("Console.enable")
        await self.set_viewport(self.width, self.height)

        # Start background listener for exceptions and console
        async def _listener():
            while True:
                try:
                    raw = await self.ws.recv()
                    evt = json.loads(raw)
                    method = evt.get("method")
                    if method == "Runtime.exceptionThrown":
                        self.runtime_exceptions.append(evt["params"]["exceptionDetails"])
                    elif method == "Console.messageAdded":
                        self.console_messages.append(evt["params"]["message"])
                except Exception:
                    break

        self._listen_task = asyncio.create_task(_listener())

    async def send(self, method, params=None):
        cmd = {"id": self.msg_id, "method": method}
        if params:
            cmd["params"] = params
        self.msg_id += 1
        await self.ws.send(json.dumps(cmd))
        while True:
            resp = json.loads(await self.ws.recv())
            if resp.get("id") == cmd["id"]:
                return resp

    async def navigate(self, url, wait_seconds=3.0):
        await self.send("Page.navigate", {"url": url})
        await asyncio.sleep(wait_seconds)

    async def set_viewport(self, width, height):
        self.width = width
        self.height = height
        await self.send("Emulation.setDeviceMetricsOverride", {
            "width": width,
            "height": height,
            "deviceScaleFactor": 1,
            "mobile": width < 768
        })
        await asyncio.sleep(0.5)

    async def evaluate(self, expression):
        resp = await self.send("Runtime.evaluate", {
            "expression": expression,
            "returnByValue": True,
            "awaitPromise": True
        })
        res = resp.get("result", {}).get("result", {})
        if "value" in res:
            return res["value"]
        if "description" in res:
            return res["description"]
        return None

    async def wait_for(self, predicate_expression, timeout_seconds=10.0, step=0.3):
        start = time.time()
        while time.time() - start < timeout_seconds:
            res = await self.evaluate(predicate_expression)
            if res:
                return res
            await asyncio.sleep(step)
        raise TimeoutError(f"Condition not met in {timeout_seconds}s: {predicate_expression[:80]}...")

    async def capture_screenshot(self, filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        res = await self.send("Page.captureScreenshot", {"format": "png"})
        raw_b64 = res["result"]["data"]
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(raw_b64))

    screenshot = capture_screenshot

    async def close(self):
        if self._listen_task:
            self._listen_task.cancel()
        if self.ws:
            await self.ws.close()
        if self.proc:
            self.proc.terminate()
            try:
                self.proc.wait(timeout=2)
            except Exception:
                self.proc.kill()