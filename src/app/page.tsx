'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



export default function HomePage() {
  const router = useRouter();

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
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo e Nome */}
            <div className="flex items-center space-x-3">
              <img 
                src="/logo-klientti.svg" 
                alt="Klientti" 
                className="h-8 lg:h-10 w-auto"
              />
            </div>
            

            
            {/* CTAs */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Link 
                href="/login" 
                className="text-blue-600 hover:text-blue-700 px-3 py-2 lg:px-4 lg:py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-50"
              >
                Entrar
              </Link>
              <Link 
                href="/planos" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg text-sm lg:text-base font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{ color: 'white !important' }}
              >
                Começar Grátis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Opção 1 Transformacional */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6" style={{ color: 'white !important' }}>
              Transforme 
              <span className="text-white" style={{ color: 'white !important' }}> feedback</span>
              <br />
              em crescimento real
            </h1>
            <p className="text-xl text-white mb-8 leading-relaxed" style={{ color: 'white !important' }}>
              Pare de adivinhar. Com QR codes inteligentes e links de pesquisa, você entende seus clientes em tempo real, 
              melhora seus produtos e cria experiências que fidelizam.
            </p>
            <div className="flex justify-center items-center">
              <Link 
                href="/planos" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                style={{ color: 'white !important' }}
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
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

      {/* Social Proof - Opção 2 Depoimento humanizado */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ color: 'white !important' }}>
            Está pronto para ouvir seus clientes e crescer de verdade?
          </h2>
          <p className="text-xl text-white mb-8" style={{ color: 'white !important' }}>
            Junte-se a centenas de empresas que já estão transformando feedback em resultado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/planos" 
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-colors shadow-lg"
            >
              👉 Começar grátis agora
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-white hover:text-blue-600 transition-colors shadow-lg hover:shadow-xl">
              ☎️ Falar com vendas
            </button>
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
