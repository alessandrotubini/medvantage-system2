import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, ClipboardList, Package, DollarSign,
  BarChart3, Settings, Brain, Building2, Menu, LogOut, ChevronRight, Stethoscope, UserCog, UserCheck, Scissors, ChevronsUpDown
} from 'lucide-react';
import { useClinica } from '@/lib/clinicaContext';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
  { icon: Calendar, label: 'Agenda', path: '/app/agenda' },
  { icon: Users, label: 'Pacientes', path: '/app/pacientes' },
  { icon: ClipboardList, label: 'Atendimentos', path: '/app/atendimentos' },
  { icon: Package, label: 'Sessões & Pacotes', path: '/app/sessoes' },
  { icon: DollarSign, label: 'Financeiro', path: '/app/financeiro' },
  { icon: BarChart3, label: 'Relatórios', path: '/app/relatorios' },
  { icon: Brain, label: 'AI Growth Engine', path: '/app/ai-growth', highlight: true },
  { icon: UserCog, label: 'Equipe', path: '/app/equipe' },
  { icon: UserCheck, label: 'Profissionais', path: '/app/profissionais' },
  { icon: Scissors, label: 'Serviços', path: '/app/servicos' },
  { icon: Settings, label: 'Configurações', path: '/app/configuracoes' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { clinica, todasClinicas, selectClinica, user, isSuperAdmin } = useClinica();

  const handleLogout = () => base44.auth.logout('/?logout=1');

  const primaryColor = clinica?.cor_principal || '#0EA5E9';

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full flex flex-col z-40 transition-all duration-300',
      'bg-sidebar border-r border-sidebar-border',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border flex-shrink-0">
        {clinica?.logo_url ? (
          <img src={clinica.logo_url} alt={clinica.nome} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: primaryColor }}>
            <Stethoscope size={16} className="text-white" />
          </div>
        )}
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-accent-foreground truncate leading-tight">
              {clinica?.nome || 'MedVantage System'}
            </p>
            <p className="text-xs text-sidebar-foreground opacity-60 truncate">
              {isSuperAdmin ? 'Super Admin' : 'Painel da Clínica'}
            </p>
          </div>
        )}
        <button onClick={onToggle} className="text-sidebar-foreground hover:text-sidebar-accent-foreground ml-auto flex-shrink-0">
          {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Super Admin Controls */}
      {isSuperAdmin && (
        <div className="px-3 pt-3 space-y-2">
          <Link to="/master" className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
            'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
          )}>
            <Building2 size={14} />
            {!collapsed && 'Painel Master'}
          </Link>
          {!collapsed && todasClinicas.length > 0 && (
            <Select value={clinica?.id || ''} onValueChange={id => selectClinica(todasClinicas.find(c => c.id === id))}>
              <SelectTrigger className="h-8 text-xs bg-sidebar-accent border-sidebar-border text-sidebar-accent-foreground">
                <ChevronsUpDown size={12} className="mr-1 flex-shrink-0" />
                <SelectValue placeholder="Selecionar clínica..." />
              </SelectTrigger>
              <SelectContent>
                {todasClinicas.map(c => (
                  <SelectItem key={c.id} value={c.id} className="text-xs">{c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : item.highlight
                    ? 'text-cyan-400 hover:bg-sidebar-accent hover:text-cyan-300'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
              style={active ? { backgroundColor: primaryColor } : {}}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.highlight && (
                <span className="ml-auto text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded-full font-semibold">AI</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="px-3 pb-4 border-t border-sidebar-border pt-3 flex-shrink-0">
        <div className={cn('flex items-center gap-3 px-3 py-2 rounded-lg', !collapsed && 'hover:bg-sidebar-accent cursor-pointer')}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: primaryColor }}>
            {user?.full_name?.[0] || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">{user?.full_name || 'Usuário'}</p>
              <p className="text-[10px] text-sidebar-foreground opacity-60 truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} className="text-sidebar-foreground hover:text-red-400 transition-colors">
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}