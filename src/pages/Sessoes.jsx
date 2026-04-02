import React, { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import SessaoModal from '@/components/sessoes/SessaoModal';
import { useClinica } from '@/lib/clinicaContext';
import { base44 } from '@/api/base44Client';
import { resolveName } from '@/hooks/useClinicaData';

const DEMO_PACOTES = [
  { id: 'pk-001', nome_pacote: 'Pacote Fisioterapia 10x', paciente: 'Maria Fernanda Costa', servico: 'Fisioterapia Individual', total_sessoes: 10, sessoes_realizadas: 7, sessoes_restantes: 3, valor_total: 1350, valor_pago: 1350, status: 'ativo', data_validade: '2026-06-30' },
  { id: 'pk-002', nome_pacote: 'Acompanhamento Psicológico', paciente: 'João Pedro Almeida', servico: 'Consulta Psicológica', total_sessoes: 8, sessoes_realizadas: 8, sessoes_restantes: 0, valor_total: 1600, valor_pago: 1600, status: 'concluido', data_validade: '2026-03-15' },
  { id: 'pk-003', nome_pacote: 'Pilates Clínico 15x', paciente: 'Lucia Pereira', servico: 'Pilates Clínico', total_sessoes: 15, sessoes_realizadas: 10, sessoes_restantes: 5, valor_total: 1800, valor_pago: 900, status: 'ativo', data_validade: '2026-08-30' },
  { id: 'pk-004', nome_pacote: 'Nutrição Recorrente', paciente: 'Carla Beatriz Santos', servico: 'Consulta Nutricional', total_sessoes: 4, sessoes_realizadas: 1, sessoes_restantes: 3, valor_total: 680, valor_pago: 170, status: 'ativo', data_validade: '2026-09-30' },
];

export default function Sessoes() {
  const { clinica } = useClinica();
  const [showModal, setShowModal] = useState(false);
  const [pacotes, setPacotes] = useState([]);
  const [pacientesMap, setPacientesMap] = useState({});
  const [servicosMap, setServicosMap] = useState({});

  useEffect(() => {
    if (!clinica?.id) return;
    Promise.all([
      base44.entities.SessaoPacote.filter({ clinica_id: clinica.id }),
      base44.entities.Paciente.filter({ clinica_id: clinica.id }),
      base44.entities.Servico.filter({ clinica_id: clinica.id }),
    ]).then(([pks, pacs, servs]) => {
      setPacotes(pks);
      setPacientesMap(Object.fromEntries(pacs.map(p => [p.id, p.nome])));
      setServicosMap(Object.fromEntries(servs.map(s => [s.id, s.nome])));
    });
  }, [clinica?.id]);

  const reload = () => {
    if (clinica?.id) base44.entities.SessaoPacote.filter({ clinica_id: clinica.id }).then(setPacotes);
  };

  const isReal = !!clinica?.id;
  const source = isReal ? pacotes : DEMO_PACOTES;

  const nomePaciente = (pk) => isReal ? resolveName(pacientesMap, pk.paciente_id) : pk.paciente;
  const nomeServico = (pk) => isReal ? resolveName(servicosMap, pk.servico_id, '—') : pk.servico;

  // KPIs reais
  const ativos = source.filter(pk => pk.status === 'ativo').length;
  const aReceber = isReal
    ? source.reduce((acc, pk) => acc + ((pk.valor_total || 0) - (pk.valor_pago || 0)), 0)
    : 1710;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Sessões & Pacotes"
        subtitle="Acompanhe pacotes e planos de tratamento"
        action={<Button onClick={() => setShowModal(true)} className="gap-2"><Plus size={16} />Novo Pacote</Button>}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Pacotes Ativos</p>
          <p className="text-2xl font-bold text-foreground mt-1">{ativos}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total de Pacotes</p>
          <p className="text-2xl font-bold text-foreground mt-1">{source.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">A Receber (Pacotes)</p>
          <p className="text-2xl font-bold text-foreground mt-1">R$ {aReceber.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Pacotes List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Pacotes e Planos</h2>
        </div>
        <div className="divide-y divide-border">
          {source.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">Nenhum pacote cadastrado ainda.</div>
          )}
          {source.map(pk => {
            const total = pk.total_sessoes || 1;
            const realizadas = pk.sessoes_realizadas || 0;
            const pct = Math.round((realizadas / total) * 100);
            return (
              <div key={pk.id} className="px-5 py-4 hover:bg-muted/20 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{pk.nome_pacote}</p>
                      <p className="text-xs text-muted-foreground">{nomePaciente(pk)} · {nomeServico(pk)}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>{realizadas} de {total} sessões</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <StatusBadge status={pk.status} />
                    {pk.data_validade && <p className="text-xs text-muted-foreground">Válido até {pk.data_validade}</p>}
                    <p className="text-sm font-semibold text-foreground">R$ {(pk.valor_total || 0).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && <SessaoModal onClose={() => setShowModal(false)} onSaved={reload} />}
    </div>
  );
}