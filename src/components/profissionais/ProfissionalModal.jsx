import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { useClinica } from '@/lib/clinicaContext';

const CORES = ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];

export default function ProfissionalModal({ onClose, profissional, onSaved }) {
  const { clinica } = useClinica();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: profissional?.nome || '',
    especialidade: profissional?.especialidade || '',
    registro_profissional: profissional?.registro_profissional || '',
    telefone: profissional?.telefone || '',
    email: profissional?.email || '',
    cor_agenda: profissional?.cor_agenda || '#0EA5E9',
    horario_inicio: profissional?.horario_inicio || '08:00',
    horario_fim: profissional?.horario_fim || '18:00',
    observacoes: profissional?.observacoes || '',
    ativo: profissional?.ativo !== false,
  });

  const handleSave = async () => {
    if (!form.nome.trim()) return;
    setLoading(true);
    const payload = { ...form, clinica_id: clinica?.id };
    if (profissional?.id) {
      await base44.entities.Profissional.update(profissional.id, payload);
    } else {
      await base44.entities.Profissional.create(payload);
    }
    setLoading(false);
    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg mx-4 animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{profissional ? 'Editar Profissional' : 'Novo Profissional'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <Label>Nome completo *</Label>
            <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="mt-1" placeholder="Dr. Nome Sobrenome" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Especialidade</Label>
              <Input value={form.especialidade} onChange={e => setForm({ ...form, especialidade: e.target.value })} className="mt-1" placeholder="Fisioterapeuta, Psicólogo..." />
            </div>
            <div>
              <Label>Registro (CRM/CRP/CREFITO)</Label>
              <Input value={form.registro_profissional} onChange={e => setForm({ ...form, registro_profissional: e.target.value })} className="mt-1" placeholder="CRP-SP 123456" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Telefone</Label>
              <Input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} className="mt-1" placeholder="(11) 99999-0000" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1" placeholder="email@clinica.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Horário de Início</Label>
              <Input type="time" value={form.horario_inicio} onChange={e => setForm({ ...form, horario_inicio: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Horário de Fim</Label>
              <Input type="time" value={form.horario_fim} onChange={e => setForm({ ...form, horario_fim: e.target.value })} className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Cor na Agenda</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {CORES.map(cor => (
                <button key={cor} onClick={() => setForm({ ...form, cor_agenda: cor })}
                  className={`w-8 h-8 rounded-full transition-all ${form.cor_agenda === cor ? 'ring-2 ring-offset-2 ring-foreground scale-110' : ''}`}
                  style={{ backgroundColor: cor }} />
              ))}
            </div>
          </div>
          <div>
            <Label>Observações</Label>
            <textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Informações adicionais..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading || !form.nome.trim()}>
            {loading && <Loader2 size={14} className="animate-spin mr-1" />}
            Salvar Profissional
          </Button>
        </div>
      </div>
    </div>
  );
}