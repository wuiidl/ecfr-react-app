import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossOrigin="anonymous"
    />
    <App />
  </StrictMode>,
)
