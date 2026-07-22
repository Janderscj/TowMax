import { Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import PrototypeBanner from './components/PrototypeBanner';
import AppShell from './components/AppShell';
import ScrollToTop from './components/ScrollToTop';
import { ProtectedRoute, AuthenticatedRoutes } from './routes/AppRoutes';

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell>
              <PrototypeBanner />
              <ScrollToTop />
              <AuthenticatedRoutes />
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return <AppContent />;
}

export default App;
