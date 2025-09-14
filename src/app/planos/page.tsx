'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardContent, CardAction } from '@/components/Card';
import Sidebar from '@/components/Sidebar';
// import { loadStripe } from '@stripe/stripe-js';
import { useActiveTab } from '@/hooks/useActiveTab';


interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary' | 'outline';
  upgradeFrom?: string;
}

export default function UpgradePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [currentPlan, setCurrentPlan] = useState<string>('free');

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
        setCurrentPlan(data.plan || 'free');
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

      // Redirecionar para Stripe Checkout usando script dinâmico
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = async () => {
        const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        const { error } = await stripe.redirectToCheckout({ sessionId });
        
        if (error) {
          console.error('Erro ao redirecionar para checkout:', error);
          alert('Erro ao redirecionar para checkout. Tente novamente.');
        }
      };
      document.head.appendChild(script);

    } catch (error) {
      console.error('Erro ao fazer upgrade:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`Erro ao fazer upgrade: ${errorMessage}. Tente novamente.`);
    }
  };

  const getCurrentPlanInfo = (plan: string) => {
    switch (plan) {
      case 'free':
        return { 
          name: 'Gratuito', 
          price: 0, 
          features: ['2 áreas', '50 feedbacks/mês'],
          limitations: ['QR Codes básicos', 'Painel simples', 'Suporte por email']
        };
      case 'starter':
        return { 
          name: 'Starter', 
          price: 29, 
          features: ['5 áreas', '200 feedbacks/mês'],
          limitations: ['Sem IA avançada', 'Sem exportação', 'Suporte limitado']
        };
      case 'professional':
        return { 
          name: 'Professional', 
          price: 79, 
          features: ['Ilimitado', 'Suporte 24/7'],
          limitations: []
        };
      default:
        return { 
          name: 'Gratuito', 
          price: 0, 
          features: ['2 áreas', '50 feedbacks/mês'],
          limitations: ['QR Codes básicos', 'Painel simples', 'Suporte por email']
        };
    }
  };

  const getUpgradeMessage = (currentPlan: string) => {
    switch (currentPlan) {
      case 'free':
        return {
          title: '🚀 Desbloqueie todo o potencial do Klientti',
          subtitle: 'Você está usando apenas 20% das funcionalidades disponíveis',
          cta: 'Faça upgrade agora e transforme seu negócio'
        };
      case 'starter':
        return {
          title: '⚡ Leve seu negócio ao próximo nível',
          subtitle: 'Aproveite recursos avançados para crescer ainda mais',
          cta: 'Upgrade para Professional e tenha tudo ilimitado'
        };
      case 'professional':
        return {
          title: '🎯 Você já tem o melhor plano!',
          subtitle: 'Aproveite ao máximo todas as funcionalidades',
          cta: 'Conheça nossos serviços adicionais'
        };
      default:
        return {
          title: '🚀 Desbloqueie todo o potencial do Klientti',
          subtitle: 'Você está usando apenas 20% das funcionalidades disponíveis',
          cta: 'Faça upgrade agora e transforme seu negócio'
        };
    }
  };

  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingPeriod === 'monthly' ? 29 : 290,
      period: billingPeriod,
      description: 'Ideal para pequenos negócios em crescimento',
      features: [
        '✅ Até 5 áreas de opiniões',
        '✅ Máximo 200 feedbacks/mês',
        '✅ QR Codes personalizados',
        '✅ Meu Painel completo',
        '✅ Gráficos de evolução',
        '✅ Agente IA básico',
        '✅ Suporte prioritário',
        '✅ Base de conhecimento completa'
      ],
      popular: currentPlan === 'free',
      buttonText: currentPlan === 'free' ? 'Fazer Upgrade para Starter' : 'Mudar para Starter',
      buttonVariant: 'primary',
      upgradeFrom: 'free'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingPeriod === 'monthly' ? 79 : 790,
      period: billingPeriod,
      description: 'Para empresas que querem dominar o mercado',
      features: [
        '🚀 Áreas ilimitadas',
        '🚀 Opiniões ilimitadas',
        '🚀 QR Codes premium',
        '🚀 Meu Painel avançado',
        '🚀 Agente IA completo',
        '🚀 Análises detalhadas',
        '🚀 Exportação de dados',
        '🚀 Suporte 24/7',
        '🚀 Treinamento personalizado',
        '🚀 Integração com APIs'
      ],
      popular: currentPlan === 'free' || currentPlan === 'starter',
      buttonText: currentPlan === 'professional' ? 'Plano Atual' : 'Fazer Upgrade para Professional',
      buttonVariant: currentPlan === 'professional' ? 'outline' : 'secondary',
      upgradeFrom: currentPlan === 'professional' ? undefined : 'starter'
    }
  ];

  const currentPlanInfo = getCurrentPlanInfo(currentPlan);
  const upgradeMessage = getUpgradeMessage(currentPlan);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-primary-light text-brand-primary text-sm font-medium mb-6">
              <span className="mr-2">🎯</span>
              Plano Atual: {currentPlanInfo.name}
            </div>
            
            <h1 className="text-4xl font-bold text-theme-primary mb-4">
              Escolha o Plano Ideal para Sua Empresa
            </h1>
            
            <p className="text-xl text-theme-secondary mb-6 max-w-3xl mx-auto">
              {upgradeMessage.subtitle}
            </p>
            
            <p className="text-lg text-brand-primary font-medium">
              {upgradeMessage.cta}
            </p>
          </div>

          {/* Current Plan vs Upgrade Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Current Plan */}
            <div className="relative p-6 bg-theme-secondary rounded-lg border-2 border-theme-primary shadow-theme-sm">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-theme-button text-theme-button-hover text-sm font-medium mb-4">
                  Seu Plano Atual
                </div>
                <h3 className="text-2xl font-bold text-theme-primary mb-2">{currentPlanInfo.name}</h3>
                <div className="text-4xl font-bold text-theme-primary mb-2">
                  {currentPlanInfo.price > 0 ? `R$ ${currentPlanInfo.price}` : 'R$ 0'}
                  <span className="text-lg font-normal text-theme-secondary">/mês</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-theme-primary mb-3">✅ O que você tem:</h4>
                {currentPlanInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-theme-primary">
                    <svg className="w-4 h-4 text-theme-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </div>

              {currentPlanInfo.limitations.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-theme-primary mb-3">❌ Limitações:</h4>
                  {currentPlanInfo.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-center text-sm text-theme-muted">
                      <svg className="w-4 h-4 text-theme-error mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      {limitation}
                    </li>
                  ))}
                </div>
              )}
            </div>

            {/* Upgrade Plans */}
            {plans.map((plan) => (
              <div key={plan.id} className={`relative p-6 rounded-lg shadow-theme-lg border-2 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-brand-primary-light to-brand-secondary-light border-brand-primary' 
                  : 'bg-theme-card border-theme-primary'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-brand-primary to-brand-secondary text-theme-inverse px-4 py-1 rounded-full text-sm font-medium">
                      ⭐ Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-theme-primary mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-theme-primary mb-2">
                    R$ {plan.price}
                    <span className="text-lg font-normal text-theme-secondary">
                      /{billingPeriod === 'monthly' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <div className="text-sm text-theme-success font-medium">
                      💰 Economia de R$ 58/ano
                    </div>
                  )}
                  <p className="text-theme-secondary">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-theme-primary">
                      <span className="mr-2 mt-0.5">{feature.startsWith('✅') ? '✅' : '🚀'}</span>
                      <span>{feature.replace('✅ ', '').replace('🚀 ', '')}</span>
                    </li>
                  ))}
                </ul>

                {plan.id === currentPlan ? (
                  <button
                    disabled
                    className="w-full py-3 px-6 rounded-lg font-medium bg-theme-button text-theme-muted cursor-not-allowed"
                  >
                    {plan.buttonText}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id as 'starter' | 'professional')}
                    className="w-full py-3 px-6 rounded-lg font-medium bg-brand-primary hover:bg-brand-primary-hover text-theme-inverse transition-colors"
                  >
                    {plan.buttonText}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Billing Toggle */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-4 p-2 bg-theme-button rounded-lg">
              <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-brand-primary' : 'text-theme-secondary'}`}>
                Mensal
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingPeriod === 'yearly' ? 'bg-brand-primary' : 'bg-theme-border-primary'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-theme-inverse transition-transform ${
                    billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-brand-primary' : 'text-theme-secondary'}`}>
                Anual
                <span className="ml-1 bg-theme-success-light text-theme-success-dark text-xs px-2 py-1 rounded-full">
                  -17%
                </span>
              </span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-gradient-to-r from-brand-primary-light to-brand-secondary-light rounded-2xl p-8 mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-theme-primary mb-4">
                💬 O que nossos clientes dizem
              </h3>
              <p className="text-theme-secondary">
                Junte-se a centenas de empresas que já transformaram seus negócios
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-theme p-6 rounded-lg shadow-theme-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    M
                  </div>
                  <div>
                    <p className="font-semibold text-theme-primary">Maria Silva</p>
                    <p className="text-sm text-theme-secondary">Restaurante Sabor & Arte</p>
                  </div>
                </div>
                <p className="text-theme-secondary text-sm">
                  "O upgrade para Professional transformou nosso atendimento. Agora temos insights valiosos sobre nossos clientes."
                </p>
              </div>

              <div className="card-theme p-6 rounded-lg shadow-theme-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    J
                  </div>
                  <div>
                    <p className="font-semibold text-theme-primary">João Santos</p>
                    <p className="text-sm text-theme-secondary">Farmácia Popular</p>
                  </div>
                </div>
                <p className="text-theme-secondary text-sm">
                  "Com o plano Starter, conseguimos expandir para 5 áreas e melhorar significativamente nosso serviço."
                </p>
              </div>

              <div className="card-theme p-6 rounded-lg shadow-theme-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-theme-primary">Ana Costa</p>
                    <p className="text-sm text-theme-secondary">Clínica Saúde Total</p>
                  </div>
                </div>
                <p className="text-theme-secondary text-sm">
                  "O Agente IA nos ajuda a analisar feedbacks em tempo real. É como ter um consultor 24/7."
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-theme-primary text-center mb-8">
              ❓ Perguntas Frequentes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="card-theme p-4 rounded-lg">
                  <h4 className="font-semibold text-theme-primary mb-2">
                    Posso mudar de plano a qualquer momento?
                  </h4>
                  <p className="text-theme-secondary text-sm">
                    Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente.
                  </p>
                </div>
                <div className="card-theme p-4 rounded-lg">
                  <h4 className="font-semibold text-theme-primary mb-2">
                    Há limite de usuários?
                  </h4>
                  <p className="text-theme-secondary text-sm">
                    O plano gratuito permite 1 usuário. Os planos pagos incluem múltiplos usuários e permissões avançadas.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="card-theme p-4 rounded-lg">
                  <h4 className="font-semibold text-theme-primary mb-2">
                    Os dados são seguros?
                  </h4>
                  <p className="text-theme-secondary text-sm">
                    Sim! Utilizamos criptografia de ponta a ponta, backups automáticos e seguimos todas as normas de segurança.
                  </p>
                </div>
                <div className="card-theme p-4 rounded-lg">
                  <h4 className="font-semibold text-theme-primary mb-2">
                    Oferecem reembolso?
                  </h4>
                  <p className="text-theme-secondary text-sm">
                    Oferecemos 30 dias de garantia incondicional. Se não gostar, devolvemos 100% do seu dinheiro.
                  </p>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
} 