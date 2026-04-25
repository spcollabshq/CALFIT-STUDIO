import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { testFirebaseConnection, authService } from './services/firebaseService';

// Verify Firebase Connection and Seed Data on Startup
(async () => {
  await testFirebaseConnection();
  await authService.seedInitialData();
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
