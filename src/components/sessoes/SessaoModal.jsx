import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useClinica } from '@/lib/clinicaContext';

export default function SessaoModal({ onClose, sessao, onSaved }) {
  const { clinica } = useClinica();
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [servicos, setServicos] = useState([]);

  const [form, setForm] = useState({
    nome_pacote: sessao?.nome_pacote || '',
    paciente_id: sessao?.paciente_id || '',
    servico_id: sessao?.servico_id || '',
    total_sessoes: sessao?.total_sessoes || 10,
    valor_total: sessao?.valor_total || '',
    data_inicio: sessao?.data_inicio || new Date().toISOString().split('T')[0],
    data_validade: sessao?.data_validade || '',
    observacoes: sessao?.observacoes || '',
  });

  useEffect(() => {
    if (!clinica?.id) return;
    Promise.all([
      base44.entities.Paciente.filter({ clinica_id: clinica.id }),
      base44.entities.Servico.filter({ clinica_id: clinica.id }),
    ]).then(([p, s]) => {
      setPacientes(p);
      setServicos(s);
    });
  }, [clinica?.id]);

  const handleSave = async () => {
    if (!form.nome_pacote.trim() || !form.paciente_id) return;
    setLoading(true);
    const sessoes_restantes = form.total_sessoes - (sessao?.sessoes_realizadas || 0);
    const data = { ...form, clinica_id: clinica?.id, sessoes_restantes };
    if (sessao?.id) {
      await base44.entities.SessaoPacote.update(sessao.id, data);
    } else {
      await base44.entities.SessaoPacote.create({ ...data, sessoes_realizadas: 0 });
    }
    setLoading(false);
    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg mx-4 animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{sessao ? 'Editar Pacote' : 'Novo Pacote / Plano'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label>Nome do Pacote</Label>
            <Input value={form.nome_pacote} onChange={e => setForm({...form, nome_pacote: e.target.value})} className="mt-1" placeholder="Ex: Pacote Fisioterapia 10x" />
          </div>
          <div>
            <Label>Paciente</Label>
            <Select value={form.paciente_id} onValueChange={v => setForm({...form, paciente_id: v})}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar paciente" /></SelectTrigger>
              <SelectContent>{pacientes.map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Serviço / Procedimento</Label>
            <Select value={form.servico_id} onValueChange={v => setForm({...form, servico_id: v})}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar serviço" /></SelectTrigger>
              <SelectContent>{servicos.map(s => <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Total de Sessões</Label>
              <Input type="number" value={form.total_sessoes} onChange={e => setForm({...form, total_sessoes: parseInt(e.target.value)})} className="mt-1" min={1} />
            </div>
            <div>
              <Label>Valor Total (R$)</Label>
              <Input type="number" value={form.valor_total} onChange={e => setForm({...form, valor_total: parseFloat(e.target.value)})} className="mt-1" placeholder="0,00" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data de Início</Label>
              <Input type="date" value={form.data_inicio} onChange={e => setForm({...form, data_inicio: e.target.value})} className="mt-1" />
            </div>
            <div>
              <Label>Validade</Label>
              <Input type="date" value={form.data_validade} onChange={e => setForm({...form, data_validade: e.target.value})} className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Observações</Label>
            <textarea value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Observações sobre o pacote..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading || !form.nome_pacote.trim() || !form.paciente_id}>
            {loading && <Loader2 size={14} className="animate-spin mr-1" />}
            Salvar Pacote
          </Button>
        </div>
      </div>
    </div>
  );
}