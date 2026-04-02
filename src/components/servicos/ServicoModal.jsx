import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useClinica } from '@/lib/clinicaContext';

export default function ServicoModal({ onClose, servico, onSaved }) {
  const { clinica } = useClinica();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: servico?.nome || '',
    descricao: servico?.descricao || '',
    duracao_minutos: servico?.duracao_minutos || 50,
    valor: servico?.valor || '',
    categoria: servico?.categoria || '',
    ativo: servico?.ativo !== false,
  });

  const handleSave = async () => {
    if (!form.nome.trim()) return;
    setLoading(true);
    const payload = { ...form, valor: Number(form.valor) || 0, clinica_id: clinica?.id };
    if (servico?.id) {
      await base44.entities.Servico.update(servico.id, payload);
    } else {
      await base44.entities.Servico.create(payload);
    }
    setLoading(false);
    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md mx-4 animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{servico ? 'Editar Serviço' : 'Novo Serviço'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label>Nome do Serviço *</Label>
            <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="mt-1" placeholder="Fisioterapia Individual, Consulta Psicológica..." />
          </div>
          <div>
            <Label>Descrição</Label>
            <Input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} className="mt-1" placeholder="Breve descrição do serviço" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Duração (minutos)</Label>
              <Select value={String(form.duracao_minutos)} onValueChange={v => setForm({ ...form, duracao_minutos: Number(v) })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[30, 45, 50, 60, 90, 120].map(d => (
                    <SelectItem key={d} value={String(d)}>{d} min</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valor (R$)</Label>
              <Input type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} className="mt-1" placeholder="0,00" min="0" />
            </div>
          </div>
          <div>
            <Label>Categoria</Label>
            <Input value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className="mt-1" placeholder="Fisioterapia, Psicologia, Nutrição..." />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="ativo" checked={form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })}
              className="w-4 h-4 rounded border-border accent-primary" />
            <Label htmlFor="ativo" className="cursor-pointer">Serviço ativo (disponível para agendamento)</Label>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading || !form.nome.trim()}>
            {loading && <Loader2 size={14} className="animate-spin mr-1" />}
            Salvar Serviço
          </Button>
        </div>
      </div>
    </div>
  );
}