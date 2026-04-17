import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LookupProvider } from './contexts/LookupContext';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <LookupProvider>
        <div className="app-shell">
          <App />
        </div>
      </LookupProvider>
    </AuthProvider>
  </BrowserRouter>
);
