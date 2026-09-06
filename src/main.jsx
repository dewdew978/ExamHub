import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { registerSW } from 'virtual:pwa-register'

if (typeof window !== 'undefined' && window.location.hostname.includes('exam-hub-seven')) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      for (const reg of regs) reg.unregister();
    });
  }
  window.location.replace('https://exetia-exam.vercel.app' + window.location.pathname + window.location.search + window.location.hash);
} else {
  registerSW({ immediate: true })

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
      <SpeedInsights />
    </StrictMode>,
  )
}

