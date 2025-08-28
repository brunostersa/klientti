'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function TestFirebasePage() {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  const testFirebaseConnection = async () => {
    setStatus('Testando conexão...');
    setError('');

    try {
      // Testar se o Firebase está inicializado
      if (!db) {
        throw new Error('Firestore não está inicializado');
      }

      setStatus('✅ Firestore inicializado com sucesso');

      // Testar se o auth está funcionando
      if (!auth) {
        throw new Error('Auth não está inicializado');
      }

      setStatus('✅ Auth inicializado com sucesso');

      // Verificar se há usuário logado
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          setStatus('✅ Usuário autenticado: ' + user.email);
        } else {
          setStatus('ℹ️ Nenhum usuário autenticado');
        }
      });

    } catch (err: any) {
      setError('❌ Erro: ' + err.message);
      console.error('Erro no teste:', err);
    }
  };

  const testFirestoreWrite = async () => {
    if (!user) {
      setError('❌ Usuário não está autenticado');
      return;
    }

    setStatus('Testando escrita no Firestore...');
    setError('');

    try {
      const testData = {
        test: true,
        timestamp: new Date(),
        userId: user.uid,
        message: 'Teste de conectividade'
      };

      await setDoc(doc(db, 'test', 'connection-test'), testData);
      setStatus('✅ Escrita no Firestore funcionando!');

      // Testar leitura
      const docRef = await getDoc(doc(db, 'test', 'connection-test'));
      if (docRef.exists()) {
        setStatus('✅ Leitura do Firestore funcionando!');
      }

    } catch (err: any) {
      setError('❌ Erro ao escrever no Firestore: ' + err.message);
      console.error('Erro na escrita:', err);
    }
  };

  const testUserProfileUpdate = async () => {
    if (!user) {
      setError('❌ Usuário não está autenticado');
      return;
    }

    setStatus('Testando atualização de perfil...');
    setError('');

    try {
      const userData = {
        email: user.email,
        name: 'Teste de Perfil',
        company: 'Empresa Teste',
        segment: 'tecnologia',
        phone: '11999999999',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user',
        plan: 'free',
        theme: 'light'
      };

      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      setStatus('✅ Atualização de perfil funcionando!');

    } catch (err: any) {
      setError('❌ Erro ao atualizar perfil: ' + err.message);
      console.error('Erro na atualização:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          🔧 Teste de Conectividade Firebase
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Status da Conexão</h2>
            <div className="p-4 bg-gray-100 rounded-md">
              <p className="text-gray-700">{status || 'Clique em "Testar Conexão" para começar'}</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={testFirebaseConnection}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔍 Testar Conexão Firebase
            </button>

            {user && (
              <>
                <button
                  onClick={testFirestoreWrite}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  ✍️ Testar Escrita no Firestore
                </button>

                <button
                  onClick={testUserProfileUpdate}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  👤 Testar Atualização de Perfil
                </button>
              </>
            )}
          </div>

          {user && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-semibold text-blue-800 mb-2">Usuário Logado:</h3>
              <p className="text-blue-700">Email: {user.email}</p>
              <p className="text-blue-700">UID: {user.uid}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
