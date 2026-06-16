import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, Package, DollarSign,
  BarChart3, Brain, ArrowLeft, Zap, Activity,
  ClipboardList, UserCog, UserCheck, Scissors, Settings
} from 'lucide-react';

const navItems = [
  { path: '/demo/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/demo/agenda', label: 'Agenda', icon: Calendar },
  { path: '/demo/pacientes', label: 'Pacientes', icon: Users },
  { path: '/demo/atendimentos', label: 'Atendimentos', icon: ClipboardList },
  { path: '/demo/sessoes', label: 'Sessões & Pacotes', icon: Package },
  { path: '/demo/financeiro', label: 'Financeiro', icon: DollarSign },
  { path: '/demo/relatorios', label: 'Relatórios', icon: BarChart3 },
  { path: '/demo/ai-growth', label: 'AI Growth Engine', icon: Brain, highlight: true },
  { path: '/demo/equipe', label: 'Equipe', icon: UserCog },
  { path: '/demo/profissionais', label: 'Profissionais', icon: UserCheck },
  { path: '/demo/servicos', label: 'Serviços', icon: Scissors },
  { path: '/demo/configuracoes', label: 'Configurações', icon: Settings },
];

export default function DemoLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-sidebar flex flex-col">
        {/* Brand */}
        <div className="px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
              <Activity size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-sidebar-foreground">MedVantage <span className="text-cyan-400">System</span></p>
              <p className="text-[10px] text-sidebar-foreground/50">Clínica Vida & Saúde</p>
            </div>
          </div>
        </div>

        {/* Demo badge */}
        <div className="mx-3 mt-3 px-3 py-2 bg-amber-500/15 border border-amber-500/30 rounded-lg">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0"></div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Modo Demonstração</span>
          </div>
          <p className="text-[9px] text-amber-300/70 mt-0.5">Dados fictícios · Sem login</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : item.highlight
                      ? 'text-cyan-400 hover:bg-sidebar-accent/50 hover:text-cyan-300'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
                {item.highlight && (
                  <span className="ml-auto text-[9px] font-bold text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded-full">AI</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer CTA */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <Link
            to="/demo/ai-growth"
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors w-full ${
              location.pathname === '/demo/ai-growth'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
            }`}
          >
            <Zap size={14} />
            Testar AI Growth
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors w-full"
          >
            <ArrowLeft size={13} />
            Voltar para a LP
          </Link>
          </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Demo top banner — always visible, no close */}
        <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse flex-shrink-0"></div>
            <span className="text-xs font-bold uppercase tracking-wide flex-shrink-0">Demonstração</span>
            <span className="text-xs text-amber-100 hidden sm:inline truncate">
              · Todos os dados são fictícios e ilustrativos. Nenhuma informação real é exibida ou processada.
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}