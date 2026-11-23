import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import FundRaiseApp from './FundRaiseApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FundRaiseApp />
  </StrictMode>,
)
