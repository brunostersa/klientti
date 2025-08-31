# 🎨 Sistema de Temas - Klientti

## 📋 Visão Geral

O sistema de temas do Klientti foi completamente reformulado para garantir **consistência total** entre os modos claro e escuro, eliminando problemas de cards escuros em tema claro e vice-versa.

## 🎯 Objetivos

- ✅ **Consistência visual** entre temas light e dark
- ✅ **Sistema de cores unificado** com variáveis CSS
- ✅ **Transições suaves** entre temas
- ✅ **Manutenibilidade** com classes CSS reutilizáveis
- ✅ **Acessibilidade** com contraste adequado
- ✅ **Performance** com transições otimizadas

## 🏗️ Arquitetura

### 1. **Variáveis CSS (CSS Custom Properties)**
```css
:root {
  /* Cores principais */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-accent: #10b981;
  
  /* Fundos */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-card: #ffffff;
  
  /* Textos */
  --text-primary: #111827;
  --text-secondary: #4b5563;
}
```

### 2. **Modo Escuro (.dark)**
```css
.dark {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-card: #1f2937;
  
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
}
```

### 3. **Classes Utilitárias**
```css
.bg-theme-primary { background-color: var(--bg-primary); }
.text-theme-primary { color: var(--text-primary); }
.border-theme-primary { border-color: var(--border-primary); }
```

## 🎨 Paleta de Cores

### **Cores Principais**
- **Primary**: `#3b82f6` (Azul)
- **Secondary**: `#8b5cf6` (Roxo)
- **Accent**: `#10b981` (Verde)

### **Estados**
- **Success**: `#10b981` (Verde)
- **Warning**: `#f59e0b` (Amarelo)
- **Error**: `#ef4444` (Vermelho)
- **Info**: `#3b82f6` (Azul)

### **Neutros**
- **Light Theme**: Tons de cinza claro
- **Dark Theme**: Tons de cinza escuro

## 🔧 Componentes Atualizados

### 1. **Card Component**
```tsx
// Antes (problemático)
className="bg-white dark:bg-gray-800"

// Depois (consistente)
className="card-theme"
```

### 2. **Header Component**
```tsx
// Antes
className="bg-theme-card border-b border-theme-primary shadow-theme-sm"

// Depois
className="header-theme border-b"
```

### 3. **Sidebar Component**
```tsx
// Antes
className="bg-theme-card border-r border-theme-primary"

// Depois
className="sidebar-theme border-r border-theme-primary"
```

### 4. **ThemeSwitcher Component**
```tsx
// Antes
className="bg-gray-100 border border-gray-200"

// Depois
className="bg-theme-button border border-theme-primary"
```

## 📱 Classes CSS Disponíveis

### **Fundos**
- `.bg-theme-primary` - Fundo principal
- `.bg-theme-secondary` - Fundo secundário
- `.bg-theme-tertiary` - Fundo terciário
- `.bg-theme-card` - Fundo de cards
- `.bg-theme-input` - Fundo de inputs
- `.bg-theme-button` - Fundo de botões

### **Textos**
- `.text-theme-primary` - Texto principal
- `.text-theme-secondary` - Texto secundário
- `.text-theme-muted` - Texto atenuado
- `.text-theme-inverse` - Texto inverso

### **Bordas**
- `.border-theme-primary` - Borda principal
- `.border-theme-secondary` - Borda secundária
- `.border-theme-focus` - Borda de foco

### **Sombras**
- `.shadow-theme-sm` - Sombra pequena
- `.shadow-theme-md` - Sombra média
- `.shadow-theme-lg` - Sombra grande
- `.shadow-theme-xl` - Sombra extra grande

### **Componentes Específicos**
- `.card-theme` - Card padrão
- `.card-theme-elevated` - Card elevado
- `.header-theme` - Header
- `.sidebar-theme` - Sidebar
- `.dropdown-theme` - Dropdown
- `.modal-theme` - Modal
- `.tooltip-theme` - Tooltip

### **Estados**
- `.btn-theme-primary` - Botão primário
- `.btn-theme-secondary` - Botão secundário
- `.btn-theme-outline` - Botão outline
- `.input-theme` - Input padrão

