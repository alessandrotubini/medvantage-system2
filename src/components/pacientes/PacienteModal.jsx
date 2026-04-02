import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useClinica } from '@/lib/clinicaContext';

export default function PacienteModal({ onClose, paciente, onSaved }) {
  const { clinica } = useClinica();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: paciente?.nome || '',
    telefone: paciente?.telefone || '',
    email: paciente?.email || '',
    data_nascimento: paciente?.data_nascimento || '',
    genero: paciente?.genero || '',
    observacoes: paciente?.observacoes || '',
    como_conheceu: paciente?.como_conheceu || '',
  });

  const handleSave = async () => {
    if (!form.nome.trim()) return;
    setLoading(true);
    const data = { ...form, clinica_id: clinica?.id };
    if (paciente?.id) {
      await base44.entities.Paciente.update(paciente.id, data);
    } else {
      await base44.entities.Paciente.create(data);
    }
    setLoading(false);
    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg mx-4 animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{paciente ? 'Editar Paciente' : 'Novo Paciente'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <Label>Nome completo *</Label>
            <Input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="mt-1" placeholder="Nome do paciente" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Telefone</Label>
              <Input value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} className="mt-1" placeholder="(11) 99999-0000" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="mt-1" placeholder="email@exemplo.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data de Nascimento</Label>
              <Input type="date" value={form.data_nascimento} onChange={e => setForm({...form, data_nascimento: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Gênero</Label>
              <Select value={form.genero} onValueChange={v => setForm({...form, genero: v})}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                  <SelectItem value="nao_informado">Não informado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Como conheceu a clínica?</Label>
            <Input value={form.como_conheceu} onChange={e => setForm({...form, como_conheceu: e.target.value})} className="mt-1" placeholder="Indicação, Instagram, Google..." />
          </div>
          <div>
            <Label>Observações</Label>
            <textarea value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Observações importantes sobre o paciente..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading || !form.nome.trim()}>
            {loading && <Loader2 size={14} className="animate-spin mr-1" />}
            Salvar Paciente
          </Button>
        </div>
      </div>
    </div>
  );
}