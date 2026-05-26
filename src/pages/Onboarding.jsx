import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Building2, Palette, Rocket, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { useClinica } from '@/lib/clinicaContext';

const STEPS = [
  { id: 0, label: 'Dados da Clínica', icon: Building2, desc: 'Nome, telefone, email e endereço' },
  { id: 1, label: 'Identidade Visual', icon: Palette, desc: 'Logo e cor da marca' },
  { id: 2, label: 'Conclusão', icon: Rocket, desc: 'Sistema pronto!' },
];

export default function Onboarding() {
  const { user, loadClinica } = useClinica();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [clinicaData, setClinicaData] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    cor_principal: '#0EA5E9',
  });

  const progress = (step / (STEPS.length - 1)) * 100;
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleConcluir = async () => {
    if (!clinicaData.nome) return;
    setSaving(true);
    try {
      await base44.entities.Clinica.create({
        ...clinicaData,
        owner_email: user?.email,
        status: 'trial',
        plano: 'starter',
        onboarding_completo: true,
        onboarding_step: 2,
      });
      // Recarrega o contexto da clínica e redireciona
      await loadClinica?.();
      window.location.href = '/app/dashboard';
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Brain size={24} className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Configure sua Clínica</h1>
          <p className="text-muted-foreground mt-1">Em poucos passos, seu sistema estará pronto para usar</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Passo {step + 1} de {STEPS.length}</span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' : 'bg-muted text-muted-foreground'}`}>
                {i < step ? <CheckCircle size={16} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full ${i < step ? 'bg-green-500' : 'bg-muted'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-lg">
          <div className="px-8 py-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {React.createElement(STEPS[step].icon, { size: 20, className: 'text-primary' })}
              </div>
              <div>
                <h2 className="font-bold text-foreground">{STEPS[step].label}</h2>
                <p className="text-sm text-muted-foreground">{STEPS[step].desc}</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <Label>Nome da Clínica *</Label>
                  <Input value={clinicaData.nome} onChange={e => setClinicaData({ ...clinicaData, nome: e.target.value })} className="mt-1" placeholder="Ex: Clínica Vida & Saúde" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Telefone</Label>
                    <Input value={clinicaData.telefone} onChange={e => setClinicaData({ ...clinicaData, telefone: e.target.value })} className="mt-1" placeholder="(11) 99999-0000" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={clinicaData.email} onChange={e => setClinicaData({ ...clinicaData, email: e.target.value })} className="mt-1" placeholder="contato@clinica.com" />
                  </div>
                </div>
                <div>
                  <Label>Endereço</Label>
                  <Input value={clinicaData.endereco} onChange={e => setClinicaData({ ...clinicaData, endereco: e.target.value })} className="mt-1" placeholder="Rua, número, bairro" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Cor Principal da Marca</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <input type="color" value={clinicaData.cor_principal} onChange={e => setClinicaData({ ...clinicaData, cor_principal: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer border border-border" />
                    <Input value={clinicaData.cor_principal} onChange={e => setClinicaData({ ...clinicaData, cor_principal: e.target.value })} className="flex-1" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Esta cor será usada em toda a identidade visual do seu sistema.</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground">
                  ✅ Logo, profissionais, serviços e horários podem ser configurados em <strong>Configurações</strong> após o setup inicial.
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Rocket size={36} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Tudo pronto! 🎉</h3>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                  Clique em <strong>Iniciar Trial</strong> para criar sua clínica e começar a usar o sistema com seus dados reais.
                </p>
                <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4 text-left space-y-1 text-sm text-foreground">
                  <p>🏥 <strong>{clinicaData.nome || 'Sua Clínica'}</strong></p>
                  {clinicaData.email && <p>📧 {clinicaData.email}</p>}
                  {clinicaData.telefone && <p>📞 {clinicaData.telefone}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between px-8 py-4 border-t border-border">
            <Button variant="outline" onClick={prev} disabled={step === 0}>Voltar</Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next} disabled={step === 0 && !clinicaData.nome} className="gap-2">
                Próximo <ArrowRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleConcluir} disabled={saving || !clinicaData.nome} className="gap-2 bg-green-600 hover:bg-green-700">
                {saving ? 'Criando...' : 'Iniciar Trial'} <Rocket size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}