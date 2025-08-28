import { Metadata } from 'next';

// Configuração base de SEO para o Klientti
export const baseMetadata: Metadata = {
  metadataBase: new URL('https://klientti.com'),
  title: {
    default: 'Klientti - Transforme Feedback em Crescimento Real',
    template: '%s | Klientti'
  },
  description: 'Sistema inteligente de feedback com QR codes e links de pesquisa. Entenda seus clientes em tempo real, melhore seus produtos e crie experiências que fidelizam.',
  keywords: [
    'feedback cliente',
    'qr code pesquisa',
    'satisfação cliente',
    'pesquisa de mercado',
    'gestão de qualidade',
    'melhoria contínua',
    'experiência do cliente',
    'análise de feedback',
    'sistema de pesquisa',
    'klientti',
    'gestão empresarial',
    'inovação empresarial'
  ],
  authors: [{ name: 'Klientti', url: 'https://klientti.com' }],
  creator: 'Klientti',
  publisher: 'Klientti',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://klientti.com',
    title: 'Klientti - Transforme Feedback em Crescimento Real',
    description: 'Sistema inteligente de feedback com QR codes e links de pesquisa. Entenda seus clientes em tempo real.',
    siteName: 'Klientti',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Klientti - Sistema de Feedback Inteligente',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Klientti - Transforme Feedback em Crescimento Real',
    description: 'Sistema inteligente de feedback com QR codes e links de pesquisa.',
    images: ['/og-image.png'],
    creator: '@klientti',
    site: '@klientti',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Metadados para páginas específicas
export const pageMetadata = {
  home: {
    title: 'Klientti - Transforme Feedback em Crescimento Real',
    description: 'Sistema inteligente de feedback com QR codes e links de pesquisa. Entenda seus clientes em tempo real, melhore seus produtos e crie experiências que fidelizam. Comece grátis por 14 dias.',
    keywords: [
      'feedback cliente',
      'qr code pesquisa',
      'satisfação cliente',
      'pesquisa de mercado',
      'gestão de qualidade',
      'melhoria contínua',
      'experiência do cliente',
      'análise de feedback',
      'sistema de pesquisa',
      'klientti'
    ],
  },
  login: {
    title: 'Login | Klientti',
    description: 'Acesse sua conta no Klientti e continue transformando feedback em crescimento real. Login seguro com Google ou email.',
    robots: {
      index: false,
      follow: false,
    },
  },
  planos: {
    title: 'Planos e Preços | Klientti',
    description: 'Escolha o plano ideal para sua empresa. Comece grátis por 14 dias e descubra como o Klientti pode transformar o feedback dos seus clientes em crescimento real.',
    keywords: [
      'planos klientti',
      'preços feedback',
      'qr code preço',
      'sistema feedback preço',
      'teste grátis feedback'
    ],
  },
  dashboard: {
    title: 'Dashboard | Klientti',
    description: 'Painel de controle do Klientti. Gerencie suas áreas de feedback, visualize dados e tome decisões baseadas em insights reais dos seus clientes.',
    robots: {
      index: false,
      follow: false,
    },
  },
  areas: {
    title: 'Gerenciar Áreas | Klientti',
    description: 'Crie e gerencie áreas de feedback para diferentes departamentos da sua empresa. Organize QR codes e links de pesquisa de forma eficiente.',
    robots: {
      index: false,
      follow: false,
    },
  },
  feedbacks: {
    title: 'Feedbacks dos Clientes | Klientti',
    description: 'Visualize e analise todos os feedbacks recebidos dos seus clientes. Transforme opiniões em insights acionáveis para melhorar sua empresa.',
    robots: {
      index: false,
      follow: false,
    },
  },
  notFound: {
    title: 'Página não encontrada | Klientti',
    description: 'A página que você está procurando não foi encontrada. Volte para o Klientti e descubra como transformar feedback em crescimento real.',
    robots: {
      index: false,
      follow: false,
    },
  },
};

// Função para gerar metadados de página
export function generatePageMetadata(page: keyof typeof pageMetadata): Metadata {
  return {
    ...baseMetadata,
    ...pageMetadata[page],
  };
}
