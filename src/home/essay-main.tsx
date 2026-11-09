import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/board.css'
import EssayApp from './EssayApp'

document.documentElement.classList.add('js')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EssayApp />
  </StrictMode>,
)
