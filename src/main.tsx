
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Error boundary
const renderApp = () => {
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      console.error("Root element not found");
      return;
    }
    
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error("Error rendering application:", error);
    // Display a fallback UI for critical errors
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: sans-serif;">
          <h1>Algo deu errado</h1>
          <p>Não foi possível carregar a aplicação. Por favor, tente novamente mais tarde.</p>
          <button onclick="window.location.reload()" style="padding: 8px 16px; margin-top: 16px; cursor: pointer;">
            Recarregar
          </button>
        </div>
      `;
    }
  }
};

renderApp();
