import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClinica } from '@/lib/clinicaContext';

export default function DemoBanner() {
  const { clinica, loading } = useClinica();
  const navigate = useNavigate();

  // Só exibe se o usuário está no /app mas sem clínica configurada
  if (loading || clinica?.id) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2 text-amber-800">
        <Info size={16} className="flex-shrink-0 text-amber-500" />
        <p className="text-sm font-medium">
          Você está vendo <strong>dados de demonstração</strong>. Configure sua clínica para começar a usar o sistema com seus dados reais.
        </p>
      </div>
      <Button
        size="sm"
        className="bg-amber-500 hover:bg-amber-600 text-white gap-2 flex-shrink-0"
        onClick={() => navigate('/onboarding')}
      >
        <Zap size={14} />
        Ativar meu Trial
      </Button>
    </div>
  );
}