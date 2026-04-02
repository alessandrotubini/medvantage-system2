import React, { useState } from 'react';
import { CheckCircle, Circle, ArrowRight, Building2, Palette, Users, Wrench, Clock, UserPlus, FileText, Brain, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClinica } from '@/lib/clinicaContext';

const STEPS = [
  { id: 0, label: 'Dados da Clínica', icon: Building2, desc: 'Nome, telefone, email e endereço' },
  { id: 1, label: 'Identidade Visual', icon: Palette, desc: 'Logo e cor da marca' },
  { id: 2, label: 'Profissionais', icon: Users, desc: 'Cadastre sua equipe de saúde' },
  { id: 3, label: 'Serviços', icon: Wrench, desc: 'Tipos de atendimento' },
  { id: 4, label: 'Horários', icon: Clock, desc: 'Funcionamento da clínica' },
  { id: 5, label: 'Equipe', icon: UserPlus, desc: 'Recepção e admin' },
  { id: 6, label: 'Primeiros Pacientes', icon: FileText, desc: 'Importe ou cadastre' },
  { id: 7, label: 'AI Growth Engine', icon: Brain, desc: 'Ative a inteligência' },
  { id: 8, label: 'Conclusão', icon: Rocket, desc: 'Sistema pronto!' },
];

export default function Onboarding() {
  const { clinica } = useClinica();
  const [step, setStep] = useState(0);
  const [clinicaData, setClinicaData] = useState({ nome: '', telefone: '', email: '', endereco: '', cor_principal: '#0EA5E9' });

  const progress = ((step) / (STEPS.length - 1)) * 100;

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Brain size={24} className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Bem-vindo ao ClínicaPro AI</h1>
          <p className="text-muted-foreground mt-1">Vamos configurar sua clínica em alguns passos simples</p>
        </div>

        {/* Progress bar */}
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
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <button onClick={() => i <= step && setStep(i)}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' : 'bg-muted text-muted-foreground'}`}>
                {i < step ? <CheckCircle size={16} /> : i + 1}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 min-w-4 rounded-full ${i < step ? 'bg-green-500' : 'bg-muted'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-lg animate-fade-in">
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
                  <Input value={clinicaData.nome} onChange={e => setClinicaData({...clinicaData, nome: e.target.value})} className="mt-1" placeholder="Clínica Vida & Saúde" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Telefone</Label><Input value={clinicaData.telefone} onChange={e => setClinicaData({...clinicaData, telefone: e.target.value})} className="mt-1" placeholder="(11) 99999-0000" /></div>
                  <div><Label>Email</Label><Input value={clinicaData.email} onChange={e => setClinicaData({...clinicaData, email: e.target.value})} className="mt-1" placeholder="contato@clinica.com" /></div>
                </div>
                <div><Label>Endereço</Label><Input value={clinicaData.endereco} onChange={e => setClinicaData({...clinicaData, endereco: e.target.value})} className="mt-1" placeholder="Rua, número, bairro" /></div>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Logo da Clínica</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:bg-muted/20 transition-colors">
                    <p className="text-sm text-muted-foreground">Clique para fazer upload do logo</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 2MB</p>
                  </div>
                </div>
                <div>
                  <Label>Cor Principal da Marca</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <input type="color" value={clinicaData.cor_principal} onChange={e => setClinicaData({...clinicaData, cor_principal: e.target.value})}
                      className="w-12 h-10 rounded cursor-pointer border border-border" />
                    <Input value={clinicaData.cor_principal} onChange={e => setClinicaData({...clinicaData, cor_principal: e.target.value})} className="flex-1" />
                  </div>
                </div>
              </div>
            )}
            {(step >= 2 && step <= 6) && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {React.createElement(STEPS[step].icon, { size: 28, className: 'text-primary' })}
                </div>
                <h3 className="font-semibold text-foreground">{STEPS[step].label}</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                  Este passo será configurado dentro do sistema. Você pode pular e voltar depois.
                </p>
                <Button variant="outline" className="mt-4">Configurar agora</Button>
              </div>
            )}
            {step === 7 && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <Brain size={28} className="text-cyan-500" />
                </div>
                <h3 className="font-semibold text-foreground">AI Growth Engine</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  A inteligência do sistema vai monitorar sua agenda, identificar pacientes inativos e sugerir ações para crescer sua clínica.
                </p>
                <div className="mt-4 flex flex-col gap-2 text-sm text-left bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                  {['Identifica pacientes inativos', 'Sugere retornos no momento certo', 'Detecta horários fracos na agenda', 'Gera mensagens de reativação'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-cyan-800"><CheckCircle size={14} className="text-cyan-600" />{f}</div>
                  ))}
                </div>
              </div>
            )}
            {step === 8 && (
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Rocket size={36} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Sua clínica está pronta! 🎉</h3>
                <p className="text-muted-foreground mt-2">O ClínicaPro AI está configurado e pronto para operar.</p>
                <Button className="mt-6 px-8" onClick={() => window.location.href = '/app/dashboard'}>Ir para o Dashboard</Button>
              </div>
            )}
          </div>

          {step < STEPS.length - 1 && (
            <div className="flex justify-between px-8 py-4 border-t border-border">
              <Button variant="outline" onClick={prev} disabled={step === 0}>Voltar</Button>
              <Button onClick={next} className="gap-2">
                {step === STEPS.length - 2 ? 'Concluir Setup' : 'Próximo'} <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}