import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import PinLogin from './components/PinLogin';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import QuinielasPage from './pages/QuinielasPage';
import PagosPage from './pages/PagosPage';
import EstadisticasPage from './pages/EstadisticasPage';
import ConfiguracionPage from './pages/ConfiguracionPage';

const App = () => {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <PinLogin
        onSuccess={async (pin) => {
          const result = await login(pin);
          if (!result.success) {
            // El error se manejará en PinLogin
            throw new Error(result.error);
          }
        }}
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onLogout={logout} />}>
          <Route index element={<DashboardPage />} />
          <Route path="quinielas" element={<QuinielasPage />} />
          <Route path="pagos" element={<PagosPage />} />
          <Route path="estadisticas" element={<EstadisticasPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
