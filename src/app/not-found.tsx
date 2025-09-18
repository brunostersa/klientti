import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página não encontrada | Klientti',
  description: 'A página que você está procurando não foi encontrada. Volte para o Klientti e descubra como transformar feedback em crescimento real.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-12 mt-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <img 
              src="/logo-klientti.svg" 
              alt="Klientti" 
              className="h-12 w-auto sm:h-16"
            />
          </Link>
        </div>

        {/* 404 Content */}
        <div className="mb-12">
          <div className="text-6xl sm:text-8xl lg:text-9xl font-bold text-blue-600 mb-6" style={{ color: 'white !important' }}>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">404</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
            Ops! Página não encontrada
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed px-4">
            Parece que você se perdeu no caminho para transformar feedback em crescimento real. 
            Mas não se preocupe, vamos te ajudar a encontrar o que precisa!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-4">
          <Link 
            href="/"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            style={{ color: 'white !important' }}
          >
            🏠 Voltar para o início
          </Link>
          <Link 
            href="/planos"
            className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            💡 Ver planos e preços
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mx-4">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">
            Páginas populares que podem te ajudar:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/login"
              className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
            >
              <div className="font-medium text-slate-900 mb-1">🔐 Login</div>
              <div className="text-sm text-slate-600">Acesse sua conta</div>
            </Link>
            <Link 
              href="/dashboard"
              className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
            >
              <div className="font-medium text-slate-900 mb-1">📊 Dashboard</div>
              <div className="text-sm text-slate-600">Painel de controle</div>
            </Link>
            <Link 
              href="/areas"
              className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
            >
              <div className="font-medium text-slate-900 mb-1">🏢 Áreas</div>
              <div className="text-sm text-slate-600">Gerencie suas áreas</div>
            </Link>
            <Link 
              href="/feedbacks"
              className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
            >
              <div className="font-medium text-slate-900 mb-1">💬 Feedbacks</div>
              <div className="text-sm text-slate-600">Veja as opiniões</div>
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-slate-600 px-4">
          <p className="mb-2 text-sm sm:text-base">
            Precisa de ajuda? Entre em contato conosco:
          </p>
          <p className="font-medium text-sm sm:text-base">
            📧 suporte@klientti.com
          </p>
        </div>
      </div>
    </div>
  );
}
