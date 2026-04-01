// Demo data for presentation and sales
export const DEMO_CLINICA = {
  id: 'demo-001',
  nome: 'Clínica Vida & Saúde',
  slug: 'vida-saude',
  cor_principal: '#0EA5E9',
  telefone: '(11) 99999-0001',
  email: 'contato@vidasaude.com.br',
  endereco: 'Rua das Palmeiras, 245 - Jardim Europa',
  cidade: 'São Paulo',
  estado: 'SP',
  status: 'ativa',
  plano: 'profissional',
  onboarding_completo: true,
};

export const DEMO_PROFISSIONAIS = [
  { id: 'prof-001', nome: 'Dra. Ana Carolina Melo', especialidade: 'Fisioterapeuta', cor_agenda: '#0EA5E9' },
  { id: 'prof-002', nome: 'Dr. Ricardo Souza', especialidade: 'Psicólogo', cor_agenda: '#8B5CF6' },
  { id: 'prof-003', nome: 'Dra. Fernanda Lima', especialidade: 'Nutricionista', cor_agenda: '#10B981' },
  { id: 'prof-004', nome: 'Dr. Marcos Oliveira', especialidade: 'Fisioterapeuta', cor_agenda: '#F59E0B' },
];

export const DEMO_SERVICOS = [
  { id: 'serv-001', nome: 'Fisioterapia Individual', duracao_minutos: 50, valor: 150 },
  { id: 'serv-002', nome: 'Consulta Psicológica', duracao_minutos: 50, valor: 200 },
  { id: 'serv-003', nome: 'Consulta Nutricional', duracao_minutos: 60, valor: 180 },
  { id: 'serv-004', nome: 'Pilates Clínico', duracao_minutos: 60, valor: 130 },
  { id: 'serv-005', nome: 'Avaliação Fisioterapêutica', duracao_minutos: 90, valor: 220 },
];

export const DEMO_PACIENTES = [
  { id: 'pac-001', nome: 'Maria Fernanda Costa', telefone: '(11) 98765-0001', status_relacionamento: 'recorrente', ultima_sessao: '2026-03-28', total_sessoes: 24 },
  { id: 'pac-002', nome: 'João Pedro Almeida', telefone: '(11) 98765-0002', status_relacionamento: 'inativo', ultima_sessao: '2026-01-15', total_sessoes: 8 },
  { id: 'pac-003', nome: 'Carla Beatriz Santos', telefone: '(11) 98765-0003', status_relacionamento: 'novo', ultima_sessao: '2026-03-30', total_sessoes: 3 },
  { id: 'pac-004', nome: 'Roberto Martins', telefone: '(11) 98765-0004', status_relacionamento: 'retorno_pendente', ultima_sessao: '2026-02-20', total_sessoes: 12 },
  { id: 'pac-005', nome: 'Lucia Pereira', telefone: '(11) 98765-0005', status_relacionamento: 'recorrente', ultima_sessao: '2026-03-29', total_sessoes: 18 },
  { id: 'pac-006', nome: 'André Silva', telefone: '(11) 98765-0006', status_relacionamento: 'inativo', ultima_sessao: '2025-12-10', total_sessoes: 5 },
  { id: 'pac-007', nome: 'Patrícia Gomes', telefone: '(11) 98765-0007', status_relacionamento: 'recorrente', ultima_sessao: '2026-03-31', total_sessoes: 31 },
  { id: 'pac-008', nome: 'Felipe Rodrigues', telefone: '(11) 98765-0008', status_relacionamento: 'retorno_pendente', ultima_sessao: '2026-02-05', total_sessoes: 7 },
];

export const DEMO_ATENDIMENTOS_HOJE = [
  { id: 'at-001', hora_inicio: '08:00', paciente: 'Maria Fernanda Costa', profissional: 'Dra. Ana Carolina Melo', servico: 'Fisioterapia Individual', status: 'concluido' },
  { id: 'at-002', hora_inicio: '09:00', paciente: 'João Pedro Almeida', profissional: 'Dr. Ricardo Souza', servico: 'Consulta Psicológica', status: 'confirmado' },
  { id: 'at-003', hora_inicio: '10:00', paciente: 'Carla Beatriz Santos', profissional: 'Dra. Fernanda Lima', servico: 'Consulta Nutricional', status: 'agendado' },
  { id: 'at-004', hora_inicio: '11:00', paciente: 'Roberto Martins', profissional: 'Dr. Marcos Oliveira', servico: 'Pilates Clínico', status: 'em_atendimento' },
  { id: 'at-005', hora_inicio: '14:00', paciente: 'Lucia Pereira', profissional: 'Dra. Ana Carolina Melo', servico: 'Fisioterapia Individual', status: 'agendado' },
  { id: 'at-006', hora_inicio: '15:00', paciente: 'André Silva', profissional: 'Dr. Ricardo Souza', servico: 'Consulta Psicológica', status: 'agendado' },
  { id: 'at-007', hora_inicio: '16:00', paciente: 'Patrícia Gomes', profissional: 'Dra. Fernanda Lima', servico: 'Consulta Nutricional', status: 'agendado' },
];

export const DEMO_KPI = {
  atendimentos_hoje: 7,
  pacientes_inativos: 12,
  retornos_pendentes: 5,
  sessoes_em_andamento: 9,
  faltas_mes: 4,
  contas_receber: 3480,
  faturamento_mes: 18750,
  alertas_ai: 3,
};

export const DEMO_AI_INSIGHTS = [
  {
    tipo: 'inativo',
    titulo: '12 pacientes não retornam há mais de 30 dias',
    descricao: 'Esses pacientes têm histórico de atendimentos mas pararam de agendar. Excelente oportunidade de recuperação.',
    urgencia: 'alta',
    pacientes: ['João Pedro Almeida', 'André Silva', 'Felipe Rodrigues'],
  },
  {
    tipo: 'horario_fraco',
    titulo: 'Terças e quintas 13h–15h têm baixa ocupação',
    descricao: 'Nesses horários, apenas 30% dos slots estão ocupados na última semana.',
    urgencia: 'media',
    sugestao: 'Considere oferecer horários especiais ou acionar pacientes com flexibilidade de agenda.',
  },
  {
    tipo: 'retorno',
    titulo: '5 pacientes estão no ponto ideal de retorno',
    descricao: 'Com base no intervalo médio de cada paciente, é hora de acionar esses contatos.',
    urgencia: 'alta',
    pacientes: ['Roberto Martins', 'Felipe Rodrigues'],
  },
  {
    tipo: 'falta',
    titulo: 'Padrão de faltas às segundas-feiras',
    descricao: 'Nas últimas 3 semanas, o índice de faltas nas segundas é 2x maior que nos outros dias.',
    urgencia: 'media',
    sugestao: 'Enviar lembretes adicionais para agendamentos de segunda.',
  },
];

export const DEMO_MENSAGENS_SUGERIDAS = [
  {
    paciente: 'João Pedro Almeida',
    mensagem: 'Olá, João! 😊 Aqui é da Clínica Vida & Saúde. Faz um tempinho que não nos vemos e queríamos saber como você está. Temos horários disponíveis esta semana. Que tal marcarmos sua consulta de acompanhamento? 📅',
  },
  {
    paciente: 'Roberto Martins',
    mensagem: 'Oi, Roberto! Tudo bem? 😊 Você está no ponto ideal para retorno ao tratamento. Nossa equipe recomenda dar continuidade para melhores resultados. Quer agendar? Estamos com horários especiais essa semana!',
  },
];