import React from 'react';
import { X, Phone, Calendar, Clock, Package, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import { DEMO_ATENDIMENTOS_HOJE } from '@/lib/demoData';

export default function PacienteDrawer({ paciente, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-lg bg-card border-l border-border h-full overflow-y-auto animate-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h2 className="font-semibold text-foreground">Ficha do Paciente</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1"><Edit size={14} />Editar</Button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {paciente.nome[0]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{paciente.nome}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone size={12} />{paciente.telefone}</p>
              <div className="mt-1"><StatusBadge status={paciente.status_relacionamento} /></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-foreground">{paciente.total_sessoes}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Sessões</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs font-bold text-foreground">{paciente.ultima_sessao || '—'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Última Sessão</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs font-bold text-foreground">{paciente.proximo_retorno || 'A definir'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Próx. Retorno</p>
            </div>
          </div>

          {/* Tags */}
          {paciente.tags?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {paciente.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Histórico de Atendimentos */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Histórico de Atendimentos</p>
            <div className="space-y-2">
              {DEMO_ATENDIMENTOS_HOJE.filter(a => a.paciente === paciente.nome).length > 0 ? (
                DEMO_ATENDIMENTOS_HOJE.filter(a => a.paciente === paciente.nome).map(at => (
                  <div key={at.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Clock size={14} className="text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{at.servico}</p>
                      <p className="text-xs text-muted-foreground">{at.profissional}</p>
                    </div>
                    <StatusBadge status={at.status} />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                  Nenhum atendimento encontrado
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border flex gap-3 flex-shrink-0">
          <Button className="flex-1">Agendar Atendimento</Button>
          <Button variant="outline" className="flex-1">Registrar Retorno</Button>
        </div>
      </div>
    </div>
  );
}