### **Hover e Focus**
- `.hover:bg-theme-secondary` - Hover no fundo secundário
- `.hover:text-theme-primary` - Hover no texto principal
- `.focus:border-theme-focus` - Foco na borda
- `.focus:ring-theme-focus` - Anel de foco

## 🚀 Como Usar

### 1. **Em Componentes React**
```tsx
import React from 'react';

const MyComponent = () => {
  return (
    <div className="card-theme p-6">
      <h2 className="text-theme-primary text-xl font-bold">
        Título
      </h2>
      <p className="text-theme-secondary">
        Descrição
      </p>
      <button className="btn-theme-primary px-4 py-2">
        Ação
      </button>
    </div>
  );
};
```

### 2. **Em Páginas**
```tsx
export default function MyPage() {
  return (
    <div className="bg-theme-primary min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="card-theme p-8">
          <h1 className="text-theme-primary text-3xl font-bold">
            Página
          </h1>
        </div>
      </div>
    </div>
  );
}
```

### 3. **Formulários**
```tsx
const MyForm = () => {
  return (
    <form className="space-y-4">
      <div>
        <label className="form-label-theme block mb-2">
          Nome
        </label>
        <input 
          type="text" 
          className="form-input-theme w-full px-3 py-2 rounded"
        />
      </div>
    </form>
  );
};
```

## 🔄 Transições

### **Configuração Global**
```css
* {
  transition: background-color 0.2s ease, 
              color 0.2s ease, 
              border-color 0.2s ease, 
              box-shadow 0.2s ease;
}
```

### **Classes de Animação**
- `.animate-fade-in` - Fade in
- `.animate-slide-up` - Slide up
- `.animate-pulse-slow` - Pulse lento

## 📱 Responsividade

### **Classes Mobile**
- `.mobile-hidden` - Ocultar em mobile
- `.desktop-hidden` - Ocultar em desktop

### **Breakpoints**
- **Mobile**: `max-width: 640px`
- **Desktop**: `min-width: 641px`

## ♿ Acessibilidade

### **Contraste**
- **Light Theme**: Contraste 4.5:1 mínimo
- **Dark Theme**: Contraste 4.5:1 mínimo

### **Focus States**
- `.focus-visible:focus` - Estado de foco visível
- `.sr-only` - Texto para leitores de tela

## 🧪 Testando

### 1. **Alternar Tema**
- Clique no botão de tema no header
- Verifique transições suaves
- Confirme consistência visual

### 2. **Verificar Componentes**
- Cards devem ter fundo claro em tema claro
- Cards devem ter fundo escuro em tema escuro
- Textos devem ter contraste adequado

### 3. **Testar Responsividade**
- Redimensione a janela
- Teste em dispositivos móveis
- Verifique breakpoints

## 🐛 Troubleshooting

### **Problema**: Cores não mudam
**Solução**: Verificar se a classe `.dark` está sendo aplicada no HTML

### **Problema**: Transições não funcionam
**Solução**: Verificar se as transições CSS estão sendo carregadas

### **Problema**: Inconsistências visuais
**Solução**: Usar as classes de tema em vez de cores hardcoded

## 📚 Recursos Adicionais

### **Arquivos Relacionados**
- `src/app/globals.css` - Sistema de temas principal
- `src/components/ThemeProvider.tsx` - Provedor de tema
- `src/components/ThemeSwitcher.tsx` - Alternador de tema

### **Documentação**
- `PROJECT_RULES.md` - Regras do projeto
- `QUALITY_CHECKLIST.md` - Checklist de qualidade

## 🔮 Futuras Melhorias

### **Planejadas**
- [ ] Temas customizáveis por usuário
- [ ] Mais variantes de cores
- [ ] Sistema de cores semânticas
- [ ] Modo automático (baseado no sistema)

### **Considerações**
- Performance das transições
- Acessibilidade avançada
- Suporte a preferências do usuário
- Integração com design system

---

**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024  
**Responsável**: Bruno Stersa  
**Status**: ✅ Implementado e Testado
