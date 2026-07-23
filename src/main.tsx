import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { LoadingProvider } from './context/LoadingContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { TranslationProvider } from './context/TranslationContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { SiteContentProvider } from './context/SiteContentContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SiteContentProvider>
          <LoadingProvider>
            <ThemeProvider>
              <TranslationProvider>
                <App />
              </TranslationProvider>
            </ThemeProvider>
          </LoadingProvider>
        </SiteContentProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

