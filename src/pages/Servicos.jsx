import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, ToggleLeft, ToggleRight, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/shared/PageHeader';
import ServicoModal from '@/components/servicos/ServicoModal';
import { useClinica } from '@/lib/clinicaContext';
import { base44 } from '@/api/base44Client';
import { DEMO_SERVICOS } from '@/lib/demoData';

export default function Servicos() {
  const { clinica } = useClinica();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    if (clinica?.id) {
      base44.entities.Servico.filter({ clinica_id: clinica.id }).then(setServicos);
    }
  }, [clinica?.id]);

  const reload = () => {
    if (clinica?.id) base44.entities.Servico.filter({ clinica_id: clinica.id }).then(setServicos);
  };

  const isReal = !!clinica?.id;
  const source = isReal ? servicos : DEMO_SERVICOS;

  const filtered = source.filter(s =>
    s.nome?.toLowerCase().includes(search.toLowerCase()) ||
    s.categoria?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleAtivo = async (servico) => {
    if (!isReal) return;
    await base44.entities.Servico.update(servico.id, { ativo: !servico.ativo });
    reload();
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Serviços & Procedimentos"
        subtitle={`${source.filter(s => s.ativo !== false).length} serviço(s) ativo(s)`}
        action={
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus size={16} /> Novo Serviço
          </Button>
        }
      />

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou categoria..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
          <span className="col-span-4">Serviço</span>
          <span className="col-span-2">Categoria</span>
          <span className="col-span-2 text-center">Duração</span>
          <span className="col-span-2 text-center">Valor</span>
          <span className="col-span-2 text-center">Ações</span>
        </div>
        <div className="divide-y divide-border">
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              {isReal ? 'Nenhum serviço cadastrado. Adicione o primeiro!' : 'Nenhum resultado.'}
            </div>
          )}
          {filtered.map(s => (
            <div key={s.id} className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-muted/20 transition-colors">
              <div className="col-span-4">
                <p className="text-sm font-medium text-foreground">{s.nome}</p>
                {s.descricao && <p className="text-xs text-muted-foreground truncate">{s.descricao}</p>}
              </div>
              <div className="col-span-2 text-sm text-muted-foreground">{s.categoria || '—'}</div>
              <div className="col-span-2 text-center">
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock size={12} />
                  {s.duracao_minutos || 50} min
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-sm font-semibold text-foreground">
                  {s.valor ? `R$ ${Number(s.valor).toLocaleString('pt-BR')}` : '—'}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-center gap-2">
                <button onClick={() => { setSelected(s); setShowModal(true); }}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
                  <Edit size={14} />
                </button>
                {isReal && (
                  <button onClick={() => handleToggleAtivo(s)}
                    className={`p-1.5 rounded-lg transition-colors ${s.ativo !== false ? 'text-green-600 hover:bg-green-50' : 'text-muted-foreground hover:bg-muted'}`}>
                    {s.ativo !== false ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline-block ${s.ativo !== false ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                  {s.ativo !== false ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <ServicoModal
          onClose={() => { setShowModal(false); setSelected(null); }}
          servico={selected}
          onSaved={() => { reload(); setShowModal(false); setSelected(null); }}
        />
      )}
    </div>
  );
}