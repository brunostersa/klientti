import { useState, useCallback } from 'react';

interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  allowedCharacters?: RegExp;
  forbiddenWords?: string[];
  maxRating?: number;
  minRating?: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function useContentValidation(rules: ValidationRules = {}) {
  const [validationHistory, setValidationHistory] = useState<ValidationResult[]>([]);

  // Função para validar texto de comentário
  const validateComment = useCallback((comment: string): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validação de comprimento
    if (rules.minLength && comment.length < rules.minLength) {
      errors.push(`Comentário deve ter pelo menos ${rules.minLength} caracteres`);
    }

    if (rules.maxLength && comment.length > rules.maxLength) {
      errors.push(`Comentário deve ter no máximo ${rules.maxLength} caracteres`);
    }

    // Validação de caracteres permitidos
    if (rules.allowedCharacters && !rules.allowedCharacters.test(comment)) {
      errors.push('Comentário contém caracteres não permitidos');
    }

    // Detecção de palavras proibidas
    if (rules.forbiddenWords) {
      const lowerComment = comment.toLowerCase();
      const foundForbiddenWords = rules.forbiddenWords.filter(word => 
        lowerComment.includes(word.toLowerCase())
      );
      
      if (foundForbiddenWords.length > 0) {
        warnings.push(`Palavras sensíveis detectadas: ${foundForbiddenWords.join(', ')}`);
      }
    }

    // Detecção de padrões suspeitos (spam/IA)
    const suspiciousPatterns = [
      /\b(spam|bot|automated|script)\b/i,
      /[A-Z]{5,}/g, // Muitas letras maiúsculas seguidas
      /[!@#$%^&*]{3,}/g, // Muitos caracteres especiais
      /\b\d{10,}\b/g, // Números muito longos
      /(.)\1{5,}/g, // Caracteres repetidos
    ];

    suspiciousPatterns.forEach((pattern, index) => {
      if (pattern.test(comment)) {
        warnings.push('Padrão suspeito detectado - possível conteúdo automatizado');
      }
    });

    // Detecção de repetição excessiva
    const words = comment.split(/\s+/);
    const wordCount = words.length;
    const uniqueWords = new Set(words);
    const repetitionRatio = uniqueWords.size / wordCount;

    if (wordCount > 10 && repetitionRatio < 0.3) {
      warnings.push('Muitas palavras repetidas - possível conteúdo automatizado');
    }

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings
    };

    // Adicionar ao histórico
    setValidationHistory(prev => [...prev.slice(-9), result]);

    return result;
  }, [rules]);

  // Função para validar rating
  const validateRating = useCallback((rating: number): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const minRating = rules.minRating || 1;
    const maxRating = rules.maxRating || 5;

    if (rating < minRating || rating > maxRating) {
      errors.push(`Rating deve estar entre ${minRating} e ${maxRating}`);
    }

    // Detecção de padrões suspeitos
    if (rating === 5 && validationHistory.length > 0) {
      const recentRatings = validationHistory.slice(-5).map(h => h.isValid);
      if (recentRatings.every(r => r === true)) {
        warnings.push('Muitas avaliações máximas consecutivas - possível manipulação');
      }
    }

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings
    };

    setValidationHistory(prev => [...prev.slice(-9), result]);
    return result;
  }, [rules, validationHistory]);

  // Função para validar dados completos de feedback
  const validateFeedback = useCallback((feedback: {
    comment: string;
    rating: number;
    areaId?: string;
  }): ValidationResult => {
    const commentValidation = validateComment(feedback.comment);
    const ratingValidation = validateRating(feedback.rating);

    const combinedResult: ValidationResult = {
      isValid: commentValidation.isValid && ratingValidation.isValid,
      errors: [...commentValidation.errors, ...ratingValidation.errors],
      warnings: [...commentValidation.warnings, ...ratingValidation.warnings]
    };

    // Validações adicionais
    if (!feedback.areaId) {
      combinedResult.errors.push('Área é obrigatória');
      combinedResult.isValid = false;
    }

    return combinedResult;
  }, [validateComment, validateRating]);

  // Função para limpar histórico
  const clearHistory = useCallback(() => {
    setValidationHistory([]);
  }, []);

  // Função para obter estatísticas de validação
  const getValidationStats = useCallback(() => {
    const total = validationHistory.length;
    const valid = validationHistory.filter(v => v.isValid).length;
    const invalid = total - valid;
    const warnings = validationHistory.reduce((sum, v) => sum + v.warnings.length, 0);

    return {
      total,
      valid,
      invalid,
      warnings,
      successRate: total > 0 ? (valid / total) * 100 : 0
    };
  }, [validationHistory]);

  return {
    validateComment,
    validateRating,
    validateFeedback,
    clearHistory,
    getValidationStats,
    validationHistory,
    rules
  };
}
