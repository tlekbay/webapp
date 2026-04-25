import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { startKeepAlive } from './lib/keepAlive'
import { SpeedInsights } from "@vercel/speed-insights/react"
import App from './App'
import './i18n'
import './index.css'

startKeepAlive()
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <SpeedInsights />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)