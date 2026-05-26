import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import {
  Brain, Calendar, Users, TrendingUp, Shield, Zap, BarChart3,
  CheckCircle, ArrowRight, Star, Clock, DollarSign, Activity
} from 'lucide-react';

const features = [
  { icon: Calendar, title: 'Agenda Inteligente', desc: 'Visualize e gerencie todos os atendimentos do dia, semana e mês com uma agenda visual e profissional.' },
  { icon: Users, title: 'Gestão de Pacientes', desc: 'Cadastro completo com histórico, pacotes de sessões e controle de relacionamento por status.' },
  { icon: DollarSign, title: 'Financeiro Completo', desc: 'Controle de receitas, despesas, inadimplência e faturamento com gráficos em tempo real.' },
  { icon: BarChart3, title: 'Relatórios Avançados', desc: 'KPIs, ocupação da agenda, ranking de profissionais e evolução do faturamento por período.' },
  { icon: Shield, title: 'Multi-Profissional', desc: 'Suporte a múltiplos profissionais com agendas individuais, especialidades e controle de acesso.' },
  { icon: Zap, title: 'Pacotes & Sessões', desc: 'Gerencie planos de tratamento com controle de sessões realizadas, saldo e validade.' },
];

const aiFeatures = [
  'Identifica pacientes inativos automaticamente',
  'Detecta retornos pendentes com alta chance de conversão',
  'Analisa taxa de faltas e padrões de ausência',
  'Aponta horários com baixa ocupação',
  'Gera mensagens personalizadas via IA para reativação',
  'Calcula oportunidade financeira estimada por mês',
];

const testimonials = [
  { nome: 'Dra. Ana Carla', clinica: 'Clínica Bem Estar SP', texto: 'Reativei 8 pacientes inativos no primeiro mês só com as mensagens geradas pela IA. Incrível!', estrelas: 5 },
  { nome: 'Dr. Rodrigo Matos', clinica: 'Espaço Saúde & Vida', texto: 'A agenda ficou muito mais organizada e o financeiro me dá visibilidade que eu não tinha antes.', estrelas: 5 },
  { nome: 'Dra. Fernanda Cruz', clinica: 'Centro Clínico Integral', texto: 'Economizei horas por semana. O sistema faz sozinho o que eu precisava de 3 planilhas para controlar.', estrelas: 5 },
];

