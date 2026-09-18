// =================================================================
// Archivo: src/main.tsx
//RESPONSABILIDAD: Punto de entrada principal que monta la app React y envuelve
//los componentes en <AuthProvider> y <BrowserRouter> para prevenir errores de contexto.
// =================================================================
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>,
)