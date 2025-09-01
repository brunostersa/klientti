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
  const [submittedRating, setSubmittedRating] = useState(0);

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
              const userData = { id: userDoc.id, ...userDoc.data() };
              console.log('🔍 UserProfile carregado:', userData);
              console.log('🔍 GoogleMapsUrl:', userData.googleMapsUrl);
              setUserProfile(userData);
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
      
      console.log('🔍 Rating submetido:', rating);
      console.log('🔍 UserProfile no submit:', userProfile);
      setSubmittedRating(rating);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Card Principal */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header do Card */}
            <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-8 py-12 text-center">
              {/* Ícone de Sucesso */}
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              {/* Título */}
              <h1 className="text-3xl font-bold text-white mb-3">
                Obrigado! 🎉
              </h1>
              
              {/* Mensagens */}
              <p className="text-white text-lg mb-2">
                Seu feedback foi enviado com sucesso!
              </p>
              <p className="text-white/90">
                Sua opinião é muito importante para melhorarmos nossos serviços.
              </p>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-8 text-center">


              {/* Debug info - remover depois */}
              <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-600">
                Debug: Rating: {submittedRating}, GoogleMaps: {userProfile?.googleMapsUrl ? 'Sim' : 'Não'}
              </div>

              {/* Link do Google Maps para avaliações 4+ estrelas */}
              {submittedRating >= 4 && userProfile?.googleMapsUrl && (
                <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <h3 className="text-lg font-bold text-blue-800">
                      Avalie a gente no Google também!
                    </h3>
                  </div>
                  <p className="text-blue-700 mb-4">
                    Que bom que você gostou! Sua avaliação no Google Maps nos ajuda muito.
                  </p>
                  <a
                    href={userProfile.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                    style={{ color: 'white !important' }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    Avaliar no Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Tag flutuante "Criado com Klientti" */}
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl rounded-b-lg px-6 py-3 shadow-xl border-2 border-blue-200/50 hover:border-blue-300/70 transition-all duration-300">
              <p className="text-sm text-gray-700 font-medium">
                Criado com <a href="https://klientti.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">Klientti</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header do Card */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 text-center">
            {/* Logo da Empresa */}
            <div className="mb-4">
              <div className="mx-auto w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                <span className="text-white font-bold text-xl" style={{ color: 'white' }}>
                  {userProfile?.company?.charAt(0) || 'K'}
                </span>
              </div>
            </div>
            
            {/* Nome da Empresa */}
            <h1 className="text-2xl font-bold text-white mb-2" style={{ color: 'white' }}>
              {userProfile?.company || 'Klientti'}
            </h1>
            
            {/* Nome da Área */}
            {areaData?.name && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 inline-block">
                <h2 className="text-sm font-semibold text-white" style={{ color: 'white' }}>
                  📍 {areaData.name}
                </h2>
              </div>
            )}
          </div>

          {/* Conteúdo do Card */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Avalie sua experiência
              </h3>
              <p className="text-gray-600">
                Sua opinião é muito importante para melhorarmos nossos serviços
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
              <label className="block text-lg font-semibold text-gray-800 mb-6 text-center">
                ⭐ Como você avalia sua experiência geral? *
              </label>
              <p className="text-sm text-gray-600 text-center mb-6">
                Considere o atendimento recebido, qualidade do serviço e sua experiência geral
              </p>
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
                    <span className="text-yellow-600 font-semibold">
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

            {/* Comment Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 shadow-sm">
              <label htmlFor="comment" className="block text-lg font-semibold text-gray-800 mb-4">
                💭 Comentário (opcional)
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-6 py-4 bg-white/80 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none text-gray-900 placeholder-gray-500 text-lg shadow-sm hover:shadow-md"
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
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-5 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none feedback-submit-btn"
            >
              {submitting ? (
                <div className="flex items-center justify-center text-white">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  <span className="text-white">Enviando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center text-white">
                  <span>🚀</span>
                  <span className="ml-2 text-white">Enviar Feedback</span>
                </div>
              )}
            </button>
            </form>
          </div>
        </div>

        {/* Tag flutuante "Criado com Klientti" */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl rounded-b-lg px-6 py-3 shadow-xl border-2 border-blue-200/50 hover:border-blue-300/70 transition-all duration-300">
            <p className="text-sm text-gray-700 font-medium">
              Criado com <a href="https://klientti.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">Klientti</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
