import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// HeroUI v3 is CSS-first — no provider wrapper needed

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
