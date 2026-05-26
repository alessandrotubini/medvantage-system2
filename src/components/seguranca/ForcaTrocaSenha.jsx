import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

export default function ForcaTrocaSenha({ onConfirm, loading }) {
  const [email, setEmail] = useState('');
  const [confirmou, setConfirmou] = useState(false);

  const handleClick = () => {
    if (!email) return;
    if (!confirmou) { setConfirmou(true); return; }
    onConfirm(email);
    setEmail('');
    setConfirmou(false);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>E-mail do Usuário</Label>
        <Input
          type="email"
          placeholder="usuario@email.com"
          value={email}
          onChange={e => { setEmail(e.target.value); setConfirmou(false); }}
          className="mt-1"
        />
      </div>
      {confirmou && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
          <span>O usuário <strong>{email}</strong> será obrigado a criar uma nova senha no próximo acesso. Confirme clicando novamente.</span>
        </div>
      )}
      <Button
        variant="outline"
        className="w-full gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
        onClick={handleClick}
        disabled={!email || loading}
      >
        <AlertTriangle size={14} />
        {confirmou ? 'Confirmar Ação' : 'Solicitar Troca de Senha'}
      </Button>
    </div>
  );
}