import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Dynamically resolve basename: on GitHub Pages repo URL it is '/brewed', on custom domains (thebrew.app) or localhost it is '/'
const routerBasename = (typeof window !== 'undefined' && window.location.pathname.startsWith('/brewed')) ? '/brewed' : '/';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={routerBasename}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
