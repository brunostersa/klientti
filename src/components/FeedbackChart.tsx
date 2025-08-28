'use client';

import { useState, useMemo } from 'react';

interface FeedbackChartProps {
  feedbacks: any[];
}

export default function FeedbackChart({ feedbacks }: FeedbackChartProps) {
  const [selectedDays, setSelectedDays] = useState(7);

  const stats = useMemo(() => {
    const today = new Date();
    const data = [];
    
    for (let i = selectedDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const feedbacksForDay = feedbacks.filter(feedback => {
        const feedbackDate = feedback.createdAt?.toDate ? feedback.createdAt.toDate() : new Date(feedback.createdAt);
        return feedbackDate >= dayStart && feedbackDate <= dayEnd;
      });
      
      const averageRating = feedbacksForDay.length > 0 
        ? feedbacksForDay.reduce((sum, f) => sum + f.rating, 0) / feedbacksForDay.length 
        : 0;
      
      data.push({
        date: date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Estatísticas dos Últimos {selectedDays} Dias</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Resumo das opiniões recebidas através do Klientti</p>
        </div>
        
        {/* Seletor de período */}
        <div className="flex space-x-2">
          {[7, 15, 30].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedDays(days)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedDays === days
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {days} dias
            </button>
          ))}
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalFeedbacks}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Total de feedbacks</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">Avaliação média</div>
        </div>
      </div>

      {/* Gráfico simplificado com barras */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Feedbacks por dia:</h4>
        {stats.map((day, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-16 text-sm text-gray-600 dark:text-gray-400">{day.date}</div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.max((day.feedbacks / Math.max(...stats.map(s => s.feedbacks), 1)) * 100, 5)}%` }}
              />
            </div>
            <div className="w-12 text-right text-sm font-medium text-gray-900 dark:text-white">
              {day.feedbacks}
            </div>
            <div className="w-16 text-right text-sm text-gray-600 dark:text-gray-400">
              {day.rating > 0 ? `⭐ ${day.rating}` : '-'}
            </div>
          </div>
        ))}
      </div>

      {/* Resumo adicional */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {feedbacks.filter(f => f.rating === 5).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">5 estrelas</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {feedbacks.filter(f => f.rating >= 4).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">4+ estrelas</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {feedbacks.filter(f => f.rating <= 2).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">≤2 estrelas</div>
          </div>
        </div>
      </div>
    </div>
  );
} 