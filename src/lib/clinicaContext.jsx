import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export const ClinicaContext = createContext(null);

export function ClinicaProvider({ children }) {
  const [clinica, setClinica] = useState(null);
  const [todasClinicas, setTodasClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    loadClinica();
  }, []);

  const loadClinica = async () => {
    try {
      const me = await base44.auth.me();
      setUser(me);
      setIsSuperAdmin(me?.role === 'admin');

      if (me?.role === 'admin') {
        // Super Admin: load all clinics and select stored one or first available
        const todas = await base44.entities.Clinica.list();
        setTodasClinicas(todas);
        const storedId = localStorage.getItem('superadmin_clinica_id');
        const selected = todas.find(c => c.id === storedId) || todas[0] || null;
        if (selected) {
          applyClinicaBranding(selected);
          setClinica(selected);
        }
      } else {
        // Load the clinic associated to this user
        const clinicas = await base44.entities.Clinica.filter({ owner_email: me.email });
        if (clinicas.length > 0) {
          applyClinicaBranding(clinicas[0]);
          setClinica(clinicas[0]);
        } else {
          // Check if they're a team member
          const membros = await base44.entities.MembroEquipe.filter({ user_email: me.email, ativo: true });
          if (membros.length > 0) {
            const clinicaData = await base44.entities.Clinica.filter({ id: membros[0].clinica_id });
            if (clinicaData.length > 0) {
              applyClinicaBranding(clinicaData[0]);
              setClinica(clinicaData[0]);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectClinica = (c) => {
    if (c) {
      localStorage.setItem('superadmin_clinica_id', c.id);
      applyClinicaBranding(c);
    }
    setClinica(c);
  };

  const applyClinicaBranding = (c) => {
    if (c?.cor_principal) {
      document.documentElement.style.setProperty('--clinic-primary', c.cor_principal);
    }
  };

  const refreshClinica = async (id) => {
    if (!id && !clinica?.id) return;
    const targetId = id || clinica.id;
    const list = await base44.entities.Clinica.filter({ id: targetId });
    if (list.length > 0) {
      setClinica(list[0]);
      applyClinicaBranding(list[0]);
    }
  };

  return (
    <ClinicaContext.Provider value={{ clinica, setClinica, todasClinicas, selectClinica, loading, user, isSuperAdmin, refreshClinica, applyClinicaBranding }}>
      {children}
    </ClinicaContext.Provider>
  );
}

export function useClinica() {
  return useContext(ClinicaContext);
}

// Demo data seed for presentation
export const DEMO_CLINICA_ID = 'demo-clinica-001';