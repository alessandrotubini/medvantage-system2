import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ClipboardList, Package, DollarSign, AlertTriangle, Brain, TrendingUp, Clock, UserX } from 'lucide-react';
import StatCard from '@/components/shared/StatCard';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { useClinica } from '@/lib/clinicaContext';
import { useClinicaData, calcularKPIs } from '@/hooks/useClinicaData';
import { DEMO_KPI, DEMO_ATENDIMENTOS_HOJE, DEMO_AI_INSIGHTS, DEMO_PACIENTES } from '@/lib/demoData';

export default function Dashboard() {
  const { clinica } = useClinica();
  const hoje = new Date().toISOString().split('T')[0];
  const hojeLabel = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  const { pacientes, atendimentosHoje, sessoesPacotes, lancamentos, loading } = useClinicaData(clinica?.id);

  const isReal = !!clinica?.id;

  const kpi = isReal
    ? calcularKPIs({ pacientes, atendimentos: [], atendimentosHoje, sessoesPacotes, lancamentos }, hoje)
    : DEMO_KPI;

  const agendaHoje = isReal ? atendimentosHoje : DEMO_ATENDIMENTOS_HOJE;
  const pacientesRecentes = isReal ? [...pacientes].sort((a, b) => (b.updated_date || '').localeCompare(a.updated_date || '')).slice(0, 5) : DEMO_PACIENTES.slice(0, 5);

  // AI alerts from real data
  const alertasAI = isReal ? [
    kpi.pacientes_inativos > 0 && {
      titulo: `${kpi.pacientes_inativos} paciente(s) inativo(s) há mais de 30 dias`,
      descricao: 'Excelente oportunidade de recuperação. Considere entrar em contato.',
      urgencia: 'alta',
    },
    kpi.retornos_pendentes > 0 && {
      titulo: `${kpi.retornos_pendentes} paciente(s) no ponto ideal de retorno`,
      descricao: 'Com base no histórico de cada paciente, é hora de acionar esses contatos.',
      urgencia: 'alta',
    },
    kpi.faltas_mes > 2 && {
      titulo: `${kpi.faltas_mes} faltas/cancelamentos este mês`,
      descricao: 'Envie lembretes automáticos para reduzir o índice de faltas.',
      urgencia: 'media',
    },
  ].filter(Boolean) : DEMO_AI_INSIGHTS.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Bom dia! 👋`}
        subtitle={`${hojeLabel} · ${clinica?.nome || 'Clínica'}`}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Atendimentos Hoje" value={kpi.atendimentos_hoje} icon={Calendar} color="blue" subtitle="agendamentos de hoje" />
        <StatCard title="Pacientes Inativos" value={kpi.pacientes_inativos} icon={UserX} color="orange" subtitle="Oportunidade de reativação" />
        <StatCard title="Retornos Pendentes" value={kpi.retornos_pendentes} icon={Clock} color="amber" subtitle="No ponto ideal" />
        <StatCard title="Sessões em Andamento" value={kpi.sessoes_em_andamento} icon={Package} color="purple" subtitle="pacotes ativos" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Faltas no Mês" value={kpi.faltas_mes} icon={AlertTriangle} color="red" subtitle="faltas e cancelamentos" />
        <StatCard title="Contas a Receber" value={`R$ ${kpi.contas_receber.toLocaleString('pt-BR')}`} icon={DollarSign} color="amber" subtitle="lançamentos pendentes" />
        <StatCard title="Faturamento do Mês" value={`R$ ${kpi.faturamento_mes.toLocaleString('pt-BR')}`} icon={TrendingUp} color="green" subtitle="receitas confirmadas" />
        <StatCard title="Alertas AI" value={kpi.alertas_ai} icon={Brain} color="cyan" subtitle="Oportunidades identificadas" />
      </div>

      {/* Body grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda do Dia */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Agenda de Hoje</h2>
            <Link to="/agenda" className="text-xs text-primary hover:underline font-medium">Ver completa →</Link>
          </div>
          <div className="divide-y divide-border">
            {agendaHoje.length === 0 && !loading && (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">Nenhum atendimento agendado para hoje.</div>
            )}
            {agendaHoje.map((at) => (
              <div key={at.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors">
                <span className="text-sm font-mono text-muted-foreground w-12 flex-shrink-0">{at.hora_inicio}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{at.paciente || at.paciente_id}</p>
                  <p className="text-xs text-muted-foreground truncate">{at.profissional || at.profissional_id} · {at.servico || at.servico_id}</p>
                </div>
                <StatusBadge status={at.status} />
              </div>
            ))}
          </div>
        </div>

        {/* AI Growth Alerts */}
        <div className="bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-cyan-500" />
              <h2 className="font-semibold text-foreground">AI Growth Engine</h2>
            </div>
            <Link to="/ai-growth" className="text-xs text-primary hover:underline font-medium">Ver tudo →</Link>
          </div>
          <div className="p-4 space-y-3">
            {alertasAI.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum alerta no momento.</p>
            )}
            {alertasAI.map((insight, i) => (
              <div key={i} className={`p-3 rounded-lg border ${insight.urgencia === 'alta' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                <p className="text-xs font-semibold text-foreground">{insight.titulo}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{insight.descricao}</p>
                <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${insight.urgencia === 'alta' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {insight.urgencia === 'alta' ? '🔴 Alta' : '🟡 Média'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pacientes recentes */}
      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Pacientes Recentes</h2>
          <Link to="/pacientes" className="text-xs text-primary hover:underline font-medium">Ver todos →</Link>
        </div>
        <div className="divide-y divide-border">
          {pacientesRecentes.length === 0 && !loading && (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">Nenhum paciente cadastrado ainda.</div>
          )}
          {pacientesRecentes.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                {p.nome[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{p.nome}</p>
                <p className="text-xs text-muted-foreground">{p.total_sessoes || 0} sessões · Última: {p.ultima_sessao || '—'}</p>
              </div>
              <StatusBadge status={p.status_relacionamento || 'novo'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}