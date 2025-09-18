'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Sidebar from '@/components/Sidebar';

function PaymentSuccessContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isFromOnboarding, setIsFromOnboarding] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Verificar se veio do onboarding
    const onboardingParam = searchParams.get('onboarding');
    if (onboardingParam === 'success') {
      setIsFromOnboarding(true);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadUserProfile(user.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, searchParams]);

  const loadUserProfile = async (userId: string) => {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUserProfile(userData);
        
        console.log('🔍 Payment Success: Perfil carregado:', userData);
        
        // Se veio do onboarding e não tem plano ativo, forçar atualização
        if (isFromOnboarding && (!userData.plan || userData.subscriptionStatus !== 'trialing')) {
          console.log('🔍 Payment Success: Forçando atualização do plano...');
          await forceUpdateUserPlan(userId);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const forceUpdateUserPlan = async (userId: string) => {
    try {
      console.log('🔍 Payment Success: Atualizando plano manualmente...');
      
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        plan: 'starter',
        subscriptionStatus: 'trialing',
        planUpdatedAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('🔍 Payment Success: Plano atualizado com sucesso!');
      
      // Recarregar perfil atualizado
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        const updatedData = updatedDoc.data();
        setUserProfile(updatedData);
        console.log('🔍 Payment Success: Perfil atualizado:', updatedData);
      }
    } catch (error) {
      console.error('Erro ao forçar atualização do plano:', error);
    }
  };

  const checkAndUpdateSubscription = async (userId: string) => {
    try {
      // Recarregar perfil do usuário para obter dados atualizados
      await loadUserProfile(userId);
      console.log('Perfil do usuário atualizado após pagamento');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-border-primary mx-auto mb-4"></div>
          <p className="text-theme-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-primary">
      <Sidebar
        activeTab="planos"
        onTabChange={(tab) => {
          if (tab === 'overview') router.push('/dashboard');
          else if (tab === 'areas') router.push('/areas');
          else if (tab === 'feedbacks') router.push('/feedbacks');
          else if (tab === 'planos') router.push('/planos');
          else if (tab === 'agente-ia') router.push('/agente-ia');
          else if (tab === 'base-conhecimento') router.push('/base-conhecimento');
          else if (tab === 'pricing') router.push('/planos');
        }}
        user={user}
        userProfile={userProfile}
        onLogout={handleLogout}
        isMobileMenuOpen={false}
        onMobileMenuToggle={() => {}}
      />

      <div className="lg:ml-80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500 mb-6">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-theme-primary mb-4">
              {isFromOnboarding ? '🎉 Bem-vindo ao Klientti!' : '🎉 Pagamento Confirmado!'}
            </h1>

            <p className="text-xl text-theme-secondary mb-8">
              {isFromOnboarding 
                ? 'Sua conta foi configurada com sucesso! Agora você pode começar a coletar feedbacks dos seus clientes.'
                : 'Seu plano foi ativado com sucesso. Bem-vindo a Klientti!'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={async () => {
                  if (isFromOnboarding) {
                    console.log('🔍 Payment Success: Forçando atualização do plano antes de redirecionar...');
                    
                    // Forçar atualização do plano
                    if (user) {
                      try {
                        const userRef = doc(db, 'users', user.uid);
                        await updateDoc(userRef, {
                          plan: 'starter',
                          subscriptionStatus: 'trialing',
                          planUpdatedAt: new Date(),
                          updatedAt: new Date()
                        });
                        console.log('🔍 Payment Success: Plano atualizado com sucesso!');
                      } catch (error) {
                        console.error('🔍 Payment Success: Erro ao atualizar plano:', error);
                      }
                    }
                    
                    // Aguardar um pouco para garantir que a atualização foi processada
                    await new Promise(resolve => setTimeout(resolve, 1000));
                  }
                  
                  console.log('🔍 Payment Success: Redirecionando para dashboard...');
                  router.push('/dashboard');
                }}
                className="px-8 py-3 bg-brand-secondary text-theme-inverse rounded-lg font-medium hover:bg-brand-secondary-hover transition-colors"
              >
                {isFromOnboarding ? '🚀 Começar a Usar' : '🏠 Ir para Meu Painel'}
              </button>
              <button
                onClick={() => router.push('/areas')}
                className="px-8 py-3 bg-theme-inverse text-theme-primary rounded-lg font-medium hover:bg-theme-secondary transition-colors"
              >
                📍 {isFromOnboarding ? 'Criar Primeira Área de Pesquisa' : 'Criar Primeira Área'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-border-primary mx-auto mb-4"></div>
          <p className="text-theme-secondary">Carregando...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
} 