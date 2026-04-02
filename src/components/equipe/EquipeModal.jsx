import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useClinica } from '@/lib/clinicaContext';

export default function EquipeModal({ onClose, membro, onSaved }) {
  const { clinica } = useClinica();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: membro?.nome || '',
    user_email: membro?.user_email || '',
    papel: membro?.papel || 'recepcao',
  });

  const handleSave = async () => {
    if (!form.user_email.trim()) return;
    setLoading(true);
    if (membro?.id) {
      await base44.entities.MembroEquipe.update(membro.id, { ...form, clinica_id: clinica?.id });
    } else {
      // Create member record
      await base44.entities.MembroEquipe.create({ ...form, clinica_id: clinica?.id, ativo: true });
      // Invite user to the platform
      const role = form.papel === 'admin_clinica' ? 'admin' : 'user';
      await base44.users.inviteUser(form.user_email, role);
    }
    setLoading(false);
    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md mx-4 animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{membro ? 'Editar Membro' : 'Convidar Usuário'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label>Nome</Label>
            <Input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="mt-1" placeholder="Nome completo" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.user_email} onChange={e => setForm({...form, user_email: e.target.value})} className="mt-1" placeholder="email@clinica.com" disabled={!!membro} />
          </div>
          <div>
            <Label>Papel / Perfil de Acesso</Label>
            <Select value={form.papel} onValueChange={v => setForm({...form, papel: v})}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin_clinica">Admin da Clínica</SelectItem>
                <SelectItem value="recepcao">Recepção / Secretária</SelectItem>
                <SelectItem value="profissional">Profissional</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-accent/50 rounded-lg p-3 text-xs text-accent-foreground">
            {membro ? 'As alterações serão salvas imediatamente.' : 'O usuário receberá um convite por email para acessar o sistema com o perfil selecionado.'}
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading || !form.user_email.trim()}>
            {loading && <Loader2 size={14} className="animate-spin mr-1" />}
            {membro ? 'Salvar Alterações' : 'Enviar Convite'}
          </Button>
        </div>
      </div>
    </div>
  );
}