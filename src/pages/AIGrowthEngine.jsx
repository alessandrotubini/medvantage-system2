import React, { useState } from 'react';
import { Brain, UserX, Clock, Calendar, AlertTriangle, Lightbulb, Copy, Check, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import { DEMO_AI_INSIGHTS, DEMO_MENSAGENS_SUGERIDAS, DEMO_PACIENTES } from '@/lib/demoData';

const InsightCard = ({ insight }) => {
  const iconMap = { inativo: UserX, horario_fraco: Calendar, retorno: Clock, falta: AlertTriangle };
  const colorMap = {
    alta: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: 'text-red-500' },
    media: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500' },
  };
  const Icon = iconMap[insight.tipo] || Lightbulb;
  const colors = colorMap[insight.urgencia];

  return (
    <div className={`rounded-xl border p-4 ${colors.bg} ${colors.border}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-white/60 flex-shrink-0`}>
          <Icon size={18} className={colors.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-foreground">{insight.titulo}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${colors.badge}`}>
              {insight.urgencia === 'alta' ? '🔴 Alta' : '🟡 Média'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{insight.descricao}</p>
          {insight.pacientes && (
            <div className="mt-2 flex flex-wrap gap-1">
              {insight.pacientes.map(p => (
                <span key={p} className="px-2 py-0.5 bg-white/80 rounded-md text-xs font-medium text-foreground border border-white/40">{p}</span>
              ))}
            </div>
          )}
          {insight.sugestao && (
            <p className="mt-2 text-xs text-muted-foreground bg-white/50 rounded-lg px-3 py-2 border border-white/40">
              💡 {insight.sugestao}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const MensagemCard = ({ msg }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.mensagem);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-foreground">{msg.paciente}</p>
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1 h-7 px-2 text-xs">
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground bg-muted/40 rounded-lg p-3 leading-relaxed">{msg.mensagem}</p>
    </div>
  );
};

export default function AIGrowthEngine() {
  const [activeTab, setActiveTab] = useState('overview');

  const inativos = DEMO_PACIENTES.filter(p => p.status_relacionamento === 'inativo');
  const retornos = DEMO_PACIENTES.filter(p => p.status_relacionamento === 'retorno_pendente');

  const tabs = [
    { key: 'overview', label: '🧠 Visão Geral' },
    { key: 'inativos', label: '👥 Inativos' },
    { key: 'retornos', label: '🔄 Retornos' },
    { key: 'mensagens', label: '💬 Mensagens' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Growth Engine"
        subtitle="Inteligência para crescimento e retenção da clínica"
      />

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Brain size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold">AI Growth Engine Ativo</h2>
            <p className="text-cyan-100 mt-1 text-sm">Analisando padrões da sua clínica continuamente. {DEMO_AI_INSIGHTS.length} oportunidades identificadas hoje.</p>
            <div className="flex gap-4 mt-3">
              <div className="bg-white/10 rounded-lg px-3 py-2 text-center">
                <p className="text-xl font-bold">{inativos.length}</p>
                <p className="text-xs text-cyan-200">Inativos</p>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2 text-center">
                <p className="text-xl font-bold">{retornos.length}</p>
                <p className="text-xs text-cyan-200">Retornos</p>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2 text-center">
                <p className="text-xl font-bold">2</p>
                <p className="text-xs text-cyan-200">Horários Fracos</p>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2 text-center">
                <p className="text-xl font-bold">R$ 2.4k</p>
                <p className="text-xs text-cyan-200">Oportunidade</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Insights & Oportunidades</h3>
          {DEMO_AI_INSIGHTS.map((insight, i) => <InsightCard key={i} insight={insight} />)}
        </div>
      )}

      {activeTab === 'inativos' && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Pacientes Inativos ({inativos.length})</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Pacientes que não retornam há mais de 30 dias</p>
            </div>
            <div className="divide-y divide-border">
              {inativos.map(p => (
                <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">
                    {p.nome[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{p.nome}</p>
                    <p className="text-xs text-muted-foreground">{p.total_sessoes} sessões · Última: {p.ultima_sessao}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-md font-medium">
                      {p.ultima_sessao ? Math.floor((new Date() - new Date(p.ultima_sessao)) / (1000*60*60*24)) : '?'} dias
                    </span>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Contatar</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'retornos' && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Retornos Pendentes ({retornos.length})</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Pacientes no momento ideal para retorno</p>
            </div>
            <div className="divide-y divide-border">
              {retornos.map(p => (
                <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold text-sm flex-shrink-0">
                    {p.nome[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{p.nome}</p>
                    <p className="text-xs text-muted-foreground">Última sessão: {p.ultima_sessao}</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs gap-1">
                    <Zap size={12} className="text-amber-500" /> Agendar Retorno
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mensagens' && (
        <div className="space-y-4">
          <div className="bg-accent/50 border border-accent rounded-xl p-4">
            <p className="text-sm font-medium text-accent-foreground flex items-center gap-2">
              <Lightbulb size={16} className="text-primary" />
              Mensagens sugeridas pela IA para reativar pacientes. Copie e envie pelo WhatsApp ou outro canal de sua preferência.
            </p>
          </div>
          {DEMO_MENSAGENS_SUGERIDAS.map((msg, i) => <MensagemCard key={i} msg={msg} />)}
        </div>
      )}
    </div>
  );
}