export default function LandingPage() {
  const { isAuthenticated, isLoadingAuth, isLoadingPublicSettings } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingAuth && !isLoadingPublicSettings && isAuthenticated) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, isLoadingPublicSettings, navigate]);

  const handleLogin = () => {
    base44.auth.redirectToLogin('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
              <Activity size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">ClínicaPro <span className="text-cyan-500">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#funcionalidades" className="hover:text-cyan-600 transition-colors">Funcionalidades</a>
            <a href="#ai" className="hover:text-cyan-600 transition-colors">AI Growth</a>
            <a href="#depoimentos" className="hover:text-cyan-600 transition-colors">Depoimentos</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/demo/dashboard" className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-600 border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-colors">
              Ver Demo
            </Link>
            <button onClick={handleLogin} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors">
              Entrar
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6">
              <Brain size={12} />
              Powered by Inteligência Artificial
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              O sistema de gestão que{' '}
              <span className="text-cyan-400">faz sua clínica crescer</span>{' '}
              sozinha
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
              Agenda, pacientes, financeiro, relatórios e um motor de crescimento com IA que identifica oportunidades e gera mensagens personalizadas para reativar pacientes inativos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/demo/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
              >
                <Zap size={20} />
                Ver Demo Agora
                <ArrowRight size={18} />
              </Link>
              <button onClick={handleLogin} className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-all">
                Acessar Minha Conta
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-400">Sem cartão de crédito · Demo gratuita · Setup em minutos</p>
          </div>

          {/* Mock dashboard preview */}
          <div className="mt-16 relative">
            <div className="bg-slate-800/80 rounded-2xl border border-white/10 p-4 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="flex-1 mx-4 h-5 bg-slate-700 rounded-md"></div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Atendimentos Hoje', value: '7', color: 'text-cyan-400' },
                  { label: 'Faturamento', value: 'R$ 18.750', color: 'text-emerald-400' },
                  { label: 'Pacientes Ativos', value: '142', color: 'text-purple-400' },
                  { label: 'Alertas IA', value: '3', color: 'text-orange-400' },
                ].map(k => (
                  <div key={k.label} className="bg-slate-700/60 rounded-lg p-3">
                    <p className="text-[10px] text-slate-400 mb-1">{k.label}</p>
                    <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 bg-slate-700/40 rounded-lg p-3 h-28 flex items-center justify-center">
                  <div className="flex items-end gap-2 h-16">
                    {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
                      <div key={i} className="w-5 bg-cyan-500/70 rounded-t" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-700/40 rounded-lg p-3 h-28 flex flex-col justify-between">
                  {['Maria F. ✓', 'João P. ○', 'Carla B. ⏳', 'Roberto M. ●'].map(n => (
                    <p key={n} className="text-[10px] text-slate-300">{n}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tudo que sua clínica precisa em um lugar</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Do agendamento ao financeiro, do histórico do paciente ao crescimento inteligente com IA.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-cyan-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Growth Engine */}
      <section id="ai" className="py-20 px-6 bg-gradient-to-br from-slate-900 to-cyan-950 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6">
                <Brain size={12} />
                AI Growth Engine
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Sua IA identificando dinheiro perdido na clínica
              </h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                O AI Growth Engine analisa continuamente os dados da sua clínica e aponta exatamente onde você está perdendo receita — e o que fazer para recuperar.
              </p>
              <div className="space-y-3">
                {aiFeatures.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-cyan-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800/60 rounded-2xl border border-white/10 p-6 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={18} className="text-cyan-400" />
                <span className="font-semibold text-sm">Insights do AI Growth Engine</span>
                <span className="ml-auto text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">3 alertas</span>
              </div>
              {[
                { tipo: '🔴 Alta', titulo: '12 pacientes inativos', desc: 'Oportunidade estimada: R$ 4.200', bg: 'bg-red-500/10 border-red-500/20' },
                { tipo: '🟡 Média', titulo: '5 retornos pendentes', desc: 'Prontos para reagendar esta semana', bg: 'bg-amber-500/10 border-amber-500/20' },
                { tipo: '🟡 Média', titulo: 'Terças 13h–15h ociosas', desc: 'Apenas 30% dos slots ocupados', bg: 'bg-amber-500/10 border-amber-500/20' },
              ].map(i => (
                <div key={i.titulo} className={`rounded-xl border p-4 ${i.bg}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-white">{i.titulo}</p>
                    <span className="text-[10px] font-bold text-slate-300 flex-shrink-0">{i.tipo}</span>
                  </div>
                  <p className="text-xs text-slate-400">{i.desc}</p>
                </div>
              ))}
              <div className="pt-2">
                <Link to="/demo/ai-growth" className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold rounded-xl transition-colors">
                  <Zap size={14} />
                  Ver AI Growth Engine ao vivo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Clínicas que já transformaram seus resultados</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.nome} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.estrelas }).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.texto}"</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.nome}</p>
                  <p className="text-xs text-gray-500">{t.clinica}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-gradient-to-br from-cyan-500 to-cyan-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para ver o sistema funcionando?</h2>
          <p className="text-cyan-100 mb-8 text-lg">Explore a demo completa sem precisar criar uma conta. Veja cada funcionalidade ao vivo.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/demo/dashboard"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-cyan-600 font-bold text-xl rounded-2xl hover:bg-cyan-50 transition-all shadow-2xl hover:scale-105"
            >
              <Zap size={22} />
              Explorar Demo Completa
              <ArrowRight size={20} />
            </Link>
            <a
              href="https://turbosaas.pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xl rounded-2xl transition-all shadow-xl hover:scale-105"
            >
              Quero o meu sistema
              <ArrowRight size={20} />
            </a>
          </div>
          <p className="mt-4 text-cyan-200 text-sm">Demo sem login · Contratação em turbosaas.pro</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-900 text-center text-slate-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500 flex items-center justify-center">
            <Activity size={12} className="text-white" />
          </div>
          <span className="font-semibold text-white">ClínicaPro AI</span>
        </div>
        <p>Sistema de gestão clínica com inteligência artificial</p>
      </footer>
    </div>
  );
}