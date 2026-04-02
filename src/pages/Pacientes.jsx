import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Phone, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import PacienteModal from '@/components/pacientes/PacienteModal';
import PacienteDrawer from '@/components/pacientes/PacienteDrawer';
import { useClinica } from '@/lib/clinicaContext';
import { base44 } from '@/api/base44Client';
import { DEMO_PACIENTES } from '@/lib/demoData';

const allStatus = ['todos', 'novo', 'recorrente', 'inativo', 'retorno_pendente'];

export default function Pacientes() {
  const { clinica } = useClinica();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    if (clinica?.id) {
      base44.entities.Paciente.filter({ clinica_id: clinica.id }).then(setPacientes);
    }
  }, [clinica?.id]);

  const reload = () => {
    if (clinica?.id) base44.entities.Paciente.filter({ clinica_id: clinica.id }).then(setPacientes);
  };

  const source = clinica?.id ? pacientes : DEMO_PACIENTES;

  const filtered = source.filter(p => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || (p.telefone || '').includes(search);
    const matchStatus = filterStatus === 'todos' || p.status_relacionamento === filterStatus;
    return matchSearch && matchStatus;
  });

  const labelStatus = { todos: 'Todos', novo: 'Novos', recorrente: 'Recorrentes', inativo: 'Inativos', retorno_pendente: 'Retorno Pendente' };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pacientes"
        subtitle={`${filtered.length} pacientes cadastrados`}
        action={<Button onClick={() => setShowModal(true)} className="gap-2"><Plus size={16} />Novo Paciente</Button>}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-60">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou telefone..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {allStatus.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterStatus === s ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {labelStatus[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
          <span className="col-span-4">Paciente</span>
          <span className="col-span-2">Telefone</span>
          <span className="col-span-2">Total Sessões</span>
          <span className="col-span-2">Última Sessão</span>
          <span className="col-span-2">Status</span>
        </div>
        <div className="divide-y divide-border">
          {filtered.map(p => (
            <div key={p.id} onClick={() => setSelectedPaciente(p)}
              className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-muted/20 cursor-pointer transition-colors">
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                  {p.nome[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{p.nome}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-1 text-sm text-muted-foreground">
                <Phone size={12} />
                <span>{p.telefone}</span>
              </div>
              <div className="col-span-2 text-sm text-foreground font-medium">{p.total_sessoes}</div>
              <div className="col-span-2 text-sm text-muted-foreground">{p.ultima_sessao || '—'}</div>
              <div className="col-span-2 flex items-center justify-between">
                <StatusBadge status={p.status_relacionamento} />
                <ChevronRight size={14} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && <PacienteModal onClose={() => setShowModal(false)} onSaved={reload} />}
      {selectedPaciente && <PacienteDrawer paciente={selectedPaciente} onClose={() => setSelectedPaciente(null)} />}
    </div>
  );
}