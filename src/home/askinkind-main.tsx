import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/board-legacy.css'
import AskInKindApp from './AskInKindApp'

document.documentElement.classList.add('js')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AskInKindApp />
  </StrictMode>,
)
