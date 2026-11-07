import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import EssayApp from './EssayApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EssayApp />
  </StrictMode>,
)
