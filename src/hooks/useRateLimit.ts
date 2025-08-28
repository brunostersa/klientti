import { useState, useRef, useCallback } from 'react';

interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number; // em milissegundos
  key?: string; // chave única para diferentes tipos de operação
}

interface RateLimitState {
  isAllowed: boolean;
  remainingRequests: number;
  resetTime: number;
  lastRequestTime: number;
}

export function useRateLimit(config: RateLimitConfig) {
  const { maxRequests, timeWindow, key = 'default' } = config;
  
  // Estado local para rate limiting
  const [state, setState] = useState<RateLimitState>({
    isAllowed: true,
    remainingRequests: maxRequests,
    resetTime: Date.now() + timeWindow,
    lastRequestTime: 0
  });

  // Ref para persistir entre re-renders
  const stateRef = useRef(state);
  stateRef.current = state;

  // Função para verificar se a operação é permitida
  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const currentState = stateRef.current;

    // Se o time window expirou, resetar contadores
    if (now >= currentState.resetTime) {
      const newState: RateLimitState = {
        isAllowed: true,
        remainingRequests: maxRequests,
        resetTime: now + timeWindow,
        lastRequestTime: now
      };
      setState(newState);
      return true;
    }

    // Verificar se ainda há requests disponíveis
    if (currentState.remainingRequests > 0) {
      const newState: RateLimitState = {
        ...currentState,
        remainingRequests: currentState.remainingRequests - 1,
        lastRequestTime: now,
        isAllowed: currentState.remainingRequests > 1
      };
      setState(newState);
      return true;
    }

    // Rate limit atingido
    return false;
  }, [maxRequests, timeWindow]);

  // Função para aguardar até que seja permitido
  const waitForRateLimit = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => {
      const check = () => {
        if (checkRateLimit()) {
          resolve();
        } else {
          // Aguardar um pouco e verificar novamente
          setTimeout(check, 100);
        }
      };
      check();
    });
  }, [checkRateLimit]);

  // Função para forçar reset do rate limit (útil para testes)
  const resetRateLimit = useCallback(() => {
    const now = Date.now();
    setState({
      isAllowed: true,
      remainingRequests: maxRequests,
      resetTime: now + timeWindow,
      lastRequestTime: now
    });
  }, [maxRequests, timeWindow]);

  return {
    checkRateLimit,
    waitForRateLimit,
    resetRateLimit,
    state,
    isAllowed: state.isAllowed,
    remainingRequests: state.remainingRequests,
    resetTime: state.resetTime
  };
}
