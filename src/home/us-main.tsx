import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import UsApp from './UsApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UsApp />
  </StrictMode>,
)
