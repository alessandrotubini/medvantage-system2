import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain, UserX, Clock, Calendar, AlertTriangle, Lightbulb,
  Copy, Check, TrendingUp, Zap, Loader2, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import { DEMO_AI_INSIGHTS, DEMO_MENSAGENS_SUGERIDAS, DEMO_PACIENTES } from '@/lib/demoData';
import { useClinica } from '@/lib/clinicaContext';
import { base44 } from '@/api/base44Client';

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
const DEMO_INATIVOS = DEMO_PACIENTES.filter(p => p.status_relacionamento === 'inativo');
const DEMO_RETORNOS = DEMO_PACIENTES.filter(p => p.status_relacionamento === 'retorno_pendente');

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function diasDesde(dataStr) {
  if (!dataStr) return null;
  return Math.floor((new Date() - new Date(dataStr + 'T00:00:00')) / (1000 * 60 * 60 * 24));
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
const InsightCard = ({ insight }) => {
  const iconMap = { inativo: UserX, horario_fraco: Calendar, retorno: Clock, falta: AlertTriangle };
  const colorMap = {
    alta: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: 'text-red-500' },
    media: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500' },
  };
  const Icon = iconMap[insight.tipo] || Lightbulb;
  const colors = colorMap[insight.urgencia] || colorMap.media;

  return (
    <div className={`rounded-xl border p-4 ${colors.bg} ${colors.border}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white/60 flex-shrink-0">
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
          {insight.pacientes?.length > 0 && (
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
        <div>
          <p className="text-sm font-semibold text-foreground">{msg.paciente}</p>
          {msg.motivo && <p className="text-xs text-muted-foreground">{msg.motivo}</p>}
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1 h-7 px-2 text-xs">
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground bg-muted/40 rounded-lg p-3 leading-relaxed">{msg.mensagem}</p>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AIGrowthEngine() {
  const { clinica } = useClinica();
  const [activeTab, setActiveTab] = useState('overview');
  const [pacientes, setPacientes] = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const [gerandoMensagens, setGerandoMensagens] = useState(false);

  const isReal = !!clinica?.id;

  useEffect(() => {
    if (!isReal) return;
    setLoading(true);
    Promise.all([
      base44.entities.Paciente.filter({ clinica_id: clinica.id }),
      base44.entities.Atendimento.filter({ clinica_id: clinica.id }, '-data', 300),
    ]).then(([pacs, ats]) => {
      setPacientes(pacs);
      setAtendimentos(ats);
      setLoading(false);
    });
  }, [clinica?.id]);

  // ─── ANÁLISE REAL ───────────────────────────────────────────────────────────
  const analise = useMemo(() => {
    if (!isReal) return null;

    // Inativos: status inativo ou sem atendimento há +30 dias
    const inativos = pacientes.filter(p =>
      p.status_relacionamento === 'inativo' ||
      (p.ultima_sessao && diasDesde(p.ultima_sessao) > 30 && p.status_relacionamento !== 'alta')
    ).sort((a, b) => diasDesde(b.ultima_sessao) - diasDesde(a.ultima_sessao));

    // Retornos pendentes
    const retornos = pacientes.filter(p => p.status_relacionamento === 'retorno_pendente');

    // Faltas no último mês
    const umMesAtras = new Date(); umMesAtras.setDate(umMesAtras.getDate() - 30);
    const umMesStr = umMesAtras.toISOString().split('T')[0];
    const faltasRecentes = atendimentos.filter(a => a.status === 'falta' && a.data >= umMesStr);

    // Horários fracos (horas com menos de 2 atendimentos)
    const horaCount = {};
    atendimentos.filter(a => a.status === 'concluido').forEach(a => {
      if (!a.hora_inicio) return;
      const h = a.hora_inicio.substring(0, 2);
      horaCount[h] = (horaCount[h] || 0) + 1;
    });
    const horasFracas = Object.entries(horaCount).filter(([, v]) => v <= 1).map(([h]) => `${h}:00`);

    // Insights gerados
    const insights = [];

    if (inativos.length > 0) {
      insights.push({
        tipo: 'inativo', urgencia: inativos.length >= 5 ? 'alta' : 'media',
        titulo: `${inativos.length} paciente${inativos.length > 1 ? 's' : ''} inativo${inativos.length > 1 ? 's' : ''}`,
        descricao: `${inativos.length} paciente${inativos.length > 1 ? 's' : ''} não retornam há mais de 30 dias. Reativar esse grupo pode gerar receita imediata.`,
        pacientes: inativos.slice(0, 4).map(p => p.nome.split(' ')[0]),
        sugestao: 'Envie uma mensagem personalizada com IA para reativar esses pacientes.',
      });
    }

    if (retornos.length > 0) {
      insights.push({
        tipo: 'retorno', urgencia: 'media',
        titulo: `${retornos.length} retorno${retornos.length > 1 ? 's' : ''} pendente${retornos.length > 1 ? 's' : ''}`,
        descricao: `${retornos.length} paciente${retornos.length > 1 ? 's estão prontos' : ' está pronto'} para retorno. É o momento ideal para reagendar.`,
        pacientes: retornos.slice(0, 4).map(p => p.nome.split(' ')[0]),
        sugestao: 'Contate agora — pacientes em retorno pendente têm alta taxa de conversão.',
      });
    }

    if (faltasRecentes.length > 0) {
      const taxa = ((faltasRecentes.length / Math.max(atendimentos.filter(a => a.data >= umMesStr).length, 1)) * 100).toFixed(0);
      insights.push({
        tipo: 'falta', urgencia: faltasRecentes.length >= 5 ? 'alta' : 'media',
        titulo: `${faltasRecentes.length} falta${faltasRecentes.length > 1 ? 's' : ''} no último mês (${taxa}%)`,
        descricao: `Taxa de faltas acima do ideal. Cada falta representa receita perdida e slot desperdiçado.`,
        sugestao: 'Considere enviar lembretes 24h antes dos atendimentos para reduzir faltas.',
      });
    }

    if (horasFracas.length > 0) {
      insights.push({
        tipo: 'horario_fraco', urgencia: 'media',
        titulo: `${horasFracas.length} horário${horasFracas.length > 1 ? 's' : ''} com baixa ocupação`,
        descricao: `Os horários ${horasFracas.slice(0, 3).join(', ')} têm poucos agendamentos. Há espaço para crescer.`,
        sugestao: 'Ofereça desconto ou promoção nesses horários para aumentar a ocupação.',
      });
    }

    if (insights.length === 0) {
      insights.push({
        tipo: 'retorno', urgencia: 'media',
        titulo: 'Clínica com boa ocupação!',
        descricao: 'Não foram identificadas oportunidades críticas no momento. Continue monitorando.',
        sugestao: 'Cadastre mais pacientes e atendimentos para análises mais precisas.',
      });
    }

    // Oportunidade financeira estimada
    const ticketMedio = atendimentos.filter(a => a.valor > 0).reduce((acc, a, _, arr) => acc + a.valor / arr.length, 0) || 150;
    const oportunidade = Math.round((inativos.length + retornos.length) * ticketMedio);

    return { inativos, retornos, faltasRecentes, horasFracas, insights, oportunidade };
  }, [isReal, pacientes, atendimentos]);

  // ─── DADOS PARA EXIBIÇÃO ────────────────────────────────────────────────────
  const displayInativos = isReal ? (analise?.inativos || []) : DEMO_INATIVOS;
  const displayRetornos = isReal ? (analise?.retornos || []) : DEMO_RETORNOS;
  const displayInsights = isReal ? (analise?.insights || []) : DEMO_AI_INSIGHTS;
  const oportunidade = isReal
    ? `R$ ${((analise?.oportunidade || 0)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
    : 'R$ 2.4k';

  // ─── GERAÇÃO DE MENSAGENS COM IA ───────────────────────────────────────────
  const gerarMensagens = async () => {
    const alvo = [...displayInativos.slice(0, 3), ...displayRetornos.slice(0, 2)];
    if (alvo.length === 0) return;
    setGerandoMensagens(true);
    setActiveTab('mensagens');

    const lista = alvo.map(p => {
      const dias = diasDesde(p.ultima_sessao);
      const motivo = p.status_relacionamento === 'retorno_pendente' ? 'retorno pendente' : `inativo há ${dias || '?'} dias`;
      return `${p.nome} (${motivo}, ${p.total_sessoes || 0} sessões realizadas)`;
    }).join('\n');

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é assistente de uma clínica de saúde chamada "${clinica?.nome || 'nossa clínica'}".
Gere mensagens de WhatsApp curtas, calorosas e comerciais para reativar os seguintes pacientes:

${lista}

Para cada paciente, gere uma mensagem única de no máximo 3 linhas.
Seja pessoal, mencione o nome do paciente, seja gentil mas direto ao objetivo de reagendar.
Não use linguagem muito formal. Use emojis com moderação (1-2 por mensagem).

Responda em JSON com a estrutura exata:
{ "mensagens": [ { "paciente": "Nome", "motivo": "razão do contato", "mensagem": "texto da mensagem" } ] }`,
      response_json_schema: {
        type: 'object',
        properties: {
          mensagens: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                paciente: { type: 'string' },
                motivo: { type: 'string' },
                mensagem: { type: 'string' },
              },
            },
          },
        },
      },
    });

    setMensagens(result?.mensagens || []);
    setGerandoMensagens(false);
  };

  const displayMensagens = isReal
    ? (mensagens.length > 0 ? mensagens : [])
    : DEMO_MENSAGENS_SUGERIDAS;

  const tabs = [
    { key: 'overview', label: '🧠 Visão Geral' },
    { key: 'inativos', label: `👥 Inativos (${displayInativos.length})` },
    { key: 'retornos', label: `🔄 Retornos (${displayRetornos.length})` },
    { key: 'mensagens', label: '💬 Mensagens' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Growth Engine"
        subtitle={isReal
          ? (loading ? 'Analisando dados da clínica...' : `Dados reais · ${displayInsights.length} oportunidade${displayInsights.length !== 1 ? 's' : ''} identificada${displayInsights.length !== 1 ? 's' : ''}`)
          : 'Modo demonstração — dados fictícios convincentes'}
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl flex-shrink-0">
            {loading ? <Loader2 size={28} className="animate-spin" /> : <Brain size={28} />}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">AI Growth Engine {isReal ? 'Ativo' : '(Demo)'}</h2>
            <p className="text-cyan-100 mt-1 text-sm">
              {isReal
                ? `Análise real da ${clinica?.nome}. ${displayInsights.length} oportunidade${displayInsights.length !== 1 ? 's' : ''} identificada${displayInsights.length !== 1 ? 's' : ''}.`
                : `Analisando padrões da sua clínica continuamente. ${displayInsights.length} oportunidades identificadas hoje.`}
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              {[
                { value: displayInativos.length, label: 'Inativos' },
                { value: displayRetornos.length, label: 'Retornos' },
                { value: isReal ? (analise?.faltasRecentes?.length || 0) : 5, label: 'Faltas/mês' },
                { value: oportunidade, label: 'Oportunidade' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 rounded-lg px-3 py-2 text-center">
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-cyan-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          {isReal && (
            <Button onClick={gerarMensagens} disabled={gerandoMensagens || loading}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-2 flex-shrink-0" variant="outline" size="sm">
              {gerandoMensagens ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              Gerar Mensagens IA
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === t.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Insights & Oportunidades</h3>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
              <Loader2 size={18} className="animate-spin" /> Analisando dados da clínica...
            </div>
          ) : (
            displayInsights.map((insight, i) => <InsightCard key={i} insight={insight} />)
          )}
        </div>
      )}

      {/* Inativos */}
      {activeTab === 'inativos' && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Pacientes Inativos ({displayInativos.length})</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Pacientes que não retornam há mais de 30 dias ou com status inativo</p>
            </div>
            <div className="divide-y divide-border">
              {displayInativos.length === 0 && (
                <p className="px-5 py-8 text-sm text-muted-foreground text-center">Nenhum paciente inativo identificado. 🎉</p>
              )}
              {displayInativos.map(p => {
                const dias = diasDesde(p.ultima_sessao);
                return (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">
                      {p.nome[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{p.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.total_sessoes || 0} sessões · Última: {p.ultima_sessao || 'não registrada'}
                      </p>
                    </div>
                    {dias !== null && (
                      <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-md font-medium flex-shrink-0">
                        {dias} dias
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Retornos */}
      {activeTab === 'retornos' && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Retornos Pendentes ({displayRetornos.length})</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Pacientes no momento ideal para retorno</p>
            </div>
            <div className="divide-y divide-border">
              {displayRetornos.length === 0 && (
                <p className="px-5 py-8 text-sm text-muted-foreground text-center">Nenhum retorno pendente no momento.</p>
              )}
              {displayRetornos.map(p => (
                <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold text-sm flex-shrink-0">
                    {p.nome[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{p.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      Última sessão: {p.ultima_sessao || 'não registrada'}
                      {p.proximo_retorno ? ` · Retorno: ${p.proximo_retorno}` : ''}
                    </p>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1 rounded-md font-medium flex-shrink-0">
                    Retorno pendente
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mensagens */}
      {activeTab === 'mensagens' && (
        <div className="space-y-4">
          <div className="bg-accent/50 border border-accent rounded-xl p-4 flex items-start justify-between gap-4">
            <p className="text-sm font-medium text-accent-foreground flex items-center gap-2">
              <Lightbulb size={16} className="text-primary flex-shrink-0" />
              Mensagens geradas pela IA para reativar pacientes. Copie e envie pelo WhatsApp ou outro canal.
            </p>
            {isReal && (
              <Button onClick={gerarMensagens} disabled={gerandoMensagens} size="sm" className="gap-1.5 flex-shrink-0">
                {gerandoMensagens ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                {gerandoMensagens ? 'Gerando...' : 'Gerar com IA'}
              </Button>
            )}
          </div>

          {gerandoMensagens && (
            <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
              <Loader2 size={18} className="animate-spin" /> Gerando mensagens personalizadas...
            </div>
          )}

          {!gerandoMensagens && displayMensagens.length === 0 && isReal && (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <Brain size={32} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">Nenhuma mensagem gerada ainda</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Clique em "Gerar com IA" para criar mensagens personalizadas</p>
              <Button onClick={gerarMensagens} className="gap-2">
                <Zap size={14} /> Gerar Mensagens com IA
              </Button>
            </div>
          )}

          {!gerandoMensagens && displayMensagens.map((msg, i) => <MensagemCard key={i} msg={msg} />)}
        </div>
      )}
    </div>
  );
}