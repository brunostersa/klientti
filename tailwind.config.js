/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  // Otimizações de performance
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      // Personalizações para text-base
      fontSize: {
        'base': ['1rem', {
          lineHeight: '1.5rem',
          letterSpacing: '0.025em',
          fontWeight: '400'
        }],
      },
      // Animações otimizadas
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  // Plugins de otimização
  plugins: [
    // Plugin para remover CSS não utilizado em produção
    function({ addUtilities, addComponents, theme, variants, e, config }) {
      // Adicionar utilitários customizados se necessário
    },
  ],
}
