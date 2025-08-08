import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import MindmapRoute from './pages/mindmap/MindmapRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MindmapRoute />
  </StrictMode>,
)
