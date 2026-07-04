import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { EasterEggProvider } from './context/EasterEggContext.tsx';
import { LoadingProvider } from './context/LoadingContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <EasterEggProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </EasterEggProvider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>,
);
