import React, { useState } from 'react';
import { Plus, Search, Calendar, User, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import AtendimentoModal from '@/components/atendimentos/AtendimentoModal';
import { DEMO_ATENDIMENTOS_HOJE, DEMO_PACIENTES } from '@/lib/demoData';

export default function Atendimentos() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const allAtendimentos = [
    ...DEMO_ATENDIMENTOS_HOJE,
    { id: 'at-hist-001', hora_inicio: '09:00', paciente: 'Maria Fernanda Costa', profissional: 'Dra. Ana Carolina Melo', servico: 'Fisioterapia Individual', status: 'concluido', data: '2026-03-28' },
    { id: 'at-hist-002', hora_inicio: '11:00', paciente: 'Carla Beatriz Santos', profissional: 'Dra. Fernanda Lima', servico: 'Consulta Nutricional', status: 'concluido', data: '2026-03-27' },
    { id: 'at-hist-003', hora_inicio: '14:00', paciente: 'Roberto Martins', profissional: 'Dr. Marcos Oliveira', servico: 'Pilates Clínico', status: 'falta', data: '2026-03-26' },
  ];

  const filtered = allAtendimentos.filter(a =>
    a.paciente.toLowerCase().includes(search.toLowerCase()) ||
    a.profissional.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Atendimentos"
        subtitle="Histórico e gestão de atendimentos"
        action={<Button onClick={() => setShowModal(true)} className="gap-2"><Plus size={16} />Novo Atendimento</Button>}
      />

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por paciente ou profissional..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
          <span className="col-span-1">Horário</span>
          <span className="col-span-3">Paciente</span>
          <span className="col-span-3">Profissional</span>
          <span className="col-span-3">Serviço</span>
          <span className="col-span-2">Status</span>
        </div>
        <div className="divide-y divide-border">
          {filtered.map(at => (
            <div key={at.id} onClick={() => setSelected(at)}
              className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-muted/20 cursor-pointer transition-colors">
              <div className="col-span-1 text-sm font-mono text-muted-foreground">{at.hora_inicio}</div>
              <div className="col-span-3 text-sm font-medium text-foreground">{at.paciente}</div>
              <div className="col-span-3 text-sm text-muted-foreground truncate">{at.profissional}</div>
              <div className="col-span-3 text-sm text-muted-foreground truncate">{at.servico}</div>
              <div className="col-span-2"><StatusBadge status={at.status} /></div>
            </div>
          ))}
        </div>
      </div>

      {showModal && <AtendimentoModal onClose={() => setShowModal(false)} />}
      {selected && <AtendimentoModal onClose={() => setSelected(null)} atendimento={selected} />}
    </div>
  );
}