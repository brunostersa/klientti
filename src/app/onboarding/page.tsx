'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardContent } from '@/components/Card';

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: "Bem-vindo à Klientti",
    description: "A plataforma completa para coleta e análise de feedbacks dos seus clientes",
    features: [
      "Coleta inteligente de feedbacks",
      "Análise em tempo real",
      "Relatórios detalhados",
      "Integração com WhatsApp"
    ],
    icon: "🎯",
    color: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    title: "Áreas de Pesquisa",
    description: "Organize seus feedbacks por diferentes áreas do seu negócio",
    features: [
      "Crie até 3 áreas (Starter)",
      "Até 10 áreas (Premium)",
      "Ilimitado (Pro)",
      "QR Codes personalizados"
    ],
    icon: "📊",
    color: "from-green-500 to-teal-600"
  },
  {
    id: 3,
    title: "Análise Inteligente",
    description: "IA avançada para extrair insights valiosos dos seus feedbacks",
    features: [
      "Análise de sentimentos",
      "Identificação de tendências",
      "Relatórios automáticos",
      "Métricas de satisfação"
    ],
    icon: "🤖",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 4,
    title: "Grupo Premium",
    description: "Acesso exclusivo à comunidade de empreendedores",
    features: [
      "Networking exclusivo",
      "Estratégias avançadas",
      "Suporte prioritário",
      "Conteúdo exclusivo"
    ],
    icon: "👥",
    color: "from-orange-500 to-red-600"
  }
];

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [isFromStripe, setIsFromStripe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar se está vindo do Stripe
    const urlParams = new URLSearchParams(window.location.search);
    const hasStripeParams = urlParams.has('session_id') || urlParams.has('payment_intent');
    setIsFromStripe(hasStripeParams);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        checkUserProfile(user.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const checkUserProfile = async (userId: string) => {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists()) {
        const profileData = userSnap.data();
        const plan = profileData.plan || '';
        const subscriptionStatus = profileData.subscriptionStatus || '';
        
        // Só redirecionar para dashboard se não estiver vindo do Stripe
        // Se estiver vindo do Stripe, permitir continuar no onboarding
        if (plan && (subscriptionStatus === 'trialing' || subscriptionStatus === 'active') && !isFromStripe) {
          router.push('/dashboard');
          return;
        }
      }
    } catch (error) {
      console.error('Erro ao verificar perfil:', error);
    }
  };

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleStart = async () => {
    setIsStarting(true);
    try {
      console.log('Iniciando checkout...');
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'starter', // Começar com o plano Starter
          userId: user?.uid,
          userEmail: user?.email,
          successUrl: `${window.location.origin}/payment/success?onboarding=success`,
          cancelUrl: `${window.location.origin}/onboarding`,
        }),
      });

      console.log('Resposta da API:', response.status);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dados retornados:', data);
      
      if (data.url) {
        console.log('Redirecionando para:', data.url);
        window.location.href = data.url;
      } else {
        console.error('URL de checkout não retornada:', data);
        setIsStarting(false);
      }
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      setIsStarting(false);
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

  const currentSlideData = onboardingSlides[currentSlide];
  const isLastSlide = currentSlide === onboardingSlides.length - 1;

  return (
    <div className="min-h-screen bg-theme-primary">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="/logo-klientti.svg" alt="Klientti" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-theme-primary">Klientti</span>
            </div>
            <div className="text-sm text-theme-secondary">
              {currentSlide + 1} de {onboardingSlides.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 h-1">
        <div 
          className="bg-brand-primary h-1 transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / onboardingSlides.length) * 100}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">{currentSlideData.icon}</div>
          <h1 className="text-4xl font-bold text-theme-primary mb-4">
            {currentSlideData.title}
          </h1>
          <p className="text-xl text-theme-secondary max-w-2xl mx-auto">
            {currentSlideData.description}
          </p>
        </div>

        {/* Features */}
        <Card className="mb-8">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSlideData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  </div>
                  <span className="text-theme-primary font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {onboardingSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-brand-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentSlide === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-theme-primary hover:bg-gray-300'
            }`}
          >
            Anterior
          </button>

          {isLastSlide ? (
            <button
              onClick={isFromStripe ? () => router.push('/dashboard') : handleStart}
              disabled={isStarting}
              className="bg-brand-primary hover:bg-brand-primary-hover text-theme-inverse px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStarting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Iniciando...</span>
                </div>
              ) : isFromStripe ? (
                '🚀 Ir para o Dashboard'
              ) : (
                'Começar Agora - R$ 179,90/mês'
              )}
            </button>
          ) : (
            <button
              onClick={nextSlide}
              className="bg-brand-primary hover:bg-brand-primary-hover text-theme-inverse px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Próximo
            </button>
          )}
        </div>

        {/* Trial Info */}
        {isLastSlide && (
          <div className="text-center mt-8">
            {isFromStripe ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                <p className="font-semibold">✅ Pagamento Processado com Sucesso!</p>
                <p className="text-sm">Seu plano foi ativado. Agora você pode começar a usar todas as funcionalidades.</p>
              </div>
            ) : (
              <>
                <p className="text-theme-secondary text-sm">
                  🎁 <strong>7 dias grátis</strong> para testar todas as funcionalidades
                </p>
                <p className="text-theme-muted text-xs mt-1">
                  Cancele a qualquer momento durante o período de teste
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
