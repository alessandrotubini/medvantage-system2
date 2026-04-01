import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NovaClinicaModal({ onClose }) {
  const [form, setForm] = useState({
    nome: '',
    owner_email: '',
    plano: 'starter',
    status: 'trial',
    licenca_vencimento: '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md mx-4 animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Nova Clínica</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label>Nome da Clínica *</Label>
            <Input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="mt-1" placeholder="Nome da clínica" />
          </div>
          <div>
            <Label>Email do Admin (dono da clínica)</Label>
            <Input type="email" value={form.owner_email} onChange={e => setForm({...form, owner_email: e.target.value})} className="mt-1" placeholder="admin@clinica.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Plano</Label>
              <Select value={form.plano} onValueChange={v => setForm({...form, plano: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status Inicial</Label>
              <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="ativa">Ativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Vencimento da Licença</Label>
            <Input type="date" value={form.licenca_vencimento} onChange={e => setForm({...form, licenca_vencimento: e.target.value})} className="mt-1" />
          </div>
          <div className="bg-accent/50 rounded-lg p-3 text-xs text-accent-foreground">
            Após criação, o admin da clínica será convidado por email para configurar o ambiente.
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onClose}>Criar Clínica</Button>
        </div>
      </div>
    </div>
  );
}