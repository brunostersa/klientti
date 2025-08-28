'use client';

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useRateLimit } from '@/hooks/useRateLimit';
import { useContentValidation } from '@/hooks/useContentValidation';
import { useSuspiciousBehavior } from '@/hooks/useSuspiciousBehavior';

interface SecurityContextType {
  // Rate Limiting
  checkRateLimit: () => boolean;
  waitForRateLimit: () => Promise<void>;
  
  // Content Validation
  validateComment: (comment: string) => any;
  validateRating: (rating: number) => any;
  validateFeedback: (feedback: any) => any;
  
  // Suspicious Behavior Detection
  recordAction: (action: string, data?: any) => any;
  isSuspicious: boolean;
  riskScore: number;
  
  // Security Status
  getSecurityStatus: () => any;
  resetSecurity: () => void;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

interface SecurityGuardProps {
  children: ReactNode;
  config?: {
    rateLimit?: {
      maxRequests: number;
      timeWindow: number;
    };
    validation?: {
      minLength: number;
      maxLength: number;
      forbiddenWords: string[];
    };
  };
}

export function SecurityGuard({ children, config }: SecurityGuardProps) {
  // Configurações padrão
  const defaultConfig = {
    rateLimit: { maxRequests: 10, timeWindow: 60000 }, // 10 requests por minuto
    validation: { minLength: 3, maxLength: 1000, forbiddenWords: ['spam', 'bot', 'automated'] }
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Hooks de segurança
  const rateLimit = useRateLimit({
    maxRequests: finalConfig.rateLimit.maxRequests,
    timeWindow: finalConfig.rateLimit.timeWindow
  });

  const contentValidation = useContentValidation({
    minLength: finalConfig.validation.minLength,
    maxLength: finalConfig.validation.maxLength,
    forbiddenWords: finalConfig.validation.forbiddenWords,
    maxRating: 5,
    minRating: 1
  });

  const suspiciousBehavior = useSuspiciousBehavior();

  // Função para obter status completo de segurança
  const getSecurityStatus = useCallback(() => {
    const rateLimitStatus = {
      isAllowed: rateLimit.isAllowed,
      remainingRequests: rateLimit.remainingRequests,
      resetTime: new Date(rateLimit.resetTime).toLocaleTimeString()
    };

    const validationStats = contentValidation.getValidationStats();
    
    const behaviorSummary = suspiciousBehavior.getBehaviorSummary();

    return {
      rateLimit: rateLimitStatus,
      validation: validationStats,
      behavior: behaviorSummary,
      overallRisk: Math.max(
        (behaviorSummary.riskScore / 100) * 0.5 + // 50% peso para comportamento
        (validationStats.invalid / Math.max(validationStats.total, 1)) * 0.3 + // 30% peso para validação
        (rateLimit.isAllowed ? 0 : 0.2) // 20% peso para rate limit
      )
    };
  }, [rateLimit, contentValidation, suspiciousBehavior]);

  // Função para resetar toda a segurança
  const resetSecurity = useCallback(() => {
    rateLimit.resetRateLimit();
    contentValidation.clearHistory();
    suspiciousBehavior.resetBehavior();
  }, [rateLimit, contentValidation, suspiciousBehavior]);

  const contextValue: SecurityContextType = {
    // Rate Limiting
    checkRateLimit: rateLimit.checkRateLimit,
    waitForRateLimit: rateLimit.waitForRateLimit,
    
    // Content Validation
    validateComment: contentValidation.validateComment,
    validateRating: contentValidation.validateRating,
    validateFeedback: contentValidation.validateFeedback,
    
    // Suspicious Behavior Detection
    recordAction: suspiciousBehavior.recordAction,
    isSuspicious: suspiciousBehavior.isSuspicious,
    riskScore: suspiciousBehavior.riskScore,
    
    // Security Status
    getSecurityStatus,
    resetSecurity
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
      
      {/* Indicador visual de segurança (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg text-xs z-50">
          <div className="font-bold mb-1">🛡️ Security Guard</div>
          <div>Risk: {suspiciousBehavior.riskScore}/100</div>
          <div>Rate: {rateLimit.remainingRequests}/{finalConfig.rateLimit.maxRequests}</div>
          <div className={suspiciousBehavior.isSuspicious ? 'text-red-400' : 'text-green-400'}>
            {suspiciousBehavior.isSuspicious ? '⚠️ Suspicious' : '✅ Safe'}
          </div>
        </div>
      )}
    </SecurityContext.Provider>
  );
}

// Hook para usar o contexto de segurança
export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity deve ser usado dentro de SecurityGuard');
  }
  return context;
}

// Componente de exemplo de uso
export function SecurityExample() {
  const security = useSecurity();

  const handleSubmitFeedback = async (feedback: any) => {
    // Verificar rate limit
    if (!security.checkRateLimit()) {
      console.log('Rate limit atingido, aguardando...');
      await security.waitForRateLimit();
    }

    // Validar conteúdo
    const validation = security.validateFeedback(feedback);
    if (!validation.isValid) {
      console.error('Validação falhou:', validation.errors);
      return false;
    }

    // Registrar ação para detecção de comportamento suspeito
    const behavior = security.recordAction('submit_feedback', feedback);
    if (behavior.isSuspicious) {
      console.warn('Comportamento suspeito detectado!');
      // Aqui você pode implementar medidas adicionais (CAPTCHA, verificação, etc.)
    }

    // Se tudo estiver ok, prosseguir
    return true;
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">🛡️ Exemplo de Uso da Segurança</h3>
      <button
        onClick={() => handleSubmitFeedback({
          comment: 'Teste de segurança',
          rating: 5,
          areaId: 'test-area'
        })}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Testar Segurança
      </button>
      
      <div className="mt-4 text-sm">
        <div>Status: {security.getSecurityStatus().overallRisk > 0.7 ? '⚠️ Alto Risco' : '✅ Seguro'}</div>
        <div>Score: {security.riskScore}/100</div>
      </div>
    </div>
  );
}
