import { useLocation } from 'react-router-dom';

/**
 * Retorna o prefixo de rota correto baseado no contexto atual.
 * - Se estiver em /demo/* → prefixo "/demo"
 * - Se estiver em /app/* → prefixo "/app"
 * 
 * Uso: const path = useAppPath(); path('/agenda') → '/demo/agenda' ou '/app/agenda'
 */
export function useAppPath() {
  const location = useLocation();
  const isDemo = location.pathname.startsWith('/demo');
  const prefix = isDemo ? '/demo' : '/app';

  return (route) => `${prefix}${route}`;
}