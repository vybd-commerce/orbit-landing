import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import WaitlistApp from './WaitlistApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WaitlistApp />
  </StrictMode>,
)
