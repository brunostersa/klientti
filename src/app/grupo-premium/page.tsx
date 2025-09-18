'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PremiumGroup from '@/components/PremiumGroup';
import { useActiveTab } from '@/hooks/useActiveTab';

export default function PremiumGroupPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);

  const router = useRouter();
  const activeTab = useActiveTab();

  useEffect(() => {
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
  }, [router]);

  const loadUserProfile = async (userId: string) => {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserProfile(data);
        
        // Verificar se o usuário tem acesso ao grupo premium
        const plan = data.plan || 'starter';
        setHasAccess(['premium', 'pro'].includes(plan));
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
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
          <p className="text-theme-primary">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-theme-primary">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'overview') router.push('/dashboard');
            else if (tab === 'areas') router.push('/areas');
            else if (tab === 'feedbacks') router.push('/feedbacks');
            else if (tab === 'agente-ia') router.push('/agente-ia');
            else if (tab === 'base-conhecimento') router.push('/base-conhecimento');
            else if (tab === 'pricing') router.push('/planos');
            else if (tab === 'assinatura') router.push('/assinatura');
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
              <div className="text-8xl mb-6">🔒</div>
              <h1 className="text-4xl font-bold text-theme-primary mb-4">
                Acesso Restrito
              </h1>
              <p className="text-xl text-theme-secondary mb-8">
                O Grupo de Evolução Premium é exclusivo para clientes Premium e Pro
              </p>
              <div className="bg-gradient-to-r from-brand-primary-light to-brand-secondary-light rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-theme-primary mb-4">
                  💎 Desbloqueie o Grupo Premium
                </h2>
                <p className="text-theme-secondary mb-6">
                  Faça upgrade para Premium ou Pro e tenha acesso a:
                </p>
                <ul className="text-left max-w-md mx-auto space-y-2 text-theme-secondary">
                  <li>✅ Networking com outros empreendedores</li>
                  <li>✅ Dicas exclusivas de crescimento</li>
                  <li>✅ Estratégias avançadas de marketing</li>
                  <li>✅ Suporte direto da equipe</li>
                  <li>✅ Eventos e workshops exclusivos</li>
                </ul>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => router.push('/planos')}
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Ver Planos Premium
                </button>
                <button
                  onClick={() => router.push('/assinatura')}
                  className="bg-theme-button text-theme-primary px-8 py-4 rounded-xl font-bold text-lg border-2 border-theme-border-primary hover:bg-theme-border-primary transition-all"
                >
                  Minha Assinatura
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-primary">
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'overview') router.push('/dashboard');
          else if (tab === 'areas') router.push('/areas');
          else if (tab === 'feedbacks') router.push('/feedbacks');
          else if (tab === 'agente-ia') router.push('/agente-ia');
          else if (tab === 'base-conhecimento') router.push('/base-conhecimento');
          else if (tab === 'pricing') router.push('/planos');
          else if (tab === 'assinatura') router.push('/assinatura');
        }}
        user={user}
        userProfile={userProfile}
        onLogout={handleLogout}
        isMobileMenuOpen={false}
        onMobileMenuToggle={() => {}}
      />

      <div className="lg:ml-80">
        <PremiumGroup user={user} userProfile={userProfile} />
      </div>
    </div>
  );
}
