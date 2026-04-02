import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, AlertTriangle, DollarSign, Package, UserX } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { useClinica } from '@/lib/clinicaContext';
import { base44 } from '@/api/base44Client';

// ─── DEMO DATA ───────────────────────────────────────────────────────────────
const DEMO = {
  kpis: { totalAtendimentos: 156, novosPacientes: 18, taxaOcupacao: 78, indiceFaltas: 5.1, faturamento: 18750, pacotesAtivos: 12 },
  porDiaSemana: [
    { dia: 'Seg', total: 8, faltas: 1 }, { dia: 'Ter', total: 6, faltas: 2 },
    { dia: 'Qua', total: 9, faltas: 0 }, { dia: 'Qui', total: 7, faltas: 1 },
    { dia: 'Sex', total: 10, faltas: 1 }, { dia: 'Sáb', total: 4, faltas: 0 },
  ],
  profissionais: [
    { nome: 'Dra. Ana Carolina', atendimentos: 42 }, { nome: 'Dr. Ricardo Souza', atendimentos: 38 },
    { nome: 'Dra. Fernanda Lima', atendimentos: 31 }, { nome: 'Dr. Marcos Oliveira', atendimentos: 27 },
  ],
  statusPacientes: [
    { name: 'Recorrentes', value: 45, color: '#10B981' }, { name: 'Novos', value: 18, color: '#0EA5E9' },
    { name: 'Inativos', value: 12, color: '#6B7280' }, { name: 'Retorno Pendente', value: 5, color: '#F59E0B' },
  ],
  faturamento: [
    { mes: 'Out', valor: 12400 }, { mes: 'Nov', valor: 14200 }, { mes: 'Dez', valor: 16500 },
    { mes: 'Jan', valor: 15800 }, { mes: 'Fev', valor: 17200 }, { mes: 'Mar', valor: 18750 },
  ],
  servicos: [
    { nome: 'Fisioterapia', total: 48 }, { nome: 'Psicologia', total: 36 },
    { nome: 'Pilates', total: 29 }, { nome: 'Nutrição', total: 21 }, { nome: 'Ortopedia', total: 14 },
  ],
};

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

// Retorna a data ISO de início do período selecionado
function getPeriodStart(periodo) {
  const now = new Date();
  if (periodo === 'semana') { const d = new Date(now); d.setDate(now.getDate() - 7); return d.toISOString().split('T')[0]; }
  if (periodo === 'mes') { const d = new Date(now); d.setDate(now.getDate() - 30); return d.toISOString().split('T')[0]; }
  if (periodo === 'trimestre') { const d = new Date(now); d.setDate(now.getDate() - 90); return d.toISOString().split('T')[0]; }
  return null;
}

