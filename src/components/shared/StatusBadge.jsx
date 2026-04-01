import React from 'react';
import { cn } from '@/lib/utils';

const statusConfig = {
  // Atendimento
  agendado: { label: 'Agendado', class: 'bg-blue-50 text-blue-700 border-blue-200' },
  confirmado: { label: 'Confirmado', class: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  em_atendimento: { label: 'Em Atendimento', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  concluido: { label: 'Concluído', class: 'bg-green-50 text-green-700 border-green-200' },
  cancelado: { label: 'Cancelado', class: 'bg-red-50 text-red-700 border-red-200' },
  falta: { label: 'Falta', class: 'bg-orange-50 text-orange-700 border-orange-200' },
  // Paciente
  novo: { label: 'Novo', class: 'bg-blue-50 text-blue-700 border-blue-200' },
  recorrente: { label: 'Recorrente', class: 'bg-green-50 text-green-700 border-green-200' },
  inativo: { label: 'Inativo', class: 'bg-gray-50 text-gray-600 border-gray-200' },
  retorno_pendente: { label: 'Retorno Pendente', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  alta: { label: 'Alta', class: 'bg-purple-50 text-purple-700 border-purple-200' },
  // Financeiro
  pago: { label: 'Pago', class: 'bg-green-50 text-green-700 border-green-200' },
  pendente: { label: 'Pendente', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  vencido: { label: 'Vencido', class: 'bg-red-50 text-red-700 border-red-200' },
  isento: { label: 'Isento', class: 'bg-gray-50 text-gray-600 border-gray-200' },
  // Clínica
  ativa: { label: 'Ativa', class: 'bg-green-50 text-green-700 border-green-200' },
  bloqueada: { label: 'Bloqueada', class: 'bg-red-50 text-red-700 border-red-200' },
  trial: { label: 'Trial', class: 'bg-blue-50 text-blue-700 border-blue-200' },
  inativa: { label: 'Inativa', class: 'bg-gray-50 text-gray-600 border-gray-200' },
  // Sessão
  ativo: { label: 'Ativo', class: 'bg-green-50 text-green-700 border-green-200' },
  concluido_pacote: { label: 'Concluído', class: 'bg-purple-50 text-purple-700 border-purple-200' },
  vencido_pacote: { label: 'Vencido', class: 'bg-red-50 text-red-700 border-red-200' },
};

export default function StatusBadge({ status, className }) {
  const config = statusConfig[status] || { label: status, class: 'bg-gray-50 text-gray-600 border-gray-200' };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', config.class, className)}>
      {config.label}
    </span>
  );
}