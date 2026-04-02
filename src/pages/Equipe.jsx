import React, { useState, useEffect } from 'react';
import { Plus, Shield, Mail, Edit, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import EquipeModal from '@/components/equipe/EquipeModal';
import { useClinica } from '@/lib/clinicaContext';
import { base44 } from '@/api/base44Client';

const papelLabels = {
  admin_clinica: { label: 'Admin da Clínica', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  recepcao: { label: 'Recepção', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  profissional: { label: 'Profissional', color: 'bg-green-50 text-green-700 border-green-200' },
  financeiro: { label: 'Financeiro', color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

const DEMO_EQUIPE = [
  { id: 'eq-001', nome: 'Dra. Ana Carolina Melo', user_email: 'ana@vidasaude.com', papel: 'profissional', ativo: true },
  { id: 'eq-002', nome: 'Maria Secretária', user_email: 'maria@vidasaude.com', papel: 'recepcao', ativo: true },
  { id: 'eq-003', nome: 'Dr. Ricardo Souza', user_email: 'ricardo@vidasaude.com', papel: 'profissional', ativo: true },
  { id: 'eq-004', nome: 'Carlos Financeiro', user_email: 'carlos@vidasaude.com', papel: 'financeiro', ativo: true },
  { id: 'eq-005', nome: 'Dra. Fernanda Lima', user_email: 'fernanda@vidasaude.com', papel: 'profissional', ativo: false },
];

const MODULOS = ['dashboard', 'agenda', 'pacientes', 'atendimentos', 'sessoes', 'financeiro', 'relatorios', 'equipe', 'ai_growth', 'configuracoes'];
const MOD_LABELS = { dashboard: 'Dashboard', agenda: 'Agenda', pacientes: 'Pacientes', atendimentos: 'Atendimentos', sessoes: 'Sessões', financeiro: 'Financeiro', relatorios: 'Relatórios', equipe: 'Equipe', ai_growth: 'AI Growth', configuracoes: 'Config.' };

export default function Equipe() {
  const { clinica } = useClinica();
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [equipe, setEquipe] = useState([]);

  useEffect(() => {
    if (clinica?.id) {
      base44.entities.MembroEquipe.filter({ clinica_id: clinica.id }).then(setEquipe);
    }
  }, [clinica?.id]);

  const reload = () => {
    if (clinica?.id) base44.entities.MembroEquipe.filter({ clinica_id: clinica.id }).then(setEquipe);
  };

  const isReal = !!clinica?.id;
  const source = isReal ? equipe : DEMO_EQUIPE;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Equipe & Acessos"
        subtitle="Gerencie usuários e permissões"
        action={<Button onClick={() => setShowModal(true)} className="gap-2"><Plus size={16} />Convidar Usuário</Button>}
      />

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Shield size={16} className="text-primary" />
          <h2 className="font-semibold text-foreground">Membros da Equipe</h2>
          <span className="ml-auto text-xs text-muted-foreground">{source.length} membros</span>
        </div>
        <div className="divide-y divide-border">
          {source.length === 0 && (
            <p className="px-5 py-8 text-sm text-muted-foreground text-center">Nenhum membro cadastrado. Convide sua equipe!</p>
          )}
          {source.map(membro => {
            const papel = papelLabels[membro.papel] || { label: membro.papel, color: 'bg-gray-50 text-gray-600 border-gray-200' };
            return (
              <div key={membro.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${membro.ativo ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {(membro.nome || membro.user_email || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${membro.ativo ? 'text-foreground' : 'text-muted-foreground'}`}>{membro.nome || '—'}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={10} />{membro.user_email}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${papel.color}`}>{papel.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${membro.ativo ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                  {membro.ativo ? 'Ativo' : 'Inativo'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => setSelected(membro)} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
                    <Edit size={14} />
                  </button>
                  <button className="p-1.5 text-muted-foreground hover:text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
                    <Power size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permissions matrix */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Matriz de Permissões por Papel</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Acesso padrão por papel. Personalize por usuário.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-wider">Módulo</th>
                {['Admin', 'Recepção', 'Profissional', 'Financeiro'].map(p => (
                  <th key={p} className="px-4 py-3 text-center font-semibold text-muted-foreground uppercase tracking-wider">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MODULOS.map(mod => {
                const perms = {
                  admin: true,
                  recepcao: ['dashboard','agenda','pacientes','atendimentos'].includes(mod),
                  profissional: ['dashboard','agenda','pacientes','atendimentos'].includes(mod),
                  financeiro: ['dashboard','financeiro','relatorios'].includes(mod),
                };
                return (
                  <tr key={mod} className="hover:bg-muted/10">
                    <td className="px-4 py-2.5 font-medium text-foreground">{MOD_LABELS[mod]}</td>
                    {Object.values(perms).map((v, i) => (
                      <td key={i} className="px-4 py-2.5 text-center">
                        {v ? <span className="text-green-500 font-bold">✓</span> : <span className="text-muted-foreground/30">—</span>}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {(showModal || selected) && (
        <EquipeModal
          onClose={() => { setShowModal(false); setSelected(null); }}
          membro={selected}
          onSaved={() => { reload(); setShowModal(false); setSelected(null); }}
        />
      )}
    </div>
  );
}