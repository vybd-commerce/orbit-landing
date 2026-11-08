import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import TestDropApp from './TestDropApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestDropApp />
  </StrictMode>,
)
