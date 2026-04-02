import React, { createContext, useContext } from 'react';

/**
 * Contexto isolado para o modo DEMO público.
 * Exporta o mesmo ClinicaContext shape que ClinicaProvider,
 * mas com clinica = null para forçar dados fictícios em todas as páginas.
 * As páginas já têm lógica: isReal = !!clinica?.id
 * Com clinica = null, isReal = false → dados demo são usados automaticamente.
 */

// Importamos o contexto original para compartilhar o mesmo provider
import { ClinicaContext } from '@/lib/clinicaContext';

export function DemoClinicaProvider({ children }) {
  const value = {
    clinica: null,       // garante isReal = false em todas as páginas
    setClinica: () => {},
    loading: false,
    user: null,
    isSuperAdmin: false,
    refreshClinica: () => {},
    applyClinicaBranding: () => {},
  };

  return (
    <ClinicaContext.Provider value={value}>
      {children}
    </ClinicaContext.Provider>
  );
}