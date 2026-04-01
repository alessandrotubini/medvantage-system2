import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const DATA_ATENDIMENTOS = [
  { dia: 'Seg', total: 8, faltas: 1 },
  { dia: 'Ter', total: 6, faltas: 2 },
  { dia: 'Qua', total: 9, faltas: 0 },
  { dia: 'Qui', total: 7, faltas: 1 },
  { dia: 'Sex', total: 10, faltas: 1 },
  { dia: 'Sáb', total: 4, faltas: 0 },
];

const DATA_PROFISSIONAIS = [
  { nome: 'Dra. Ana Carolina', atendimentos: 42 },
  { nome: 'Dr. Ricardo Souza', atendimentos: 38 },
  { nome: 'Dra. Fernanda Lima', atendimentos: 31 },
  { nome: 'Dr. Marcos Oliveira', atendimentos: 27 },
];

const DATA_STATUS_PACIENTES = [
  { name: 'Recorrentes', value: 45, color: '#10B981' },
  { name: 'Novos', value: 18, color: '#0EA5E9' },
  { name: 'Inativos', value: 12, color: '#6B7280' },
  { name: 'Retorno Pendente', value: 5, color: '#F59E0B' },
];

const DATA_FATURAMENTO = [
  { mes: 'Out', valor: 12400 },
  { mes: 'Nov', valor: 14200 },
  { mes: 'Dez', valor: 16500 },
  { mes: 'Jan', valor: 15800 },
  { mes: 'Fev', valor: 17200 },
  { mes: 'Mar', valor: 18750 },
];

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('mes');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        subtitle="Análise da operação da clínica"
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

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Atendimentos', value: '156', sub: 'no período', icon: Calendar, color: 'text-primary bg-primary/10' },
          { label: 'Novos Pacientes', value: '18', sub: 'no período', icon: Users, color: 'text-green-600 bg-green-50' },
          { label: 'Taxa de Ocupação', value: '78%', sub: 'da agenda', icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
          { label: 'Índice de Faltas', value: '5.1%', sub: 'do total agendado', icon: AlertTriangle, color: 'text-orange-600 bg-orange-50' },
        ].map(card => (
          <div key={card.label} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${card.color}`}>
                <card.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atendimentos por dia */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Atendimentos por Dia da Semana</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DATA_ATENDIMENTOS} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[4,4,0,0]} name="Atendimentos" />
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
                <Pie data={DATA_STATUS_PACIENTES} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {DATA_STATUS_PACIENTES.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {DATA_STATUS_PACIENTES.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-muted-foreground flex-1">{d.name}</span>
                  <span className="text-xs font-semibold text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profissionais */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Atendimentos por Profissional</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={DATA_PROFISSIONAIS} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="nome" type="category" width={120} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="atendimentos" fill="hsl(var(--chart-2))" radius={[0,4,4,0]} name="Atendimentos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Faturamento */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Evolução do Faturamento</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={DATA_FATURAMENTO}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => `R$ ${v.toLocaleString('pt-BR')}`} />
              <Line type="monotone" dataKey="valor" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 4 }} name="Faturamento" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}