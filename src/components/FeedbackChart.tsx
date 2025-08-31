'use client';

import React, { useState, useMemo } from 'react';
import { Feedback } from '@/types/Feedback';

interface FeedbackChartProps {
  feedbacks: Feedback[];
}

export default function FeedbackChart({ feedbacks }: FeedbackChartProps) {
  const [selectedDays, setSelectedDays] = useState(7);

  const stats = useMemo(() => {
    const data = [];
    const today = new Date();
    
    for (let i = selectedDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const feedbacksForDay = feedbacks.filter(feedback => {
        const feedbackDate = new Date(feedback.createdAt);
        return feedbackDate.toDateString() === date.toDateString();
      });
      
      const averageRating = feedbacksForDay.length > 0 
        ? feedbacksForDay.reduce((sum, f) => sum + f.rating, 0) / feedbacksForDay.length 
        : 0;
      
      data.push({
        date: dateStr,
        feedbacks: feedbacksForDay.length,
        rating: Math.round(averageRating * 10) / 10,
        fullDate: date
      });
    }
    
    return data;
  }, [feedbacks, selectedDays]);

  const totalFeedbacks = stats.reduce((sum, day) => sum + day.feedbacks, 0);
  const averageRating = stats.reduce((sum, day) => sum + day.rating, 0) / stats.length;

  return (
    <div className="card-theme p-6 shadow-theme-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-theme-primary">Estatísticas dos Últimos {selectedDays} Dias</h3>
          <p className="text-sm text-theme-secondary">Resumo das opiniões recebidas através do Klientti</p>
        </div>
        
        {/* Seletor de período */}
        <div className="flex space-x-2">
          {[7, 15, 30].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedDays(days)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedDays === days
                  ? 'bg-brand-primary text-theme-inverse'
                  : 'bg-theme-button text-theme-button hover:bg-theme-button-hover'
              }`}
            >
              {days} dias
            </button>
          ))}
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-brand-primary-light dark:bg-brand-primary-light/20 rounded-lg p-4 border border-brand-primary/30">
          <div className="text-2xl font-bold text-brand-primary">{totalFeedbacks}</div>
          <div className="text-sm text-brand-primary-dark dark:text-brand-primary">Total de feedbacks</div>
        </div>
        <div className="bg-brand-accent-light dark:bg-brand-accent-light/20 rounded-lg p-4 border border-brand-accent/30">
          <div className="text-2xl font-bold text-brand-accent">
            {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
          </div>
          <div className="text-sm text-brand-accent-dark dark:text-brand-accent">Avaliação média</div>
        </div>
      </div>

      {/* Gráfico simplificado com barras */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-theme-secondary mb-3">Feedbacks por dia:</h4>
        {stats.map((day, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-16 text-sm text-theme-secondary">{day.date}</div>
            <div className="flex-1 bg-theme-button rounded-full h-3">
              <div 
                className="bg-brand-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.max((day.feedbacks / Math.max(...stats.map(s => s.feedbacks), 1)) * 100, 5)}%` }}
              />
            </div>
            <div className="w-12 text-right text-sm font-medium text-theme-primary">
              {day.feedbacks}
            </div>
            <div className="w-16 text-right text-sm text-theme-secondary">
              {day.rating > 0 ? `⭐ ${day.rating}` : '-'}
            </div>
          </div>
        ))}
      </div>

      {/* Resumo adicional */}
      <div className="mt-6 pt-4 border-t border-theme-primary">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-theme-primary">
              {feedbacks.filter(f => f.rating === 5).length}
            </div>
            <div className="text-xs text-theme-secondary">5 estrelas</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-theme-primary">
              {feedbacks.filter(f => f.rating >= 4).length}
            </div>
            <div className="text-xs text-theme-secondary">4+ estrelas</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-theme-primary">
              {feedbacks.filter(f => f.rating <= 2).length}
            </div>
            <div className="text-xs text-theme-secondary">≤2 estrelas</div>
          </div>
        </div>
      </div>
    </div>
  );
} 