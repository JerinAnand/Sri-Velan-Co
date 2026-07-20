import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { EasterEggProvider } from './context/EasterEggContext.tsx';
import { LoadingProvider } from './context/LoadingContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AdminProvider } from './context/AdminContext.tsx';
import { TranslationProvider } from './context/TranslationContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <AdminProvider>
          <EasterEggProvider>
            <ThemeProvider>
              <TranslationProvider>
                <App />
              </TranslationProvider>
            </ThemeProvider>
          </EasterEggProvider>
        </AdminProvider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>,
);
