import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Power, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/shared/PageHeader';
import ProfissionalModal from '@/components/profissionais/ProfissionalModal';
import { useClinica } from '@/lib/clinicaContext';
import { base44 } from '@/api/base44Client';
import { DEMO_PROFISSIONAIS } from '@/lib/demoData';

export default function Profissionais() {
  const { clinica } = useClinica();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [profissionais, setProfissionais] = useState([]);

  useEffect(() => {
    if (clinica?.id) {
      base44.entities.Profissional.filter({ clinica_id: clinica.id }).then(setProfissionais);
    }
  }, [clinica?.id]);

  const reload = () => {
    if (clinica?.id) base44.entities.Profissional.filter({ clinica_id: clinica.id }).then(setProfissionais);
  };

  const isReal = !!clinica?.id;
  const source = isReal ? profissionais : DEMO_PROFISSIONAIS;

  const filtered = source.filter(p =>
    p.nome?.toLowerCase().includes(search.toLowerCase()) ||
    p.especialidade?.toLowerCase().includes(search.toLowerCase())
  );

  const ativos = source.filter(p => p.ativo !== false).length;

  const handleToggleAtivo = async (prof) => {
    if (!isReal) return;
    await base44.entities.Profissional.update(prof.id, { ativo: !prof.ativo });
    reload();
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Profissionais"
        subtitle={`${ativos} profissional(is) ativo(s)`}
        action={
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus size={16} /> Novo Profissional
          </Button>
        }
      />

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou especialidade..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-3 bg-card rounded-xl border border-border p-10 text-center text-sm text-muted-foreground">
            {isReal ? 'Nenhum profissional cadastrado. Adicione o primeiro!' : 'Nenhum resultado.'}
          </div>
        )}
        {filtered.map(prof => (
          <div key={prof.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: prof.cor_agenda || '#0EA5E9' }}>
                  {prof.nome?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{prof.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">{prof.especialidade || '—'}</p>
                  {prof.registro_profissional && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">{prof.registro_profissional}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => { setSelected(prof); setShowModal(true); }}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
                  <Edit size={14} />
                </button>
                {isReal && (
                  <button onClick={() => handleToggleAtivo(prof)}
                    className={`p-1.5 rounded-lg transition-colors ${prof.ativo !== false ? 'text-muted-foreground hover:text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}>
                    <Power size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>{prof.horario_inicio || '08:00'} — {prof.horario_fim || '18:00'}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${prof.ativo !== false ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                {prof.ativo !== false ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ProfissionalModal
          onClose={() => { setShowModal(false); setSelected(null); }}
          profissional={selected}
          onSaved={() => { reload(); setShowModal(false); setSelected(null); }}
        />
      )}
    </div>
  );
}