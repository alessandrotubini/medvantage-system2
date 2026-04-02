import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { ClinicaProvider } from '@/lib/clinicaContext';
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Pacientes from './pages/Pacientes';
import Atendimentos from './pages/Atendimentos';
import Sessoes from './pages/Sessoes';
import Financeiro from './pages/Financeiro';
import Relatorios from './pages/Relatorios';
import AIGrowthEngine from './pages/AIGrowthEngine';
import Equipe from './pages/Equipe';
import Configuracoes from './pages/Configuracoes';
import MasterAdmin from './pages/MasterAdmin';
import Onboarding from './pages/Onboarding';
import Profissionais from './pages/Profissionais';
import Servicos from './pages/Servicos';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Carregando ClínicaPro AI...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Master Admin - standalone (no sidebar) */}
      <Route path="/master" element={<MasterAdmin />} />
      {/* Onboarding - standalone */}
      <Route path="/onboarding" element={<Onboarding />} />
      {/* Main app with sidebar layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/atendimentos" element={<Atendimentos />} />
        <Route path="/sessoes" element={<Sessoes />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/ai-growth" element={<AIGrowthEngine />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/profissionais" element={<Profissionais />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ClinicaProvider>
            <AuthenticatedApp />
          </ClinicaProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;