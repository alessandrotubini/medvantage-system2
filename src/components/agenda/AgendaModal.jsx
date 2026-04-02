import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useClinica } from '@/lib/clinicaContext';

export default function AgendaModal({ onClose, slot, atendimento, onSaved }) {
  const { clinica } = useClinica();
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);

  const [form, setForm] = useState({
    paciente_id: atendimento?.paciente_id || '',
    profissional_id: atendimento?.profissional_id || slot?.prof?.id || '',
    servico_id: atendimento?.servico_id || '',
    data: atendimento?.data || new Date().toISOString().split('T')[0],
    hora_inicio: atendimento?.hora_inicio || slot?.hour || '',
    status: atendimento?.status || 'agendado',
    observacoes: atendimento?.observacoes || '',
  });

  useEffect(() => {
    if (!clinica?.id) return;
    Promise.all([
      base44.entities.Paciente.filter({ clinica_id: clinica.id }),
      base44.entities.Profissional.filter({ clinica_id: clinica.id }),
      base44.entities.Servico.filter({ clinica_id: clinica.id }),
    ]).then(([p, pr, s]) => {
      setPacientes(p);
      setProfissionais(pr);
      setServicos(s);
    });
  }, [clinica?.id]);

  const handleSave = async () => {
    if (!form.paciente_id || !form.data || !form.hora_inicio) return;
    setLoading(true);
    const data = { ...form, clinica_id: clinica?.id };
    if (atendimento?.id) {
      await base44.entities.Atendimento.update(atendimento.id, data);
    } else {
      await base44.entities.Atendimento.create(data);
    }
    setLoading(false);
    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg mx-4 animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{atendimento ? 'Editar Atendimento' : 'Novo Agendamento'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data</Label>
              <Input type="date" value={form.data} onChange={e => setForm({...form, data: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Horário</Label>
              <Input type="time" value={form.hora_inicio} onChange={e => setForm({...form, hora_inicio: e.target.value})} className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Paciente</Label>
            <Select value={form.paciente_id} onValueChange={v => setForm({...form, paciente_id: v})}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar paciente" /></SelectTrigger>
              <SelectContent>{pacientes.map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Profissional</Label>
            <Select value={form.profissional_id} onValueChange={v => setForm({...form, profissional_id: v})}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar profissional" /></SelectTrigger>
              <SelectContent>{profissionais.map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Serviço / Procedimento</Label>
            <Select value={form.servico_id} onValueChange={v => setForm({...form, servico_id: v})}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar serviço" /></SelectTrigger>
              <SelectContent>{servicos.map(s => <SelectItem key={s.id} value={s.id}>{s.nome} · {s.duracao_minutos}min</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="falta">Falta / No-show</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Observações</Label>
            <textarea value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})}
              placeholder="Observações internas..."
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading || !form.paciente_id || !form.data || !form.hora_inicio}>
            {loading && <Loader2 size={14} className="animate-spin mr-1" />}
            Salvar Agendamento
          </Button>
        </div>
      </div>
    </div>
  );
}