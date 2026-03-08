import * as THREE from 'three'
window.THREE = THREE

function loadShery() {
  return new Promise((resolve) => {
    if (window.Shery) { resolve(); return; }
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/gh/aayushchouhan24/sheryjs@main/dist/Shery.js'
    s.onload = resolve
    s.onerror = resolve // fail silently, About.jsx handles missing Shery
    document.head.appendChild(s)
  })
}

// Kick off Shery load immediately (non-blocking — React mounts in parallel)
loadShery()

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
