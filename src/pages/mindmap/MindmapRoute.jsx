import React, { useState } from 'react'
import App from '../../App'
import Mindmap from './Mindmap'

const MindmapRoute = () => {
  const [currentRoute] = useState(window.location.pathname)
  return(
    currentRoute.startsWith("/mindmap") ? <Mindmap /> : <App />
  )
}

export default MindmapRoute