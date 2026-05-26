import React, { useState } from 'react';
import { Save, Building2, Palette, Clock, FileText, CreditCard, Upload, ShieldCheck, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/shared/PageHeader';
import { useClinica } from '@/lib/clinicaContext';
import { DEMO_CLINICA } from '@/lib/demoData';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import ForcaTrocaSenha from '@/components/seguranca/ForcaTrocaSenha';

const TABS = [
  { key: 'clinica', label: 'Dados da Clínica', icon: Building2 },
  { key: 'identidade', label: 'Identidade Visual', icon: Palette },
  { key: 'horarios', label: 'Horários', icon: Clock },
  { key: 'mensagens', label: 'Mensagens Padrão', icon: FileText },
  { key: 'plano', label: 'Plano & Licença', icon: CreditCard },
  { key: 'seguranca', label: 'Segurança', icon: ShieldCheck },
];

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function Configuracoes() {
  const { clinica, user } = useClinica();
  const { toast } = useToast();
  const data = clinica || DEMO_CLINICA;
  const urlParams = new URLSearchParams(window.location.search);
  const [activeTab, setActiveTab] = useState(urlParams.get('tab') || 'clinica');

  // Segurança
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [loadingForcaTroca, setLoadingForcaTroca] = useState(false);

  const isOAuthUser = user?.login_provider && user.login_provider !== 'email';

  const handleAlterarSenha = async () => {
    if (!novaSenha || !confirmarSenha) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    if (novaSenha !== confirmarSenha) {
      toast({ title: 'As senhas não coincidem', variant: 'destructive' });
      return;
    }
    if (novaSenha.length < 8) {
      toast({ title: 'A senha deve ter no mínimo 8 caracteres', variant: 'destructive' });
      return;
    }
    setLoadingSenha(true);
    try {
      await base44.auth.updateMe({ password: novaSenha });
      toast({ title: 'Senha alterada com sucesso!' });
      setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha('');
    } catch (e) {
      toast({ title: 'Erro ao alterar senha', description: e.message, variant: 'destructive' });
    } finally {
      setLoadingSenha(false);
    }
  };

  const handleForcaTroca = async (targetEmail) => {
    setLoadingForcaTroca(true);
    try {
      // Salva flag no registro do usuário alvo para forçar troca no próximo logon
      const users = await base44.entities.User.filter({ email: targetEmail });
      if (users.length > 0) {
        await base44.entities.User.update(users[0].id, { must_change_password: true });
        toast({ title: 'Usuário será solicitado a trocar a senha no próximo logon.' });
      }
    } catch (e) {
      toast({ title: 'Erro ao configurar troca obrigatória', description: e.message, variant: 'destructive' });
    } finally {
      setLoadingForcaTroca(false);
    }
  };
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

          {activeTab === 'seguranca' && (
            <div className="space-y-6 max-w-lg">
              <h3 className="font-semibold text-foreground">Segurança da Conta</h3>

              {isOAuthUser ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                  <p className="font-medium mb-1">Autenticação via {user.login_provider === 'google' ? 'Google' : 'Microsoft'}</p>
                  <p className="text-blue-600">Sua conta usa autenticação externa. A senha é gerenciada diretamente pela plataforma {user.login_provider === 'google' ? 'Google' : 'Microsoft'}.</p>
                </div>
              ) : (
                <>
                  {/* Alterar senha */}
                  <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <KeyRound size={16} className="text-primary" />
                      <h4 className="font-medium text-foreground">Alterar Minha Senha</h4>
                    </div>
                    <div>
                      <Label>Nova Senha</Label>
                      <div className="relative mt-1">
                        <Input
                          type={showSenha ? 'text' : 'password'}
                          placeholder="Mínimo 8 caracteres"
                          value={novaSenha}
                          onChange={e => setNovaSenha(e.target.value)}
                          className="pr-10"
                        />
                        <button type="button" onClick={() => setShowSenha(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label>Confirmar Nova Senha</Label>
                      <Input
                        type={showSenha ? 'text' : 'password'}
                        placeholder="Repita a nova senha"
                        value={confirmarSenha}
                        onChange={e => setConfirmarSenha(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleAlterarSenha} disabled={loadingSenha} className="w-full gap-2">
                      <KeyRound size={15} />
                      {loadingSenha ? 'Salvando...' : 'Alterar Senha'}
                    </Button>
                  </div>

                  {/* Forçar troca de senha — apenas para admins */}
                  {user?.role === 'admin' && (
                    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-amber-500" />
                        <h4 className="font-medium text-foreground">Forçar Troca de Senha de Usuário</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Insira o e-mail do usuário para exigir que ele redefina a senha no próximo logon. Funciona apenas para usuários com autenticação por e-mail (não Google/Microsoft).
                      </p>
                      <ForcaTrocaSenha onConfirm={handleForcaTroca} loading={loadingForcaTroca} />
                    </div>
                  )}
                </>
              )}
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