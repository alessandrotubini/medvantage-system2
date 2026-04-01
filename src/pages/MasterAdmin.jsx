import React, { useState } from 'react';
import { Building2, Plus, Shield, CheckCircle, XCircle, Clock, Users, BarChart2, Eye, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import NovaClinicaModal from '@/components/master/NovaClinicaModal';

const DEMO_CLINICAS = [
  { id: 'c-001', nome: 'Clínica Vida & Saúde', slug: 'vida-saude', status: 'ativa', plano: 'profissional', owner_email: 'admin@vidasaude.com', onboarding_completo: true, licenca_vencimento: '2026-04-30', total_pacientes: 80, total_atendimentos_mes: 156, ultima_atividade: '2026-04-01' },
  { id: 'c-002', nome: 'Espaço Equilíbrio', slug: 'espaco-equilibrio', status: 'ativa', plano: 'starter', owner_email: 'ana@equilibrio.com', onboarding_completo: true, licenca_vencimento: '2026-05-15', total_pacientes: 42, total_atendimentos_mes: 89, ultima_atividade: '2026-03-31' },
  { id: 'c-003', nome: 'Centro de Pilates Bem Estar', slug: 'pilates-bemestar', status: 'trial', plano: 'starter', owner_email: 'contato@bemestar.com', onboarding_completo: false, licenca_vencimento: '2026-04-15', total_pacientes: 12, total_atendimentos_mes: 18, ultima_atividade: '2026-03-29' },
  { id: 'c-004', nome: 'Consultório Dra. Paula', slug: 'dra-paula', status: 'trial', plano: 'profissional', owner_email: 'paula@drpaula.com', onboarding_completo: false, licenca_vencimento: '2026-04-20', total_pacientes: 8, total_atendimentos_mes: 5, ultima_atividade: '2026-03-28' },
  { id: 'c-005', nome: 'Clínica Movimento Livre', slug: 'movimento-livre', status: 'bloqueada', plano: 'starter', owner_email: 'contato@movimento.com', onboarding_completo: true, licenca_vencimento: '2026-03-01', total_pacientes: 31, total_atendimentos_mes: 0, ultima_atividade: '2026-02-28' },
];

const planoColors = {
  starter: 'bg-gray-50 text-gray-600 border-gray-200',
  profissional: 'bg-blue-50 text-blue-700 border-blue-200',
  premium: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function MasterAdmin() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = DEMO_CLINICAS.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.owner_email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: DEMO_CLINICAS.length,
    ativas: DEMO_CLINICAS.filter(c => c.status === 'ativa').length,
    trial: DEMO_CLINICAS.filter(c => c.status === 'trial').length,
    bloqueadas: DEMO_CLINICAS.filter(c => c.status === 'bloqueada').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Master Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Painel Master</h1>
              <p className="text-slate-400 text-sm">ClínicaPro AI · Administração da Plataforma</p>
            </div>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-amber-500 hover:bg-amber-400 text-white gap-2">
            <Plus size={16} />Nova Clínica
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6 space-y-6">
        {/* Platform Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total Clínicas</p>
            <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Ativas</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.ativas}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Em Trial</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{stats.trial}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Bloqueadas</p>
            <p className="text-3xl font-bold text-red-500 mt-1">{stats.bloqueadas}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar clínica por nome ou email..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Clinics table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Clínicas Cadastradas</h2>
          </div>
          <div className="divide-y divide-border">
            {filtered.map(clinica => (
              <div key={clinica.id} className="px-5 py-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                      {clinica.nome[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{clinica.nome}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded border ${planoColors[clinica.plano]}`}>{clinica.plano}</span>
                        {clinica.onboarding_completo ? (
                          <span className="text-xs text-green-600 flex items-center gap-0.5"><CheckCircle size={11} />Setup OK</span>
                        ) : (
                          <span className="text-xs text-amber-500 flex items-center gap-0.5"><Clock size={11} />Onboarding pendente</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{clinica.owner_email}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users size={11} />{clinica.total_pacientes} pacientes</span>
                        <span className="flex items-center gap-1"><BarChart2 size={11} />{clinica.total_atendimentos_mes} atend./mês</span>
                        <span>Último acesso: {clinica.ultima_atividade}</span>
                        <span>Licença: {clinica.licenca_vencimento}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={clinica.status} />
                    <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs">
                      <Eye size={12} />Ver
                    </Button>
                    {clinica.status === 'bloqueada' ? (
                      <Button variant="outline" size="sm" className="h-7 px-2 gap-1 text-xs text-green-600 border-green-200 hover:bg-green-50">
                        <Unlock size={12} />Liberar
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="h-7 px-2 gap-1 text-xs text-red-600 border-red-200 hover:bg-red-50">
                        <Lock size={12} />Bloquear
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && <NovaClinicaModal onClose={() => setShowModal(false)} />}
    </div>
  );
}