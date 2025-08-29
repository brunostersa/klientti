'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function TestDBPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbData, setDbData] = useState<any>({});
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadAllData(user.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadAllData = async (userId: string) => {
    try {
      console.log('🔍 Iniciando análise completa do banco...');
      
      // 1. Verificar usuário
      console.log('👤 Verificando usuário:', userId);
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.exists() ? userDoc.data() : null;
      console.log('👤 Dados do usuário:', userData);

      // 2. Verificar áreas
      console.log('🏢 Verificando áreas...');
      const areasQuery = query(collection(db, 'areas'));
      const areasSnapshot = await getDocs(areasQuery);
      const areas = areasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('🏢 Total de áreas no banco:', areas.length);
      console.log('🏢 Áreas do usuário:', areas.filter(a => a.userId === userId));
      console.log('🏢 Todas as áreas:', areas);

      // 3. Verificar feedbacks
      console.log('💬 Verificando feedbacks...');
      const feedbacksQuery = query(collection(db, 'feedbacks'));
      const feedbacksSnapshot = await getDocs(feedbacksQuery);
      const feedbacks = feedbacksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('💬 Total de feedbacks no banco:', feedbacks.length);
      console.log('💬 Todos os feedbacks:', feedbacks);

      // 4. Análise de relacionamento
      console.log('🔗 Analisando relacionamentos...');
      const userAreas = areas.filter(a => a.userId === userId);
      const userAreaIds = userAreas.map(a => a.id);
      console.log('🔗 IDs das áreas do usuário:', userAreaIds);

      const userFeedbacks = feedbacks.filter(f => userAreaIds.includes(f.areaId));
      console.log('🔗 Feedbacks das áreas do usuário:', userFeedbacks);

      // 5. Verificar problemas
      const problems = [];
      
      if (userAreas.length === 0) {
        problems.push('❌ Usuário não tem áreas criadas');
      }
      
      if (feedbacks.length === 0) {
        problems.push('❌ Não há feedbacks no banco');
      } else if (userFeedbacks.length === 0) {
        problems.push('❌ Feedbacks existem mas não pertencem às áreas do usuário');
        
        // Verificar feedbacks órfãos
        const orphanFeedbacks = feedbacks.filter(f => !userAreaIds.includes(f.areaId));
        console.log('🔍 Feedbacks órfãos (sem área válida):', orphanFeedbacks);
      }

      // 6. Verificar estrutura dos dados
      if (feedbacks.length > 0) {
        const sampleFeedback = feedbacks[0];
        console.log('🔍 Estrutura de um feedback:', {
          id: sampleFeedback.id,
          areaId: sampleFeedback.areaId,
          hasAreaId: !!sampleFeedback.areaId,
          areaIdType: typeof sampleFeedback.areaId,
          createdAt: sampleFeedback.createdAt,
          createdAtType: typeof sampleFeedback.createdAt
        });
      }

      if (areas.length > 0) {
        const sampleArea = areas[0];
        console.log('🔍 Estrutura de uma área:', {
          id: sampleArea.id,
          userId: sampleArea.userId,
          hasUserId: !!sampleArea.userId,
          userIdType: typeof sampleArea.userId
        });
      }

      setDbData({
        user: userData,
        areas: {
          total: areas.length,
          userAreas: userAreas,
          all: areas
        },
        feedbacks: {
          total: feedbacks.length,
          userFeedbacks: userFeedbacks,
          all: feedbacks
        },
        problems: problems
      });

    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setError(error.message);
    }
  };

  const refreshData = () => {
    if (user) {
      loadAllData(user.uid);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🔍 Teste do Banco de Dados</h1>
          <p className="text-gray-600 mb-4">Análise completa para identificar problemas</p>
          
          <button
            onClick={refreshData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Atualizar Dados
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {dbData.user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Usuário */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Usuário</h2>
              <div className="space-y-2 text-sm">
                <div><strong>ID:</strong> {user?.uid}</div>
                <div><strong>Email:</strong> {dbData.user.email}</div>
                <div><strong>Nome:</strong> {dbData.user.name || 'Não definido'}</div>
                <div><strong>Empresa:</strong> {dbData.user.company || 'Não definida'}</div>
                <div><strong>Plano:</strong> {dbData.user.plan || 'free'}</div>
              </div>
            </div>

            {/* Áreas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🏢 Áreas</h2>
              <div className="space-y-2 text-sm">
                <div><strong>Total no banco:</strong> {dbData.areas?.total || 0}</div>
                <div><strong>Do usuário:</strong> {dbData.areas?.userAreas?.length || 0}</div>
                <div className="text-xs text-gray-600">
                  {dbData.areas?.userAreas?.map((area: any) => (
                    <div key={area.id}>• {area.name} (ID: {area.id})</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feedbacks */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">💬 Feedbacks</h2>
              <div className="space-y-2 text-sm">
                <div><strong>Total no banco:</strong> {dbData.feedbacks?.total || 0}</div>
                <div><strong>Do usuário:</strong> {dbData.feedbacks?.userFeedbacks?.length || 0}</div>
                <div className="text-xs text-gray-600">
                  {dbData.feedbacks?.userFeedbacks?.slice(0, 3).map((feedback: any) => (
                    <div key={feedback.id}>• {feedback.comment?.substring(0, 30)}...</div>
                  ))}
                  {dbData.feedbacks?.userFeedbacks?.length > 3 && (
                    <div>... e mais {dbData.feedbacks.userFeedbacks.length - 3}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Problemas identificados */}
        {dbData.problems && dbData.problems.length > 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-6">
            <h3 className="font-bold mb-2">⚠️ Problemas Identificados:</h3>
            <ul className="list-disc list-inside space-y-1">
              {dbData.problems.map((problem: string, index: number) => (
                <li key={index}>{problem}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Dados completos para debug */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Dados Completos (Console)</h2>
          <p className="text-gray-600 mb-4">
            Abra o console do navegador (F12) para ver todos os dados e logs detalhados.
          </p>
          <div className="bg-gray-100 p-4 rounded text-sm font-mono">
            <div>📊 Total de áreas: {dbData.areas?.total || 0}</div>
            <div>📊 Áreas do usuário: {dbData.areas?.userAreas?.length || 0}</div>
            <div>📊 Total de feedbacks: {dbData.feedbacks?.total || 0}</div>
            <div>📊 Feedbacks do usuário: {dbData.feedbacks?.userFeedbacks?.length || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
