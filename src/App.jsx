import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { ClinicaProvider } from '@/lib/clinicaContext';
import { DemoClinicaProvider } from '@/lib/DemoClinicaContext';
import AppLayout from '@/components/layout/AppLayout';
import DemoLayout from '@/components/demo/DemoLayout';
import PrivateRoute from '@/components/layout/PrivateRoute';

// ─── Public Pages ─────────────────────────────────────────────────────────────
import LandingPage from './pages/LandingPage';

// ─── Demo Pages (reuse real pages — DemoClinicaProvider forces demo data) ────
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Pacientes from './pages/Pacientes';
import Sessoes from './pages/Sessoes';
import Financeiro from './pages/Financeiro';
import Relatorios from './pages/Relatorios';
import AIGrowthEngine from './pages/AIGrowthEngine';

// ─── Real / Private Pages (also reused in demo routes) ────────────────────────
import Atendimentos from './pages/Atendimentos';
import Equipe from './pages/Equipe';
import Configuracoes from './pages/Configuracoes';
import MasterAdmin from './pages/MasterAdmin';
import Onboarding from './pages/Onboarding';
import Profissionais from './pages/Profissionais';
import Servicos from './pages/Servicos';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>

            {/* ══════════════════════════════════════════════════
                1. LP PÚBLICA — sem login, sem clinica context
            ══════════════════════════════════════════════════ */}
            <Route path="/" element={<LandingPage />} />

            {/* ══════════════════════════════════════════════════
                2. DEMO PÚBLICA — sem login, dados fictícios
                DemoClinicaProvider garante clinica=null
                Todas as páginas detectam isReal=false e usam DEMO_DATA
            ══════════════════════════════════════════════════ */}
            <Route
              path="/demo"
              element={
                <DemoClinicaProvider>
                  <DemoLayout />
                </DemoClinicaProvider>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="pacientes" element={<Pacientes />} />
              <Route path="atendimentos" element={<Atendimentos />} />
              <Route path="sessoes" element={<Sessoes />} />
              <Route path="financeiro" element={<Financeiro />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="ai-growth" element={<AIGrowthEngine />} />
              <Route path="equipe" element={<Equipe />} />
              <Route path="profissionais" element={<Profissionais />} />
              <Route path="servicos" element={<Servicos />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>

            {/* ══════════════════════════════════════════════════
                3. SISTEMA REAL PRIVADO — requer login
                PrivateRoute bloqueia não autenticados
                ClinicaProvider carrega dados reais da clínica
            ══════════════════════════════════════════════════ */}
            <Route
              path="/app"
              element={
                <PrivateRoute>
                  <ClinicaProvider>
                    <AppLayout />
                  </ClinicaProvider>
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="pacientes" element={<Pacientes />} />
              <Route path="atendimentos" element={<Atendimentos />} />
              <Route path="sessoes" element={<Sessoes />} />
              <Route path="financeiro" element={<Financeiro />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="ai-growth" element={<AIGrowthEngine />} />
              <Route path="equipe" element={<Equipe />} />
              <Route path="profissionais" element={<Profissionais />} />
              <Route path="servicos" element={<Servicos />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>

            {/* Master Admin — privado, sem sidebar clínica */}
            <Route
              path="/master"
              element={
                <PrivateRoute>
                  <ClinicaProvider>
                    <MasterAdmin />
                  </ClinicaProvider>
                </PrivateRoute>
              }
            />

            {/* Onboarding — privado, sem sidebar */}
            <Route
              path="/onboarding"
              element={
                <PrivateRoute>
                  <ClinicaProvider>
                    <Onboarding />
                  </ClinicaProvider>
                </PrivateRoute>
              }
            />

            {/* Error page */}
            <Route
              path="/user-not-registered"
              element={<UserNotRegisteredError />}
            />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;