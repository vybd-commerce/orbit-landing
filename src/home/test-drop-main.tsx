import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/board.css'
import TestDropApp from './TestDropApp'

document.documentElement.classList.add('js')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestDropApp />
  </StrictMode>,
)
