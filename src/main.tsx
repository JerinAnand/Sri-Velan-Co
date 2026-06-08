import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { EasterEggProvider } from './context/EasterEggContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <EasterEggProvider>
        <App />
      </EasterEggProvider>
    </BrowserRouter>
  </StrictMode>,
);
