import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { DEMO_ATENDIMENTOS_HOJE, DEMO_PROFISSIONAIS } from '@/lib/demoData';
import AgendaModal from '@/components/agenda/AgendaModal';

const HOURS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

const statusColors = {
  agendado: '#3B82F6',
  confirmado: '#06B6D4',
  em_atendimento: '#F59E0B',
  concluido: '#10B981',
  cancelado: '#EF4444',
  falta: '#F97316',
};

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('dia');
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const dateStr = selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const prevDay = () => setSelectedDate(d => { const n = new Date(d); n.setDate(d.getDate()-1); return n; });
  const nextDay = () => setSelectedDate(d => { const n = new Date(d); n.setDate(d.getDate()+1); return n; });

  const getAtendimentoForHour = (hour) => DEMO_ATENDIMENTOS_HOJE.filter(a => a.hora_inicio === hour);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Agenda"
        subtitle="Gerenciamento de horários e atendimentos"
        action={
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus size={16} /> Novo Agendamento
          </Button>
        }
      />

      {/* Controls */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevDay}><ChevronLeft size={16} /></Button>
          <span className="text-sm font-medium text-foreground min-w-64 text-center capitalize">{dateStr}</span>
          <Button variant="outline" size="icon" onClick={nextDay}><ChevronRight size={16} /></Button>
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden ml-auto">
          {['dia', 'semana'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 text-sm font-medium capitalize transition-colors ${view === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
              {v === 'dia' ? 'Diário' : 'Semanal'}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-4 border-b border-border">
          <div className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Horário</div>
          {DEMO_PROFISSIONAIS.slice(0, 3).map(p => (
            <div key={p.id} className="px-4 py-3 border-l border-border">
              <p className="text-xs font-semibold text-foreground truncate">{p.nome.split(' ')[1]} {p.nome.split(' ')[2] || ''}</p>
              <p className="text-[10px] text-muted-foreground">{p.especialidade}</p>
            </div>
          ))}
        </div>
        <div className="divide-y divide-border">
          {HOURS.map((hour) => {
            const ats = getAtendimentoForHour(hour);
            return (
              <div key={hour} className="grid grid-cols-4 min-h-[60px]">
                <div className="px-4 py-3 text-xs font-mono text-muted-foreground flex items-start pt-3">{hour}</div>
                {DEMO_PROFISSIONAIS.slice(0, 3).map((prof, idx) => {
                  const at = ats.find(a => a.profissional.includes(prof.nome.split(' ')[1]));
                  return (
                    <div key={prof.id} className="border-l border-border px-2 py-1.5 cursor-pointer hover:bg-muted/20"
                      onClick={() => { setSelectedSlot({ hour, prof }); setShowModal(true); }}>
                      {at && (
                        <div className="rounded-md p-2 text-white text-xs"
                          style={{ backgroundColor: statusColors[at.status] || '#3B82F6' }}>
                          <p className="font-semibold truncate">{at.paciente.split(' ')[0]}</p>
                          <p className="opacity-80 truncate">{at.servico}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && <AgendaModal onClose={() => { setShowModal(false); setSelectedSlot(null); }} slot={selectedSlot} />}
    </div>
  );
}