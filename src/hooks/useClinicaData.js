import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Hook centralizado para carregar dados reais da clínica logada.
 * Retorna dados reais quando clinica_id estiver disponível.
 * Inclui mapas de lookup para resolução de nomes relacionados.
 */
export function useClinicaData(clinicaId) {
  const [data, setData] = useState({
    pacientes: [],
    atendimentos: [],
    atendimentosHoje: [],
    sessoesPacotes: [],
    lancamentos: [],
    profissionais: [],
    servicos: [],
    equipe: [],
    // lookup maps
    pacientesMap: {},
    profissionaisMap: {},
    servicosMap: {},
    loading: true,
  });

  const hoje = new Date().toISOString().split('T')[0];

  const load = async () => {
    if (!clinicaId) {
      setData(d => ({ ...d, loading: false }));
      return;
    }
    setData(d => ({ ...d, loading: true }));

    const [pacientes, atendimentos, sessoesPacotes, lancamentos, profissionais, servicos, equipe] = await Promise.all([
      base44.entities.Paciente.filter({ clinica_id: clinicaId }),
      base44.entities.Atendimento.filter({ clinica_id: clinicaId }, '-data', 200),
      base44.entities.SessaoPacote.filter({ clinica_id: clinicaId }),
      base44.entities.Lancamento.filter({ clinica_id: clinicaId }, '-data', 100),
      base44.entities.Profissional.filter({ clinica_id: clinicaId }),
      base44.entities.Servico.filter({ clinica_id: clinicaId }),
      base44.entities.MembroEquipe.filter({ clinica_id: clinicaId }),
    ]);

    const atendimentosHoje = atendimentos.filter(a => a.data === hoje);

    // Build lookup maps id -> nome
    const pacientesMap = Object.fromEntries(pacientes.map(p => [p.id, p.nome]));
    const profissionaisMap = Object.fromEntries(profissionais.map(p => [p.id, p.nome]));
    const servicosMap = Object.fromEntries(servicos.map(s => [s.id, s.nome]));

    setData({
      pacientes, atendimentos, atendimentosHoje, sessoesPacotes,
      lancamentos, profissionais, servicos, equipe,
      pacientesMap, profissionaisMap, servicosMap,
      loading: false,
    });
  };

  useEffect(() => {
    load();
  }, [clinicaId]);

  return { ...data, reload: load };
}

/** Resolve um ID para um nome usando um mapa de lookup. Retorna fallback se não encontrado. */
export function resolveName(map, id, fallback = '—') {
  if (!id) return fallback;
  return map[id] || id;
}

/** Calcula KPIs reais a partir dos dados carregados */
export function calcularKPIs(data, hoje) {
  const { pacientes, atendimentos, atendimentosHoje, sessoesPacotes, lancamentos } = data;
  const mesAtual = hoje.substring(0, 7);

  const pacientesInativos = pacientes.filter(p => p.status_relacionamento === 'inativo').length;
  const retornosPendentes = pacientes.filter(p => p.status_relacionamento === 'retorno_pendente').length;
  const sessoesAtivas = sessoesPacotes.filter(s => s.status === 'ativo').length;

  const atendimentosMes = atendimentos.filter(a => a.data?.startsWith(mesAtual));
  const faltasMes = atendimentosMes.filter(a => a.status === 'falta' || a.status === 'cancelado').length;

  const lancamentosMes = lancamentos.filter(l => l.data?.startsWith(mesAtual));
  const faturamentoMes = lancamentosMes.filter(l => l.tipo === 'receita' && l.status === 'pago').reduce((a, b) => a + (b.valor || 0), 0);
  const contasReceber = lancamentos.filter(l => l.status === 'pendente').reduce((a, b) => a + (b.valor || 0), 0);

  return {
    atendimentos_hoje: atendimentosHoje.length,
    pacientes_inativos: pacientesInativos,
    retornos_pendentes: retornosPendentes,
    sessoes_em_andamento: sessoesAtivas,
    faltas_mes: faltasMes,
    contas_receber: contasReceber,
    faturamento_mes: faturamentoMes,
    alertas_ai: pacientesInativos + retornosPendentes,
  };
}