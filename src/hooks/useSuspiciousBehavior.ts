import { useState, useRef, useCallback } from 'react';

interface BehaviorPattern {
  type: 'rapid_typing' | 'repeated_actions' | 'suspicious_timing' | 'pattern_repetition';
  confidence: number; // 0-1
  description: string;
  timestamp: number;
}

interface SuspiciousBehaviorState {
  patterns: BehaviorPattern[];
  riskScore: number; // 0-100
  isSuspicious: boolean;
  lastActionTime: number;
  actionCount: number;
  typingSpeed: number[];
}

export function useSuspiciousBehavior() {
  const [state, setState] = useState<SuspiciousBehaviorState>({
    patterns: [],
    riskScore: 0,
    isSuspicious: false,
    lastActionTime: 0,
    actionCount: 0,
    typingSpeed: []
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // Detectar digitação muito rápida (possível bot/IA)
  const detectRapidTyping = useCallback((text: string, timeElapsed: number) => {
    const charactersPerSecond = text.length / (timeElapsed / 1000);
    const isRapid = charactersPerSecond > 50; // Mais de 50 caracteres por segundo é suspeito

    if (isRapid) {
      const pattern: BehaviorPattern = {
        type: 'rapid_typing',
        confidence: Math.min(charactersPerSecond / 100, 1), // Normalizar para 0-1
        description: `Digitação muito rápida: ${charactersPerSecond.toFixed(1)} chars/seg`,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        patterns: [...prev.patterns.slice(-9), pattern],
        riskScore: Math.min(prev.riskScore + 20, 100)
      }));
    }

    return isRapid;
  }, []);

  // Detectar ações repetitivas
  const detectRepeatedActions = useCallback((action: string, data: any) => {
    const now = Date.now();
    const currentState = stateRef.current;
    
    // Verificar se a mesma ação foi feita recentemente
    const recentActions = currentState.patterns
      .filter(p => p.type === 'repeated_actions')
      .slice(-5);

    const similarActions = recentActions.filter(p => 
      p.description.includes(action) && 
      (now - p.timestamp) < 60000 // Último minuto
    );

    if (similarActions.length >= 3) {
      const pattern: BehaviorPattern = {
        type: 'repeated_actions',
        confidence: Math.min(similarActions.length / 5, 1),
        description: `Ação repetida: ${action} (${similarActions.length + 1}x)`,
        timestamp: now
      };

      setState(prev => ({
        ...prev,
        patterns: [...prev.patterns.slice(-9), pattern],
        riskScore: Math.min(prev.riskScore + 15, 100)
      }));

      return true;
    }

    return false;
  }, []);

  // Detectar timing suspeito entre ações
  const detectSuspiciousTiming = useCallback((action: string) => {
    const now = Date.now();
    const currentState = stateRef.current;
    
    if (currentState.lastActionTime > 0) {
      const timeBetweenActions = now - currentState.lastActionTime;
      
      // Se ações são muito rápidas (menos de 100ms), é suspeito
      if (timeBetweenActions < 100) {
        const pattern: BehaviorPattern = {
          type: 'suspicious_timing',
          confidence: 0.8,
          description: `Ações muito rápidas: ${timeBetweenActions}ms entre ações`,
          timestamp: now
        };

        setState(prev => ({
          ...prev,
          patterns: [...prev.patterns.slice(-9), pattern],
          riskScore: Math.min(prev.riskScore + 25, 100)
        }));

        return true;
      }

      // Se ações são muito regulares (padrão de tempo), é suspeito
      const recentTimings = currentState.patterns
        .filter(p => p.type === 'suspicious_timing')
        .slice(-3);

      if (recentTimings.length >= 2) {
        const timingVariance = recentTimings.reduce((sum, p) => {
          const timeDiff = Math.abs(timeBetweenActions - (p.timestamp - currentState.lastActionTime));
          return sum + timeDiff;
        }, 0) / recentTimings.length;

        if (timingVariance < 50) { // Variação menor que 50ms é suspeito
          const pattern: BehaviorPattern = {
            type: 'suspicious_timing',
            confidence: 0.9,
            description: `Timing muito regular: variação de ${timingVariance.toFixed(1)}ms`,
            timestamp: now
          };

          setState(prev => ({
            ...prev,
            patterns: [...prev.patterns.slice(-9), pattern],
            riskScore: Math.min(prev.riskScore + 30, 100)
          }));

          return true;
        }
      }
    }

    // Atualizar estado
    setState(prev => ({
      ...prev,
      lastActionTime: now,
      actionCount: prev.actionCount + 1
    }));

    return false;
  }, []);

  // Detectar repetição de padrões
  const detectPatternRepetition = useCallback((data: any) => {
    const currentState = stateRef.current;
    
    // Verificar se dados são muito similares aos anteriores
    const recentPatterns = currentState.patterns
      .filter(p => p.type === 'pattern_repetition')
      .slice(-3);

    // Simples comparação de estrutura (pode ser expandida)
    const dataString = JSON.stringify(data);
    const isRepetitive = recentPatterns.some(p => 
      p.description.includes(dataString.substring(0, 50)) // Primeiros 50 chars
    );

    if (isRepetitive) {
      const pattern: BehaviorPattern = {
        type: 'pattern_repetition',
        confidence: 0.7,
        description: `Padrão repetitivo detectado`,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        patterns: [...prev.patterns.slice(-9), pattern],
        riskScore: Math.min(prev.riskScore + 20, 100)
      }));

      return true;
    }

    return false;
  }, []);

  // Função principal para registrar ação
  const recordAction = useCallback((action: string, data?: any) => {
    const now = Date.now();
    
    // Detectar comportamentos suspeitos
    const isRapidTyping = data?.text ? detectRapidTyping(data.text, data.timeElapsed || 1000) : false;
    const isRepeated = detectRepeatedActions(action, data);
    const isSuspiciousTiming = detectSuspiciousTiming(action);
    const isPatternRepetition = data ? detectPatternRepetition(data) : false;

    // Calcular risco total
    const newRiskScore = Math.min(
      stateRef.current.riskScore + 
      (isRapidTyping ? 20 : 0) +
      (isRepeated ? 15 : 0) +
      (isSuspiciousTiming ? 25 : 0) +
      (isPatternRepetition ? 20 : 0),
      100
    );

    // Decay do risco ao longo do tempo
    const timeSinceLastAction = now - stateRef.current.lastActionTime;
    const decayedRiskScore = Math.max(
      newRiskScore - (timeSinceLastAction / 60000) * 10, // Decay de 10 pontos por minuto
      0
    );

    setState(prev => ({
      ...prev,
      riskScore: decayedRiskScore,
      isSuspicious: decayedRiskScore > 70,
      lastActionTime: now,
      actionCount: prev.actionCount + 1
    }));

    return {
      isSuspicious: decayedRiskScore > 70,
      riskScore: decayedRiskScore,
      patterns: [isRapidTyping, isRepeated, isSuspiciousTiming, isPatternRepetition]
    };
  }, [detectRapidTyping, detectRepeatedActions, detectSuspiciousTiming, detectPatternRepetition]);

  // Função para resetar estado
  const resetBehavior = useCallback(() => {
    setState({
      patterns: [],
      riskScore: 0,
      isSuspicious: false,
      lastActionTime: 0,
      actionCount: 0,
      typingSpeed: []
    });
  }, []);

  // Função para obter resumo do comportamento
  const getBehaviorSummary = useCallback(() => {
    const currentState = stateRef.current;
    
    return {
      riskLevel: currentState.riskScore < 30 ? 'low' : 
                 currentState.riskScore < 70 ? 'medium' : 'high',
      riskScore: currentState.riskScore,
      totalActions: currentState.actionCount,
      suspiciousPatterns: currentState.patterns.length,
      lastAction: currentState.lastActionTime > 0 ? 
        new Date(currentState.lastActionTime).toLocaleTimeString() : 'Nunca',
      recommendations: currentState.riskScore > 70 ? [
        'Considerar verificação adicional',
        'Monitorar comportamento',
        'Possível verificação CAPTCHA'
      ] : []
    };
  }, []);

  return {
    recordAction,
    resetBehavior,
    getBehaviorSummary,
    state,
    isSuspicious: state.isSuspicious,
    riskScore: state.riskScore
  };
}
