import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1c1c1c',
          color: '#ffffff',
          border: '1px solid #D4AF37',
          fontFamily: "'Geist Mono', monospace",
        },
      }}
    />
  </BrowserRouter>,
)
