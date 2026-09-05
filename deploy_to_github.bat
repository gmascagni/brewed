@echo off
title Deploy The Brew App to GitHub
echo ========================================================
echo   Deploying The Brew App to GitHub (thebrew.app)
echo ========================================================
echo.
set "PATH=%LOCALAPPDATA%\git\cmd;%PATH%"
cd /d "%~dp0"
git push origin main
echo.
echo ========================================================
echo   Process finished. Check the output above.
echo ========================================================
pause
