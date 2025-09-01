'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Sidebar from '@/components/Sidebar';
import Card, { CardHeader, CardContent } from '@/components/Card';
import { useActiveTab } from '@/hooks/useActiveTab';
interface SubscriptionData {
  plan: 'free' | 'starter' | 'professional';
  subscriptionStatus?: string;
  planUpdatedAt?: Date;
}

export default function SubscriptionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
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
        setSubscriptionData({
          plan: data.plan || 'free',
          subscriptionStatus: data.subscriptionStatus,
          planUpdatedAt: data.planUpdatedAt?.toDate(),
        });
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

  // Função para fazer upgrade via Stripe
  const handleUpgrade = async (plan: 'starter' | 'professional') => {
    if (!user) {
      console.error('Usuário não autenticado');
      return;
    }

    try {
      console.log(`Iniciando upgrade para plano: ${plan}`);
      
      // Chamar API do Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar sessão de checkout');
      }

      const { sessionId } = await response.json();
      console.log('Sessão de checkout criada:', sessionId);

      // Redirecionar para Stripe Checkout
      if (typeof window !== 'undefined' && (window as any).Stripe) {
        const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        const { error } = await stripe.redirectToCheckout({ sessionId });
        
        if (error) {
          console.error('Erro ao redirecionar para checkout:', error);
          alert('Erro ao redirecionar para checkout. Tente novamente.');
        }
      } else {
        // Fallback: redirecionar diretamente
        window.location.href = `/api/redirect-to-stripe?sessionId=${sessionId}`;
      }

    } catch (error) {
      console.error('Erro ao fazer upgrade:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`Erro ao fazer upgrade: ${errorMessage}. Tente novamente.`);
    }
  };

  const getPlanInfo = (plan: string) => {
    switch (plan) {
      case 'free':
        return { name: 'Gratuito', price: 0, features: ['2 áreas', '50 feedbacks/mês'] };
      case 'starter':
        return { name: 'Starter', price: 29, features: ['5 áreas', '200 feedbacks/mês'] };
      case 'professional':
        return { name: 'Professional', price: 79, features: ['Ilimitado', 'Suporte 24/7'] };
      default:
        return { name: 'Gratuito', price: 0, features: [] };
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  const currentPlan = getPlanInfo(subscriptionData?.plan || 'free');

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
      />

      <div className="lg:ml-80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-theme-primary mb-2">💳 Minha Assinatura</h1>
            <p className="text-theme-secondary">Visualize seu plano atual e informações da assinatura</p>
          </div>

          {/* Current Plan */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold text-theme-primary">Plano Atual</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-theme-primary">{currentPlan.name}</h3>
                  <p className="text-theme-secondary">
                    {currentPlan.price > 0 ? `R$ ${currentPlan.price},00/mês` : 'Gratuito'}
                  </p>
                  <div className="mt-2">
                    {currentPlan.features.map((feature, index) => (
                      <span key={index} className="inline-block bg-brand-primary-light text-brand-primary text-sm px-2 py-1 rounded mr-2 mb-1">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-theme-secondary">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    subscriptionData?.subscriptionStatus === 'active' 
                      ? 'bg-theme-success-light text-theme-success-dark' 
                      : 'bg-theme-button text-theme-muted'
                  }`}>
                    {subscriptionData?.subscriptionStatus === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Info */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold text-theme-primary">Informações da Assinatura</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-theme-secondary p-4 rounded-lg border border-theme-primary shadow-theme-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-theme-primary">{formatDate(subscriptionData?.planUpdatedAt)}</p>
                      <p className="text-sm text-theme-secondary">Data de Atualização</p>
                    </div>
                  </div>
                </div>
                <div className="bg-theme-secondary p-4 rounded-lg border border-theme-primary shadow-theme-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize text-theme-primary">{subscriptionData?.plan || 'free'}</p>
                      <p className="text-sm text-theme-secondary">Plano Atual</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>



          {/* Upgrade CTA Section */}
          {subscriptionData?.plan !== 'professional' && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold text-theme-primary">🚀 Desbloqueie Mais Recursos</h2>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-brand-primary-light to-brand-secondary-light rounded-lg p-6">
                  <div className="text-center mb-6">
                                         <h3 className="text-2xl font-bold text-theme-primary mb-2">
                       {subscriptionData?.plan === 'free' 
                         ? 'Transforme seu negócio com o Plano Starter' 
                         : 'Leve seu negócio ao próximo nível com o Plano Professional'
                       }
                     </h3>
                     <p className="text-theme-secondary text-lg">
                       {subscriptionData?.plan === 'free' 
                         ? 'Aproveite recursos avançados que vão revolucionar sua experiência com feedbacks'
                         : 'Tenha acesso ilimitado a todas as funcionalidades e suporte premium'
                       }
                     </p>
                  </div>

                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     {subscriptionData?.plan === 'free' ? (
                      <>
                        <div className="bg-theme-card p-4 rounded-lg border border-theme-primary shadow-theme-sm">
                          <h4 className="font-semibold text-theme-primary mb-3">✅ O que você ganha:</h4>
                          <ul className="space-y-2 text-sm text-theme-secondary">
                            <li>• 5 áreas de opiniões (vs. 2 atuais)</li>
                            <li>• 200 feedbacks/mês (vs. 50 atuais)</li>
                            <li>• QR Codes personalizados</li>
                            <li>• Agente IA básico</li>
                            <li>• Suporte prioritário</li>
                          </ul>
                        </div>
                        <div className="bg-theme-card p-4 rounded-lg border border-theme-primary shadow-theme-sm">
                          <h4 className="font-semibold text-theme-primary mb-3">💡 Benefícios:</h4>
                          <ul className="space-y-2 text-sm text-theme-secondary">
                            <li>• Crescimento 3x mais rápido</li>
                            <li>• Insights valiosos sobre clientes</li>
                            <li>• Melhor tomada de decisão</li>
                            <li>• ROI comprovado</li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-theme-card p-4 rounded-lg border border-theme-primary shadow-theme-sm">
                          <h4 className="font-semibold text-theme-primary mb-3">✅ O que você ganha:</h4>
                          <ul className="space-y-2 text-sm text-theme-secondary">
                            <li>• Áreas ilimitadas</li>
                            <li>• Feedback ilimitado</li>
                            <li>• Agente IA completo</li>
                            <li>• Suporte 24/7</li>
                            <li>• Integração com APIs</li>
                          </ul>
                        </div>
                        <div className="bg-theme-card p-4 rounded-lg border border-theme-primary shadow-theme-sm">
                          <h4 className="font-semibold text-theme-primary mb-3">💡 Benefícios:</h4>
                          <ul className="space-y-2 text-sm text-theme-secondary">
                            <li>• Escalabilidade total</li>
                            <li>• Automação avançada</li>
                            <li>• Relatórios personalizados</li>
                            <li>• Treinamento dedicado</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => {
                        if (subscriptionData?.plan === 'free') {
                          handleUpgrade('starter');
                        } else if (subscriptionData?.plan === 'starter') {
                          handleUpgrade('professional');
                        }
                      }}
                      className="bg-gradient-to-r from-brand-primary to-brand-secondary text-theme-inverse px-8 py-3 rounded-lg font-semibold hover:from-brand-primary-hover hover:to-brand-secondary-hover transition-all transform hover:scale-105"
                    >
                      {subscriptionData?.plan === 'free' 
                        ? 'Fazer Upgrade para Starter - R$ 29/mês' 
                        : 'Fazer Upgrade para Professional - R$ 79/mês'
                      }
                    </button>
                    <p className="text-xs text-theme-muted mt-2">
                      Teste gratuito de 30 dias • Sem compromisso • Cancele a qualquer momento
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Analytics & Upgrade Motivation */}
          {subscriptionData?.plan === 'free' && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold text-theme-primary">📊 Seu Uso Atual</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-theme-secondary">Áreas de opiniões</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-theme-button rounded-full h-2">
                        <div className="bg-brand-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <span className="text-sm text-theme-secondary">2/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-theme-secondary">Feedbacks este mês</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-theme-button rounded-full h-2">
                        <div className="bg-theme-warning h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-sm text-theme-secondary">30/50</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-theme-warning-light border border-theme-warning rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-theme-warning mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-theme-warning-dark">
                        <strong>Dica:</strong> Você está usando 60% da sua cota de feedbacks. Faça upgrade para não perder insights valiosos!
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Proof for Upgrade */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold text-theme-primary">💬 O que nossos clientes dizem</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      M
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Maria Silva</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Restaurante Sabor & Arte</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    "O upgrade para Professional transformou nosso atendimento. Agora temos insights valiosos sobre nossos clientes."
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      J
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">João Santos</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Farmácia Popular</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    "Com o plano Starter, conseguimos expandir para 5 áreas e melhorar significativamente nosso serviço."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Info - Simplified */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Precisa cancelar sua assinatura?
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                Envie um email para{' '}
                <a href="mailto:suporte@pesquisou.com.br" className="text-blue-600 dark:text-blue-400 hover:underline">
                  suporte@pesquisou.com.br
                </a>{' '}
                com o assunto &quot;Cancelamento de Assinatura&quot;
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Inclua seu nome, email da conta e data desejada para o cancelamento
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}