import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/login',
          '/dashboard',
          '/areas',
          '/feedbacks',
          '/assinatura',
          '/profile',
          '/escritorio',
          '/agente-ia',
          '/usuarios-admin',
          '/api/',
          '/test-firebase',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/login',
          '/dashboard',
          '/areas',
          '/feedbacks',
          '/assinatura',
          '/profile',
          '/escritorio',
          '/agente-ia',
          '/usuarios-admin',
          '/api/',
          '/test-firebase',
        ],
      },
    ],
    sitemap: 'https://klientti.com/sitemap.xml',
    host: 'https://klientti.com',
  };
}
