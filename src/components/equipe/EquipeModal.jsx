import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EquipeModal({ onClose, membro }) {
  const [form, setForm] = useState({
    nome: membro?.nome || '',
    user_email: membro?.user_email || '',
    papel: membro?.papel || 'recepcao',
  });

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
            <Input type="email" value={form.user_email} onChange={e => setForm({...form, user_email: e.target.value})} className="mt-1" placeholder="email@clinica.com" />
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
            O usuário receberá um convite por email para acessar o sistema com o perfil selecionado.
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onClose}>{membro ? 'Salvar Alterações' : 'Enviar Convite'}</Button>
        </div>
      </div>
    </div>
  );
}