export default function Relatorios() {
  const { clinica } = useClinica();
  const [periodo, setPeriodo] = useState('mes');
  const [atendimentos, setAtendimentos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [pacotes, setPacotes] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  const isReal = !!clinica?.id;

  useEffect(() => {
    if (!isReal) return;
    setLoading(true);
    Promise.all([
      base44.entities.Atendimento.filter({ clinica_id: clinica.id }, '-data', 500),
      base44.entities.Paciente.filter({ clinica_id: clinica.id }),
      base44.entities.Profissional.filter({ clinica_id: clinica.id }),
      base44.entities.Servico.filter({ clinica_id: clinica.id }),
      base44.entities.SessaoPacote.filter({ clinica_id: clinica.id }),
      base44.entities.Lancamento.filter({ clinica_id: clinica.id }, '-data', 500),
    ]).then(([ats, pacs, profs, servs, pkts, lans]) => {
      setAtendimentos(ats);
      setPacientes(pacs);
      setProfissionais(profs);
      setServicos(servs);
      setPacotes(pkts);
      setLancamentos(lans);
      setLoading(false);
    });
  }, [clinica?.id]);

  // ─── DADOS REAIS CALCULADOS ───────────────────────────────────────────────
  const dados = useMemo(() => {
    if (!isReal) return null;

    const inicio = getPeriodStart(periodo);
    const atsFiltrados = inicio ? atendimentos.filter(a => a.data >= inicio) : atendimentos;
    const lancsFiltrados = inicio ? lancamentos.filter(l => l.data >= inicio) : lancamentos;

    // KPIs
    const totalAtendimentos = atsFiltrados.filter(a => a.status === 'concluido').length;
    const faltas = atsFiltrados.filter(a => a.status === 'falta' || a.status === 'cancelado').length;
    const totalAgendados = atsFiltrados.length;
    const indiceFaltas = totalAgendados > 0 ? ((faltas / totalAgendados) * 100).toFixed(1) : 0;

    // Novos pacientes no período
    const novosPacientes = pacientes.filter(p => p.status_relacionamento === 'novo').length;

    // Faturamento real (receitas pagas no período)
    const faturamento = lancsFiltrados
      .filter(l => l.tipo === 'receita' && l.status === 'pago')
      .reduce((acc, l) => acc + (l.valor || 0), 0);

    // Pacotes ativos
    const pacotesAtivos = pacotes.filter(p => p.status === 'ativo').length;

    // Ocupação (% de slots preenchidos vs disponíveis, estimativa: 8h/dia, 30min/slot = 16 slots/dia)
    const diasPeriodo = periodo === 'semana' ? 7 : periodo === 'mes' ? 30 : 90;
    const totalSlots = diasPeriodo * 16;
    const taxaOcupacao = totalSlots > 0 ? Math.min(Math.round((totalAgendados / totalSlots) * 100), 100) : 0;

    // Atendimentos por dia da semana
    const porDia = { 0:0,1:0,2:0,3:0,4:0,5:0,6:0 };
    const faltasPorDia = { 0:0,1:0,2:0,3:0,4:0,5:0,6:0 };
    atsFiltrados.forEach(a => {
      if (!a.data) return;
      const dow = new Date(a.data + 'T00:00:00').getDay();
      if (a.status === 'concluido') porDia[dow]++;
      if (a.status === 'falta') faltasPorDia[dow]++;
    });
    const porDiaSemana = DIAS_SEMANA.map((dia, i) => ({ dia, total: porDia[i], faltas: faltasPorDia[i] })).filter((_, i) => i >= 1 && i <= 6);

    // Atendimentos por profissional
    const profMap = {};
    atsFiltrados.forEach(a => {
      if (!a.profissional_id) return;
      profMap[a.profissional_id] = (profMap[a.profissional_id] || 0) + 1;
    });
    const profsList = profissionais.map(p => ({ nome: p.nome.split(' ').slice(0,2).join(' '), atendimentos: profMap[p.id] || 0 }))
      .filter(p => p.atendimentos > 0).sort((a,b) => b.atendimentos - a.atendimentos).slice(0, 6);

    // Status pacientes
    const statusCount = { novo: 0, recorrente: 0, inativo: 0, retorno_pendente: 0, alta: 0 };
    pacientes.forEach(p => { if (statusCount[p.status_relacionamento] !== undefined) statusCount[p.status_relacionamento]++; });
    const statusPacientes = [
      { name: 'Recorrentes', value: statusCount.recorrente, color: '#10B981' },
      { name: 'Novos', value: statusCount.novo, color: '#0EA5E9' },
      { name: 'Inativos', value: statusCount.inativo, color: '#6B7280' },
      { name: 'Retorno Pendente', value: statusCount.retorno_pendente, color: '#F59E0B' },
      { name: 'Alta', value: statusCount.alta, color: '#8B5CF6' },
    ].filter(s => s.value > 0);

    // Faturamento mensal (últimos 6 meses)
    const now = new Date();
    const faturamentoMensal = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const mesStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const valor = lancamentos
        .filter(l => l.tipo === 'receita' && l.status === 'pago' && l.data?.startsWith(mesStr))
        .reduce((acc, l) => acc + (l.valor || 0), 0);
      return { mes: MESES[d.getMonth()], valor };
    });

    // Serviços mais utilizados
    const servicoMap = {};
    atsFiltrados.forEach(a => {
      if (!a.servico_id) return;
      servicoMap[a.servico_id] = (servicoMap[a.servico_id] || 0) + 1;
    });
    const servicosList = servicos.map(s => ({ nome: s.nome, total: servicoMap[s.id] || 0 }))
      .filter(s => s.total > 0).sort((a,b) => b.total - a.total).slice(0, 6);

    return {
      kpis: { totalAtendimentos, novosPacientes, taxaOcupacao, indiceFaltas, faturamento, pacotesAtivos },
      porDiaSemana,
      profissionais: profsList,
      statusPacientes,
      faturamento: faturamentoMensal,
      servicos: servicosList,
    };
  }, [isReal, atendimentos, pacientes, profissionais, servicos, pacotes, lancamentos, periodo]);

  const d = isReal ? (dados || {}) : DEMO;
  const kpis = d.kpis || DEMO.kpis;

  const kpiCards = [
    { label: 'Total Atendimentos', value: kpis.totalAtendimentos?.toString() || '0', sub: 'no período', icon: Calendar, color: 'text-primary bg-primary/10' },
    { label: 'Novos Pacientes', value: kpis.novosPacientes?.toString() || '0', sub: 'status "novo"', icon: Users, color: 'text-green-600 bg-green-50' },
    { label: 'Taxa de Ocupação', value: `${kpis.taxaOcupacao || 0}%`, sub: 'da agenda', icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
    { label: 'Índice de Faltas', value: `${kpis.indiceFaltas || 0}%`, sub: 'do total agendado', icon: AlertTriangle, color: 'text-orange-600 bg-orange-50' },
    { label: 'Faturamento', value: `R$ ${(kpis.faturamento || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, sub: 'receitas pagas', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pacotes Ativos', value: kpis.pacotesAtivos?.toString() || '0', sub: 'em andamento', icon: Package, color: 'text-cyan-600 bg-cyan-50' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        subtitle={isReal ? `Dados reais da clínica${loading ? ' · carregando...' : ''}` : 'Modo demonstração — dados fictícios'}
        action={
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            {[['semana','Semana'],['mes','Mês'],['trimestre','Trimestre']].map(([k,l]) => (
              <button key={k} onClick={() => setPeriodo(k)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${periodo === k ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {l}
              </button>
            ))}
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map(card => (
          <div key={card.label} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium leading-tight">{card.label}</p>
                <p className="text-xl font-bold text-foreground mt-1 truncate">{card.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{card.sub}</p>
              </div>
              <div className={`p-2 rounded-lg flex-shrink-0 ${card.color}`}>
                <card.icon size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atendimentos por dia da semana */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Atendimentos por Dia da Semana</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={d.porDiaSemana || DEMO.porDiaSemana} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[4,4,0,0]} name="Realizados" />
              <Bar dataKey="faltas" fill="hsl(var(--chart-5))" radius={[4,4,0,0]} name="Faltas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pacientes */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Distribuição de Pacientes</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={d.statusPacientes || DEMO.statusPacientes} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {(d.statusPacientes || DEMO.statusPacientes).map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {(d.statusPacientes || DEMO.statusPacientes).map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
                  <span className="text-xs font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Atendimentos por profissional */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Atendimentos por Profissional</h3>
          {(d.profissionais || DEMO.profissionais).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">Nenhum atendimento no período.</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={d.profissionais || DEMO.profissionais} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="nome" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="atendimentos" fill="hsl(var(--chart-2))" radius={[0,4,4,0]} name="Atendimentos" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Faturamento mensal */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Evolução do Faturamento (6 meses)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={d.faturamento || DEMO.faturamento}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`R$ ${v.toLocaleString('pt-BR')}`, 'Faturamento']} />
              <Line type="monotone" dataKey="valor" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 4 }} name="Faturamento" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Serviços mais utilizados */}
        <div className="bg-card rounded-xl border border-border p-5 lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">Serviços / Procedimentos Mais Utilizados</h3>
          {(d.servicos || DEMO.servicos).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum serviço registrado no período.</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={d.servicos || DEMO.servicos} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="nome" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" fill="hsl(var(--chart-3))" radius={[4,4,0,0]} name="Usos" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}