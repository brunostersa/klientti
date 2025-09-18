'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



export default function HomePage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Garantir que a hidratação foi concluída
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Controlar scroll do header
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
      // Fechar menu mobile ao rolar
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Função para scroll suave
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Verificar se o usuário tem perfil completo antes de redirecionar
        const checkUserProfile = async () => {
          try {
            const { doc, getDoc } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase');
            
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              // Validação dos campos obrigatórios principais
              if (userData.name && userData.company && userData.segment) {
                console.log('Perfil completo detectado, redirecionando para dashboard');
                // Perfil completo, redirecionar para dashboard
                router.push('/dashboard');
              } else {
                console.log('Perfil incompleto detectado, redirecionando para login');
                // Perfil incompleto, redirecionar para login para completar
                router.push('/login');
              }
            } else {
              console.log('Usuário novo detectado, redirecionando para login');
              // Usuário novo, redirecionar para login para completar perfil
              router.push('/login');
            }
          } catch (error) {
            console.error('Erro ao verificar perfil:', error);
            // Em caso de erro, redirecionar para login
            router.push('/login');
          }
        };
        
        // Adicionar delay para garantir que o login seja processado primeiro
        setTimeout(() => {
          checkUserProfile();
        }, 1000);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <style jsx global>{`
        .hero-text {
          color: white !important;
        }
        .hero-text * {
          color: white !important;
        }
        .btn-white {
          color: white !important;
        }
        .btn-white * {
          color: white !important;
        }
        a.btn-white {
          color: white !important;
        }
        a.btn-white:hover {
          color: white !important;
        }
        /* Forçar cores brancas no hero */
        .hero-section h1,
        .hero-section h1 *,
        .hero-section p,
        .hero-section p * {
          color: white !important;
        }
        /* Forçar cores brancas no header quando não está scrolled */
        .header-transparent a,
        .header-transparent button,
        .header-transparent svg {
          color: white !important;
        }
        .header-transparent a:hover,
        .header-transparent button:hover {
          color: rgba(255, 255, 255, 0.8) !important;
        }
      `}</style>
      {/* Modern Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50' 
          : 'bg-transparent header-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <img 
                    src={isScrolled ? "/logo-klientti.svg" : "/logo-klientti-dark.svg"} 
                    alt="Klientti" 
                    className="h-8 lg:h-10 w-auto transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>


            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className={`font-medium transition-colors duration-200 hover:scale-105 ${
                  isScrolled 
                    ? 'text-slate-600 hover:text-slate-900' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Funcionalidades
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className={`font-medium transition-colors duration-200 hover:scale-105 ${
                  isScrolled 
                    ? 'text-slate-600 hover:text-slate-900' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Preços
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className={`font-medium transition-colors duration-200 hover:scale-105 ${
                  isScrolled 
                    ? 'text-slate-600 hover:text-slate-900' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Depoimentos
              </button>
            </div>
            
            {/* CTAs - Desktop Only */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Link 
                href="/login" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2 ${
                  isScrolled 
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                    : 'text-white hover:text-white/80 hover:bg-white/10'
                }`}
                style={{
                  color: isScrolled ? undefined : 'white'
                }}
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{
                    color: isScrolled ? undefined : 'white'
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span style={{ color: isScrolled ? undefined : 'white' }}>Entrar</span>
              </Link>
              <Link 
                href="/planos" 
                className="btn-white bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
                style={{ color: 'white' }}
              >
                Começar Grátis
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isScrolled 
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                    : 'text-white hover:text-white/80 hover:bg-white/10'
                }`}
                aria-label="Abrir menu"
              >
                <svg 
                  className={`w-6 h-6 transition-transform duration-200 ${
                    isMobileMenuOpen ? 'rotate-90' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="fixed top-16 left-0 right-0 z-50 md:hidden animate-in slide-in-from-top-2 duration-300">
            <div className={`mx-4 rounded-2xl shadow-2xl border transition-all duration-300 ${
              isScrolled 
                ? 'bg-white border-slate-200' 
                : 'bg-white/95 backdrop-blur-xl border-white/20'
            }`}>
              {/* Navigation Links */}
              <div className="px-6 py-4 border-b border-slate-100">
                <nav className="space-y-1">
                  <button 
                    onClick={() => {
                      scrollToSection('features');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors duration-200"
                  >
                    Funcionalidades
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection('pricing');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors duration-200"
                  >
                    Preços
                  </button>
                  <button 
                    onClick={() => {
                      scrollToSection('testimonials');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors duration-200"
                  >
                    Depoimentos
                  </button>
                </nav>
              </div>
              
              {/* Action Buttons */}
              <div className="px-6 py-4 space-y-3">
                <Link 
                  href="/login" 
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium transition-all duration-200 border border-slate-200 hover:border-slate-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Entrar</span>
                </Link>
                
                <Link 
                  href="/planos" 
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ color: 'white' }}
                >
                  <span style={{ color: 'white' }}>Começar Grátis</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hero Section - Opção 1 Transformacional */}
      <section className="hero-section pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="hero-text text-5xl md:text-6xl font-bold leading-tight mb-6">
              Transforme 
              <span> feedback</span>
              <br />
              em crescimento real
            </h1>
            <p className="hero-text text-xl mb-8 leading-relaxed">
              Pare de adivinhar. Com QR codes inteligentes e links de pesquisa, você entende seus clientes em tempo real, 
              melhora seus produtos e cria experiências que fidelizam.
            </p>
            <div className="flex justify-center items-center">
              <Link 
                href="/planos" 
                className="btn-white bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                👉 Comece grátis
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-300/20 rounded-full blur-lg"></div>
      </section>

      {/* Problem Section - Versão 2 Storytelling */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              🚨 Problema que resolvemos
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Você já sabe que seus clientes têm muito a dizer.<br />
              O problema é que:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⏳</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">As pesquisas chegam atrasadas</h3>
                  <p className="text-slate-600">Pesquisas tradicionais demoram semanas e custam milhares</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Os dados não refletem a realidade</h3>
                  <p className="text-slate-600">Respostas enviesadas e amostras não representativas</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🐌</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">E quando você descobre o problema...</h3>
                  <p className="text-slate-600">Já perdeu a oportunidade de agir</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border-2 border-blue-100 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                ✅ Nossa solução
              </h3>
              <p className="text-slate-700 mb-6 text-center">
                Capturar feedback nunca foi tão fácil. Use QR codes impressos ou envie links por email/SMS.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700">QR codes impressos e links de pesquisa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700">Feedback anônimo e honesto</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700">Análises em tempo real com IA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-700">Insights integrados com sua equipe</span>
                </div>
              </div>
              <p className="text-slate-700 mt-6 text-center text-sm">
                Tudo em uma única plataforma simples e poderosa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Tudo que você precisa para crescer
            </h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Basta um QR code impresso ou link de pesquisa, e seus clientes falam com você em segundos.
                  O Klientti analisa, organiza e mostra exatamente onde você pode melhorar — sem complicação.
                </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">QR Codes e Links Inteligentes</h3>
              <p className="text-slate-600">Crie QR codes impressos e links de pesquisa personalizados para cada área da sua empresa em segundos</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">IA que Analisa</h3>
              <p className="text-slate-600">Nossa inteligência artificial traduz feedback em insights claros e acionáveis</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Tempo Real</h3>
              <p className="text-slate-600">Receba notificações instantâneas e tome decisões mais rápidas e certeiras</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Escolha seu plano ideal
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comece grátis por 7 dias. Sem compromisso. Cancele quando quiser.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  R$ 179,90
                  <span className="text-lg text-slate-500 font-normal">/mês</span>
                </div>
                <p className="text-slate-600">Perfeito para começar</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">3 áreas de pesquisa</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">100 feedbacks/mês</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">QR codes ilimitados</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">Análise com IA</span>
                </li>
              </ul>
              
              <Link 
                href="/planos" 
                className="btn-white w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all text-center block"
              >
                Começar Teste Grátis
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-blue-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Mais Popular
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  R$ 249,90
                  <span className="text-lg text-slate-500 font-normal">/mês</span>
                </div>
                <p className="text-slate-600">Para empresas em crescimento</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">10 áreas de pesquisa</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">500 feedbacks/mês</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">QR codes ilimitados</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">Análise com IA avançada</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">👥 Grupo Premium Evolution</span>
                </li>
              </ul>
              
              <Link 
                href="/planos" 
                className="btn-white w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all text-center block"
              >
                Começar Teste Grátis
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  R$ 479,90
                  <span className="text-lg text-slate-500 font-normal">/mês</span>
                </div>
                <p className="text-slate-600">Para empresas grandes</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">Áreas ilimitadas</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">Feedbacks ilimitados</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">QR codes ilimitados</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">IA + Analytics avançados</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">👥 Grupo Premium Evolution</span>
                </li>
              </ul>
              
              <Link 
                href="/planos" 
                className="btn-white w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all text-center block"
              >
                Começar Teste Grátis
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-slate-600">
              Todos os planos incluem 7 dias grátis • Sem compromisso • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof - Opção 2 Depoimento humanizado */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16">
            📈 Empresas que confiam no Klientti
          </h2>
          
          <div className="bg-slate-50 p-8 rounded-2xl max-w-4xl mx-auto">
            <p className="text-lg text-slate-700 mb-6 italic leading-relaxed">
              "O Klientti mudou a forma como ouvimos nossos clientes. Em 30 dias, resolvemos 3 problemas críticos 
              que estavam escondidos."
            </p>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">M</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-900">Maria Silva</div>
                <div className="text-slate-600 text-sm">CEO da TechStart</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Opção 1 Forte */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="hero-text text-3xl md:text-4xl font-bold mb-6">
            Está pronto para ouvir seus clientes e crescer de verdade?
          </h2>
          <p className="hero-text text-xl mb-8">
            Junte-se a centenas de empresas que já estão transformando feedback em resultado.
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/planos" 
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-colors shadow-lg"
            >
              👉 Ver Planos e Preços
            </Link>
            <Link 
              href="/planos" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-white hover:text-blue-600 transition-colors shadow-lg hover:shadow-xl"
            >
              🚀 Começar Teste Grátis
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img 
                src="/logo-klientti.svg" 
                alt="Klientti" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Transformando feedback em crescimento através de QR codes impressos e links de pesquisa para empresas de todos os tamanhos.
            </p>
          </div>
          
          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-slate-500">
            <p>&copy; Klientti. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
