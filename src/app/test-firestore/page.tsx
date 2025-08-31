'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function TestFirestorePage() {
  const [user, setUser] = useState<User | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadAllData();
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Carregar todas as áreas
      const areasQuery = query(collection(db, 'areas'));
      const areasSnapshot = await getDocs(areasQuery);
      const areasData = areasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAreas(areasData);
      console.log('Áreas carregadas:', areasData);

      // Carregar todos os feedbacks
      const feedbacksQuery = query(collection(db, 'feedbacks'));
      const feedbacksSnapshot = await getDocs(feedbacksQuery);
      const feedbacksData = feedbacksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedbacks(feedbacksData);
      console.log('Feedbacks carregados:', feedbacksData);

      // Carregar todos os usuários
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      console.log('Usuários carregados:', usersData);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados do Firestore');
    } finally {
      setLoading(false);
    }
  };

  const testRealtimeFeedbacks = () => {
    if (!user) return;

    console.log('Testando feedbacks em tempo real para usuário:', user.uid);
    
    // Testar query com filtro de usuário
    const q = query(collection(db, 'feedbacks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Feedbacks em tempo real:', snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return unsubscribe;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando dados do Firestore...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Teste do Firestore</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📊 Estatísticas</h2>
            <div className="space-y-2">
              <p><strong>Usuário logado:</strong> {user?.email}</p>
              <p><strong>UID:</strong> {user?.uid}</p>
              <p><strong>Total de áreas:</strong> {areas.length}</p>
              <p><strong>Total de feedbacks:</strong> {feedbacks.length}</p>
              <p><strong>Total de usuários:</strong> {users.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🔍 Áreas do Usuário</h2>
            <div className="space-y-2">
              {areas.filter(area => area.userId === user?.uid).map(area => (
                <div key={area.id} className="p-2 bg-gray-50 rounded">
                  <p><strong>Nome:</strong> {area.name}</p>
                  <p><strong>ID:</strong> {area.id}</p>
                  <p><strong>UserId:</strong> {area.userId}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">💬 Feedbacks Relacionados</h2>
            <div className="space-y-2">
              {feedbacks.filter(feedback => {
                const area = areas.find(a => a.id === feedback.areaId);
                return area && area.userId === user?.uid;
              }).map(feedback => (
                <div key={feedback.id} className="p-2 bg-gray-50 rounded">
                  <p><strong>Rating:</strong> {feedback.rating}/5</p>
                  <p><strong>Comentário:</strong> {feedback.comment?.substring(0, 50)}...</p>
                  <p><strong>AreaId:</strong> {feedback.areaId}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 Dados Completos</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Áreas:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(areas, null, 2)}
            </pre>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Feedbacks:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(feedbacks, null, 2)}
            </pre>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Usuários:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(users, null, 2)}
            </pre>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={loadAllData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔄 Recarregar Dados
          </button>
          
          <button
            onClick={testRealtimeFeedbacks}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            📡 Testar Tempo Real
          </button>
        </div>
      </div>
    </div>
  );
}
