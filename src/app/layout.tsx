import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { AdminModeProvider } from "@/contexts/AdminModeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Klientti - Transforme Feedback em Crescimento Real',
    template: '%s | Klientti'
  },
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
  metadataBase: new URL('https://klientti.com'),
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
  verification: {
    google: 'seu-google-verification-code',
    yandex: 'seu-yandex-verification-code',
    yahoo: 'seu-yahoo-verification-code',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased layout-main`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <AdminModeProvider>
            {children}
          </AdminModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
