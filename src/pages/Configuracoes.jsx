import React, { useState } from 'react';
import { Save, Building2, Palette, Clock, FileText, CreditCard, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/shared/PageHeader';
import { useClinica } from '@/lib/clinicaContext';
import { DEMO_CLINICA } from '@/lib/demoData';

const TABS = [
  { key: 'clinica', label: 'Dados da Clínica', icon: Building2 },
  { key: 'identidade', label: 'Identidade Visual', icon: Palette },
  { key: 'horarios', label: 'Horários', icon: Clock },
  { key: 'mensagens', label: 'Mensagens Padrão', icon: FileText },
  { key: 'plano', label: 'Plano & Licença', icon: CreditCard },
];

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function Configuracoes() {
  const { clinica } = useClinica();
  const data = clinica || DEMO_CLINICA;
  const [activeTab, setActiveTab] = useState('clinica');
  const [form, setForm] = useState({
    nome: data.nome || '',
    telefone: data.telefone || '',
    email: data.email || '',
    endereco: data.endereco || '',
    cidade: data.cidade || '',
    estado: data.estado || '',
    cor_principal: data.cor_principal || '#0EA5E9',
    horario_inicio: data.horario_inicio || '08:00',
    horario_fim: data.horario_fim || '18:00',
    mensagem_confirmacao: data.mensagem_confirmacao || 'Olá {nome}! Seu agendamento foi confirmado para {data} às {hora}. Qualquer dúvida, entre em contato conosco.',
    mensagem_lembrete: data.mensagem_lembrete || 'Olá {nome}! Lembramos que você tem uma consulta amanhã, {data} às {hora}. Até logo! 😊',
    dias_funcionamento: data.dias_funcionamento || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
  });

  const toggleDia = (dia) => {
    setForm(f => ({
      ...f,
      dias_funcionamento: f.dias_funcionamento.includes(dia)
        ? f.dias_funcionamento.filter(d => d !== dia)
        : [...f.dias_funcionamento, dia]
    }));
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Configurações"
        subtitle="Personalize a clínica e o sistema"
        action={<Button className="gap-2"><Save size={16} />Salvar Alterações</Button>}
      />

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-52 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-card rounded-xl border border-border p-6">
          {activeTab === 'clinica' && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-foreground">Dados da Clínica</h3>
              <div>
                <Label>Nome da Clínica</Label>
                <Input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Telefone</Label>
                  <Input value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Endereço</Label>
                <Input value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cidade</Label>
                  <Input value={form.cidade} onChange={e => setForm({...form, cidade: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Input value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} className="mt-1" maxLength={2} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'identidade' && (
            <div className="space-y-6 max-w-lg">
              <h3 className="font-semibold text-foreground">Identidade Visual</h3>
              <div>
                <Label>Logo da Clínica</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/20 cursor-pointer transition-colors">
                  <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Arraste uma imagem ou clique para selecionar</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 2MB</p>
                </div>
              </div>
              <div>
                <Label>Cor Principal da Marca</Label>
                <div className="mt-2 flex items-center gap-3">
                  <input type="color" value={form.cor_principal} onChange={e => setForm({...form, cor_principal: e.target.value})}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-border" />
                  <Input value={form.cor_principal} onChange={e => setForm({...form, cor_principal: e.target.value})} className="flex-1" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Esta cor será usada em toda a interface do sistema da clínica.</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm font-medium text-foreground mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: form.cor_principal }}>
                    {form.nome?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{form.nome || 'Sua Clínica'}</p>
                    <div className="h-1.5 rounded-full w-20 mt-1" style={{ backgroundColor: form.cor_principal }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'horarios' && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-foreground">Horários de Funcionamento</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Horário de Abertura</Label>
                  <Input type="time" value={form.horario_inicio} onChange={e => setForm({...form, horario_inicio: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <Label>Horário de Encerramento</Label>
                  <Input type="time" value={form.horario_fim} onChange={e => setForm({...form, horario_fim: e.target.value})} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Dias de Funcionamento</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {DIAS.map(dia => (
                    <button key={dia} onClick={() => toggleDia(dia)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${form.dias_funcionamento.includes(dia) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                      {dia}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mensagens' && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-foreground">Mensagens Padrão</h3>
              <p className="text-xs text-muted-foreground">Use as variáveis: {'{'}'nome{'}'}, {'{'}'data{'}'}, {'{'}'hora{'}'}</p>
              <div>
                <Label>Mensagem de Confirmação</Label>
                <textarea value={form.mensagem_confirmacao} onChange={e => setForm({...form, mensagem_confirmacao: e.target.value})}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <Label>Mensagem de Lembrete</Label>
                <textarea value={form.mensagem_lembrete} onChange={e => setForm({...form, mensagem_lembrete: e.target.value})}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          )}

          {activeTab === 'plano' && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-foreground">Plano & Licença</h3>
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">Profissional</span>
                    <p className="text-lg font-bold text-foreground mt-2">R$ 197 / mês</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Licença ativa até 30/04/2026</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Ativo</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-cyan-200 grid grid-cols-2 gap-2 text-sm">
                  {['Agenda ilimitada', 'AI Growth Engine', 'Relatórios avançados', 'Suporte prioritário', 'Até 5 profissionais', 'White-label'].map(r => (
                    <div key={r} className="flex items-center gap-1 text-muted-foreground">
                      <span className="text-green-500">✓</span> {r}
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" className="w-full">Gerenciar Assinatura</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}