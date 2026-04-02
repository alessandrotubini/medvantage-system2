import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useClinica } from '@/lib/clinicaContext';
import { base44 } from '@/api/base44Client';

const DEMO_LANCAMENTOS = [
  { id: 'lc-001', descricao: 'Fisioterapia - Maria Fernanda', tipo: 'receita', valor: 150, data: '2026-04-01', status: 'pago', categoria: 'receita_atendimento' },
  { id: 'lc-002', descricao: 'Consulta Psicológica - João Pedro', tipo: 'receita', valor: 200, data: '2026-04-01', status: 'pendente', categoria: 'receita_atendimento' },
  { id: 'lc-003', descricao: 'Pacote Pilates - Lucia Pereira', tipo: 'receita', valor: 900, data: '2026-03-31', status: 'pago', categoria: 'receita_pacote' },
  { id: 'lc-004', descricao: 'Aluguel Sala', tipo: 'despesa', valor: 3500, data: '2026-04-01', status: 'pago', categoria: 'aluguel' },
  { id: 'lc-005', descricao: 'Materiais de Consumo', tipo: 'despesa', valor: 280, data: '2026-03-30', status: 'pago', categoria: 'materiais' },
  { id: 'lc-006', descricao: 'Consulta Nutricional - Carla', tipo: 'receita', valor: 180, data: '2026-03-30', status: 'pago', categoria: 'receita_atendimento' },
  { id: 'lc-007', descricao: 'Marketing - Instagram Ads', tipo: 'despesa', valor: 350, data: '2026-03-29', status: 'pago', categoria: 'marketing' },
  { id: 'lc-008', descricao: 'Pacote Fisioterapia - Roberto', tipo: 'receita', valor: 450, data: '2026-04-02', status: 'pendente', categoria: 'receita_pacote' },
];

const DEMO_CHART = [
  { mes: 'Nov', receita: 14200, despesa: 7800 },
  { mes: 'Dez', receita: 16500, despesa: 8200 },
  { mes: 'Jan', receita: 15800, despesa: 7600 },
  { mes: 'Fev', receita: 17200, despesa: 8400 },
  { mes: 'Mar', receita: 18750, despesa: 8900 },
  { mes: 'Abr', receita: 4300, despesa: 4130 },
];

function buildChartData(lancamentos) {
  const map = {};
  lancamentos.forEach(l => {
    if (!l.data) return;
    const mes = new Date(l.data).toLocaleDateString('pt-BR', { month: 'short' });
    if (!map[mes]) map[mes] = { mes, receita: 0, despesa: 0 };
    if (l.tipo === 'receita') map[mes].receita += l.valor || 0;
    else map[mes].despesa += l.valor || 0;
  });
  return Object.values(map).slice(-6);
}

export default function Financeiro() {
  const { clinica } = useClinica();
  const [tabAtiva, setTabAtiva] = useState('todos');
  const [lancamentos, setLancamentos] = useState([]);

  useEffect(() => {
    if (clinica?.id) {
      base44.entities.Lancamento.filter({ clinica_id: clinica.id }, '-data', 100).then(setLancamentos);
    }
  }, [clinica?.id]);

  const isReal = !!clinica?.id;
  const source = isReal ? lancamentos : DEMO_LANCAMENTOS;
  const chartData = isReal ? buildChartData(lancamentos) : DEMO_CHART;

  const filtrados = source.filter(l => {
    if (tabAtiva === 'todos') return true;
    if (tabAtiva === 'receitas') return l.tipo === 'receita';
    if (tabAtiva === 'despesas') return l.tipo === 'despesa';
    if (tabAtiva === 'pendentes') return l.status === 'pendente';
    return true;
  });

  const totalReceita = source.filter(l => l.tipo === 'receita' && l.status === 'pago').reduce((a, b) => a + (b.valor || 0), 0);
  const totalPendente = source.filter(l => l.status === 'pendente').reduce((a, b) => a + (b.valor || 0), 0);
  const totalDespesa = source.filter(l => l.tipo === 'despesa').reduce((a, b) => a + (b.valor || 0), 0);
  const lucroEstimado = totalReceita - totalDespesa;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        subtitle="Controle de receitas, despesas e pendências"
        action={<Button className="gap-2"><Plus size={16} />Novo Lançamento</Button>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-green-500" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Recebido</p>
          </div>
          <p className="text-2xl font-bold text-green-600">R$ {totalReceita.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={14} className="text-amber-500" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">A Receber</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">R$ {totalPendente.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={14} className="text-red-500" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Despesas</p>
          </div>
          <p className="text-2xl font-bold text-red-600">R$ {totalDespesa.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Lucro Bruto Est.</p>
          </div>
          <p className={`text-2xl font-bold ${lucroEstimado >= 0 ? 'text-primary' : 'text-red-600'}`}>R$ {lucroEstimado.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-foreground mb-4">Receitas vs Despesas (6 meses)</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => `R$ ${v.toLocaleString('pt-BR')}`} />
              <Bar dataKey="receita" fill="hsl(var(--chart-2))" radius={[4,4,0,0]} name="Receita" />
              <Bar dataKey="despesa" fill="hsl(var(--chart-5))" radius={[4,4,0,0]} name="Despesa" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum lançamento registrado ainda.</p>
        )}
      </div>

      {/* Lançamentos */}
      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Lançamentos</h2>
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            {[['todos','Todos'],['receitas','Receitas'],['despesas','Despesas'],['pendentes','Pendentes']].map(([k,l]) => (
              <button key={k} onClick={() => setTabAtiva(k)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${tabAtiva === k ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-border">
          {filtrados.length === 0 && (
            <p className="px-5 py-8 text-sm text-muted-foreground text-center">Nenhum lançamento encontrado.</p>
          )}
          {filtrados.map(l => (
            <div key={l.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${l.tipo === 'receita' ? 'bg-green-50' : 'bg-red-50'}`}>
                {l.tipo === 'receita' ? <TrendingUp size={14} className="text-green-600" /> : <TrendingDown size={14} className="text-red-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{l.descricao}</p>
                <p className="text-xs text-muted-foreground">{l.data} · {l.categoria?.replace(/_/g, ' ')}</p>
              </div>
              <StatusBadge status={l.status} />
              <p className={`text-sm font-bold min-w-24 text-right ${l.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                {l.tipo === 'receita' ? '+' : '-'} R$ {(l.valor || 0).toLocaleString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}