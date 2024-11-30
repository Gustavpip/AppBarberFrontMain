import { Routes, Route } from 'react-router-dom';
import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';

import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { RecoverPassword } from './pages/RecoverPassword';
import { UpdatePassword } from './pages/UpdatePassword';
import { Dashboard } from './pages/Dashboard';
import { Center, Spinner } from '@chakra-ui/react';
import barberTheme from './theme';
import { Init } from './pages/Init';
import { BarbersList } from './pages/BarbersList';
import { BarberRegister } from './pages/BarberRegister';
import { ServiceList } from './pages/ServiceList';
import { ServiceRegister } from './pages/ServiceRegister';
import { DashboardClient } from './pages/DashboardClient';
import { ScheduleClient } from './pages/ScheduleClient';
import { ClientServiceList } from './pages/ClientServiceList';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Exibir uma tela de carregamento enquanto verifica a autentica��o
    return (
      <Center height="100vh">
        <Spinner size="xl" color={barberTheme.colors.primary.orange} />
      </Center>
    );
  }

  return isAuthenticated() ? children : <Navigate to="/entrar" />;
};

const ProtectedRouteLogin = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Center
        height="100vh"
        backgroundColor={barberTheme.colors.primary.orange}
      >
        <Spinner size="xl" color={barberTheme.colors.primary.orange} />
      </Center>
    );
  }

  return isAuthenticated() ? <Navigate to="/" /> : children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard>
              <Init />
            </Dashboard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/servicos"
        element={
          <ProtectedRoute>
            <Dashboard>
              <ServiceList />
            </Dashboard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/servicos/cadastro"
        element={
          <ProtectedRoute>
            <Dashboard>
              <ServiceRegister />
            </Dashboard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbeiros"
        element={
          <ProtectedRoute>
            <Dashboard>
              <BarbersList />
            </Dashboard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbeiros/cadastro"
        element={
          <ProtectedRoute>
            <Dashboard>
              <BarberRegister />
            </Dashboard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/agendar/:token"
        element={
          <DashboardClient>
            <ScheduleClient />
          </DashboardClient>
        }
      />
       <Route
        path="/agendar/servicos/:token"
        element={
          <DashboardClient>
            <ClientServiceList />
          </DashboardClient>
        }
      />
      <Route path="/registrar" element={<Signup />} />
      <Route
        path="/entrar"
        element={
          <ProtectedRouteLogin>
            <Signin />
          </ProtectedRouteLogin>
        }
      />
      <Route path="/recuperar/senha" element={<RecoverPassword />} />
      <Route path="/alterar/senha" element={<UpdatePassword />} />
    </Routes>
  );
};

export default AppRoutes;
