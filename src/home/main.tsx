import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/board.css'
import App from './App'

// Reveal-on-scroll only hides content once JS is running.
document.documentElement.classList.add('js')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
