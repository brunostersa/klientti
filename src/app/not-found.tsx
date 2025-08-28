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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <span className="text-3xl font-bold text-slate-900">Klientti</span>
          </Link>
        </div>

        {/* 404 Content */}
        <div className="mb-12">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Página não encontrada
          </h2>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Ops! Parece que você se perdeu no caminho. A página que você está procurando 
            não existe ou foi movida para outro lugar.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            href="/"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            🏠 Voltar para o início
          </Link>
          <Link 
            href="/planos"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            💡 Ver planos
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            Páginas populares que podem te ajudar:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="mt-12 text-slate-600">
          <p className="mb-2">
            Precisa de ajuda? Entre em contato conosco:
          </p>
          <p className="font-medium">
            📧 suporte@klientti.com
          </p>
        </div>
      </div>
    </div>
  );
}
