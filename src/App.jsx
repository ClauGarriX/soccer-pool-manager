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
import QuinielaPublicPage from './pages/QuinielaPublicPage';
import QuinielaDetailsPage from './pages/QuinielaDetailsPage';

// Componente para rutas protegidas
const ProtectedRoute = ({ children, isAuthenticated, isLoading, login }) => {
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
            throw new Error(result.error);
          }
        }}
      />
    );
  }

  return children;
};

const App = () => {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas - NO requieren autenticación */}
        <Route path="/quiniela/:quinielaId" element={<QuinielaPublicPage />} />

        {/* Rutas de administración - SÍ requieren autenticación */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
              login={login}
            >
              <Layout onLogout={logout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="quinielas" element={<QuinielasPage />} />
          <Route path="quinielas/:quinielaId" element={<QuinielaDetailsPage />} />
          <Route path="pagos" element={<PagosPage />} />
          <Route path="estadisticas" element={<EstadisticasPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
        </Route>

        {/* Redireccionamientos */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
