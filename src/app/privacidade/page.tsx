'use client';

import Link from 'next/link';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/logo-klientti.svg" 
                alt="Klientti" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-slate-900">Klientti</span>
            </Link>
            
            <Link 
              href="/" 
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">
            Política de Privacidade
          </h1>
          
          <p className="text-lg text-slate-600 mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                1. Informações que Coletamos
              </h2>
              <p className="text-slate-600 mb-4">
                Coletamos informações que você nos fornece diretamente, incluindo:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Nome e informações de contato</li>
                <li>Endereço de e-mail</li>
                <li>Informações da empresa</li>
                <li>Dados de feedback coletados através de nossos QR codes e links</li>
                <li>Informações de uso da plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                2. Como Usamos suas Informações
              </h2>
              <p className="text-slate-600 mb-4">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar e analisar feedback de clientes</li>
                <li>Comunicar-nos com você sobre o serviço</li>
                <li>Enviar atualizações e notificações importantes</li>
                <li>Garantir a segurança da plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                3. Compartilhamento de Informações
              </h2>
              <p className="text-slate-600 mb-4">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Com seu consentimento explícito</li>
                <li>Para cumprir obrigações legais</li>
                <li>Com prestadores de serviços que nos auxiliam na operação da plataforma</li>
                <li>Em caso de fusão, aquisição ou venda de ativos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                4. Segurança dos Dados
              </h2>
              <p className="text-slate-600 mb-4">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backup regular dos dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                5. Seus Direitos
              </h2>
              <p className="text-slate-600 mb-4">
                Você tem o direito de:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados incorretos ou incompletos</li>
                <li>Solicitar a exclusão de suas informações</li>
                <li>Retirar seu consentimento a qualquer momento</li>
                <li>Receber uma cópia dos seus dados em formato portável</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                6. Cookies e Tecnologias Similares
              </h2>
              <p className="text-slate-600 mb-4">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma e personalizar conteúdo. Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                7. Retenção de Dados
              </h2>
              <p className="text-slate-600 mb-4">
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                8. Alterações nesta Política
              </h2>
              <p className="text-slate-600 mb-4">
                Podemos atualizar esta política de privacidade periodicamente. Notificaremos você sobre mudanças significativas através do e-mail registrado ou através de um aviso em nossa plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                9. Contato
              </h2>
              <p className="text-slate-600 mb-4">
                Se você tiver dúvidas sobre esta política de privacidade ou sobre como tratamos suas informações pessoais, entre em contato conosco:
              </p>
              <div className="bg-slate-50 p-6 rounded-lg">
                <p className="text-slate-600">
                  <strong>E-mail:</strong> privacidade@klientti.com<br />
                  <strong>Endereço:</strong> [Endereço da empresa]<br />
                  <strong>Telefone:</strong> [Telefone de contato]
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500">
            © Klientti. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
