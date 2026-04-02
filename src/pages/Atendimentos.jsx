import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import AtendimentoModal from '@/components/atendimentos/AtendimentoModal';
import { DEMO_ATENDIMENTOS_HOJE } from '@/lib/demoData';
import { useClinica } from '@/lib/clinicaContext';
import { base44 } from '@/api/base44Client';
import { resolveName } from '@/hooks/useClinicaData';

export default function Atendimentos() {
  const { clinica } = useClinica();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [atendimentos, setAtendimentos] = useState([]);
  const [pacientesMap, setPacientesMap] = useState({});
  const [profissionaisMap, setProfissionaisMap] = useState({});
  const [servicosMap, setServicosMap] = useState({});

  useEffect(() => {
    if (!clinica?.id) return;
    Promise.all([
      base44.entities.Atendimento.filter({ clinica_id: clinica.id }, '-data', 100),
      base44.entities.Paciente.filter({ clinica_id: clinica.id }),
      base44.entities.Profissional.filter({ clinica_id: clinica.id }),
      base44.entities.Servico.filter({ clinica_id: clinica.id }),
    ]).then(([ats, pacs, profs, servs]) => {
      setAtendimentos(ats);
      setPacientesMap(Object.fromEntries(pacs.map(p => [p.id, p.nome])));
      setProfissionaisMap(Object.fromEntries(profs.map(p => [p.id, p.nome])));
      setServicosMap(Object.fromEntries(servs.map(s => [s.id, s.nome])));
    });
  }, [clinica?.id]);

  const reload = () => {
    if (clinica?.id) base44.entities.Atendimento.filter({ clinica_id: clinica.id }, '-data', 100).then(setAtendimentos);
  };

  const isReal = !!clinica?.id;
  const source = isReal ? atendimentos : DEMO_ATENDIMENTOS_HOJE;

  // Helper: resolve nome para exibição (suporta modo demo e modo real)
  const nomePaciente = (at) => isReal ? resolveName(pacientesMap, at.paciente_id, at.paciente_id) : at.paciente;
  const nomeProfissional = (at) => isReal ? resolveName(profissionaisMap, at.profissional_id, at.profissional_id) : at.profissional;
  const nomeServico = (at) => isReal ? resolveName(servicosMap, at.servico_id, '—') : at.servico;

  const filtered = source.filter(a => {
    const pac = nomePaciente(a).toLowerCase();
    const prof = nomeProfissional(a).toLowerCase();
    return pac.includes(search.toLowerCase()) || prof.includes(search.toLowerCase());
  });

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
          <span className="col-span-2">Data / Hora</span>
          <span className="col-span-3">Paciente</span>
          <span className="col-span-3">Profissional</span>
          <span className="col-span-2">Serviço</span>
          <span className="col-span-2">Status</span>
        </div>
        <div className="divide-y divide-border">
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">Nenhum atendimento encontrado.</div>
          )}
          {filtered.map(at => (
            <div key={at.id} onClick={() => setSelected(at)}
              className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-muted/20 cursor-pointer transition-colors">
              <div className="col-span-2 text-xs text-muted-foreground">
                <p className="font-mono">{at.hora_inicio}</p>
                {at.data && <p className="text-[10px] mt-0.5">{new Date(at.data + 'T00:00:00').toLocaleDateString('pt-BR')}</p>}
              </div>
              <div className="col-span-3 text-sm font-medium text-foreground truncate">{nomePaciente(at)}</div>
              <div className="col-span-3 text-sm text-muted-foreground truncate">{nomeProfissional(at)}</div>
              <div className="col-span-2 text-sm text-muted-foreground truncate">{nomeServico(at)}</div>
              <div className="col-span-2"><StatusBadge status={at.status} /></div>
            </div>
          ))}
        </div>
      </div>

      {showModal && <AtendimentoModal onClose={() => setShowModal(false)} onSaved={reload} />}
      {selected && <AtendimentoModal onClose={() => setSelected(null)} atendimento={selected} onSaved={reload} />}
    </div>
  );
}