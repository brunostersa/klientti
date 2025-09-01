'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function FeedbackPage() {
  const params = useParams();
  const areaId = params.areaId as string;
  

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [areaData, setAreaData] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const loadAreaAndUserData = async () => {
      try {
        setLoading(true);
        
        // Buscar dados da área
        const areaDoc = await getDoc(doc(db, 'areas', areaId));
        if (areaDoc.exists()) {
          const area = { id: areaDoc.id, ...areaDoc.data() };
          setAreaData(area);
          
          // Buscar dados do usuário proprietário da área
          if (area.userId) {
            const userDoc = await getDoc(doc(db, 'users', area.userId));
            if (userDoc.exists()) {
              setUserProfile({ id: userDoc.id, ...userDoc.data() });
            }
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        setError('Erro ao carregar informações da área');
      } finally {
        setLoading(false);
      }
    };
    
    if (areaId) {
      loadAreaAndUserData();
    }
  }, [areaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    setError('');

    try {
      const feedbackData = {
        areaId: areaId,
        rating,
        comment: comment.trim(),
        isAnonymous: true,
        createdAt: new Date(),
      };

              await addDoc(collection(db, 'feedbacks'), feedbackData);
      
      setSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      setError(`Erro ao enviar feedback: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-accent-color bg-opacity-20 mb-6">
              <svg className="h-10 w-10 text-accent-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Obrigado! 🎉
            </h1>
            <p className="text-white text-lg mb-6">
              Seu feedback foi enviado com sucesso!
            </p>
            <p className="text-white/90">
              Sua opinião é muito importante para melhorarmos nossos serviços.
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <p className="text-sm text-secondary">
              Você pode fechar esta página agora.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white font-bold text-3xl">K</span>
          </div>
          
          {/* Nome da Empresa */}
          {userProfile?.company && (
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white mb-1">
                {userProfile.company}
              </h2>
              <div className="w-16 h-0.5 bg-white/30 mx-auto"></div>
            </div>
          )}
          
          {/* Nome da Área */}
          {areaData?.name && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white/90 mb-2">
                Área: {areaData.name}
              </h3>
              {areaData.description && (
                <p className="text-white/70 text-sm max-w-md mx-auto">
                  {areaData.description}
                </p>
              )}
            </div>
          )}
          

        </div>

        {/* Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-6 text-center">
                ⭐ Como você avalia sua experiência? *
              </label>
              <div className="flex justify-center space-x-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-5xl transition-all duration-300 transform hover:scale-125 ${
                      star <= rating 
                        ? 'text-yellow-400 drop-shadow-lg' 
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div className="text-center mt-4">
                <p className="text-lg font-medium text-gray-700">
                  {rating > 0 ? (
                    <span className="text-yellow-600">
                      {rating} estrela{rating > 1 ? 's' : ''} - {
                        rating === 1 ? 'Péssimo' :
                        rating === 2 ? 'Ruim' :
                        rating === 3 ? 'Regular' :
                        rating === 4 ? 'Bom' : 'Excelente'
                      }
                    </span>
                  ) : (
                    <span className="text-gray-500">Selecione uma avaliação</span>
                  )}
                </p>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-lg font-semibold text-gray-800 mb-4">
                💭 Comentário (opcional)
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-900 placeholder-gray-500 text-lg shadow-sm hover:shadow-md"
                placeholder="Conte-nos mais sobre sua experiência... O que podemos melhorar?"
              />
            </div>



            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Enviando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>🚀</span>
                  <span className="ml-2">Enviar Feedback</span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Tag flutuante "Criado com Klientti" */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20">
            <p className="text-sm text-gray-600 font-medium">
              Criado com <span className="text-blue-600 font-bold">Klientti</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
