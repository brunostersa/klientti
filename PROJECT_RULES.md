# 📋 Regras e Padrões do Projeto Klientti

## 🎯 Visão Geral

Este documento define as regras, padrões e diretrizes para o desenvolvimento e manutenção do projeto Klientti - Sistema de Feedback Inteligente.

---

## 🏗️ Arquitetura e Estrutura

### **Estrutura de Diretórios**
```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── (auth)/            # Rotas protegidas por autenticação
│   ├── api/               # API Routes do Next.js
│   └── globals.css        # Estilos globais
├── components/            # Componentes React reutilizáveis
├── contexts/              # Contextos React (estado global)
├── hooks/                 # Hooks customizados
├── lib/                   # Bibliotecas e configurações
├── types/                 # Definições TypeScript
└── utils/                 # Funções utilitárias
```

### **Regras de Nomenclatura**
- **Arquivos**: `kebab-case` (ex: `user-profile.tsx`)
- **Componentes**: `PascalCase` (ex: `UserProfile`)
- **Funções**: `camelCase` (ex: `getUserData`)
- **Constantes**: `UPPER_SNAKE_CASE` (ex: `MAX_FILE_SIZE`)
- **Interfaces**: `PascalCase` com prefixo `I` (ex: `IUser`)

---

## 🔒 Regras de Segurança

### **Firestore Security Rules**

#### **Usuários (`/users/{userId}`)**
```javascript
// Usuário só pode ler/escrever seu próprio documento
allow read, write: if request.auth != null && request.auth.uid == userId;
allow create: if request.auth != null && request.auth.uid == userId;
```

#### **Áreas (`/areas/{areaId}`)**
```javascript
// Usuário pode ler/escrever suas próprias áreas
// Super admin pode acessar todas as áreas
allow read, write: if request.auth != null && 
  (request.auth.uid == resource.data.userId || 
   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin');
allow create: if request.auth != null;
```

#### **Feedbacks (`/feedbacks/{feedbackId}`)**
```javascript
// Qualquer pessoa pode criar feedbacks (anônimos)
allow create: if true;

// Usuários autenticados podem ler/editar feedbacks de suas áreas
allow read, write: if request.auth != null && 
  (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin' ||
   (exists(/databases/$(database)/documents/areas/$(resource.data.areaId)) &&
    get(/databases/$(database)/documents/areas/$(resource.data.areaId)).data.userId == request.auth.uid));
```

#### **Assinaturas e Pagamentos**
```javascript
// Usuário só pode acessar seus próprios dados
// Super admin pode acessar todos
allow read, write: if request.auth != null && 
  (request.auth.uid == resource.data.userId || 
   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin');
```

### **Autenticação**
- ✅ **Obrigatória** para todas as rotas protegidas
- ✅ **Google Auth** como provedor principal
- ✅ **Verificação de estado** em todas as páginas protegidas
- ✅ **Redirecionamento automático** para `/login` se não autenticado

---

## 💻 Padrões de Código

### **TypeScript**
- ✅ **Tipagem obrigatória** para todas as funções e variáveis
- ✅ **Interfaces bem definidas** para estruturas de dados
- ✅ **Generics** quando apropriado
- ✅ **Strict mode** habilitado

### **React**
- ✅ **Componentes funcionais** com hooks
- ✅ **Custom hooks** para lógica reutilizável
- ✅ **Context API** para estado global
- ✅ **Error boundaries** para tratamento de erros

### **Next.js**
- ✅ **App Router** (não Pages Router)
- ✅ **Server Components** quando possível
- ✅ **Client Components** apenas quando necessário
- ✅ **API Routes** para operações do servidor

### **Estilização**
- ✅ **Tailwind CSS** como framework principal
- ✅ **Componentes consistentes** com design system
- ✅ **Responsividade** obrigatória para todos os componentes
- ✅ **Dark mode** suportado em todos os componentes

---

## 📱 Componentes e UI

### **Padrões de Componentes**
```typescript
// Estrutura padrão de componente
interface ComponentProps {
  // Props obrigatórias primeiro
  requiredProp: string;
  // Props opcionais depois
  optionalProp?: string;
  // Props com valores padrão
  defaultProp?: boolean;
}

export default function Component({ 
  requiredProp, 
  optionalProp, 
  defaultProp = true 
}: ComponentProps) {
  // Hooks primeiro
  const [state, setState] = useState();
  
  // Lógica de negócio
  const handleAction = () => { /* ... */ };
  
  // Renderização
  return (
    <div className="component-classes">
      {/* Conteúdo */}
    </div>
  );
}
```

### **Estados de Componentes**
- ✅ **Loading**: Para operações assíncronas
- ✅ **Error**: Para tratamento de erros
- ✅ **Empty**: Para dados vazios
- ✅ **Success**: Para confirmações

---

## 🔄 Gerenciamento de Estado

### **Local State**
- ✅ **useState** para estado simples de componente
- ✅ **useReducer** para estado complexo
- ✅ **useCallback** para funções estáveis
- ✅ **useMemo** para cálculos custosos

### **Global State**
- ✅ **Context API** para estado compartilhado
- ✅ **Zustand** para estado complexo (se necessário)
- ✅ **Evitar prop drilling** excessivo

### **Server State**
- ✅ **Firebase SDK** para operações em tempo real
- ✅ **onSnapshot** para dados em tempo real
- ✅ **Tratamento de erros** obrigatório
- ✅ **Loading states** para todas as operações

---

## 📊 Dados e Validação

### **Validação de Formulários**
- ✅ **Validação no cliente** para UX
- ✅ **Validação no servidor** para segurança
- ✅ **Mensagens de erro** claras e úteis
- ✅ **Feedback visual** imediato

### **Estrutura de Dados**
```typescript
// Exemplo de interface de usuário
interface IUser {
  uid: string;
  email: string;
  name: string;
  company: string;
  segment: string;
  phone: string;
  role: 'user' | 'admin' | 'super_admin';
  plan: 'free' | 'starter' | 'professional';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚀 Performance e Otimização

### **Lazy Loading**
- ✅ **Componentes pesados** carregados sob demanda
- ✅ **Imagens otimizadas** com Next.js Image
- ✅ **Code splitting** automático com Next.js

### **Caching**
- ✅ **Firestore offline** para dados críticos
- ✅ **SWR/React Query** para cache de API (se implementado)
- ✅ **Local storage** para preferências do usuário

---

## 🧪 Testes e Qualidade

### **Testes**
- ✅ **Testes unitários** para funções críticas
- ✅ **Testes de integração** para fluxos principais
- ✅ **Testes E2E** para jornadas do usuário

### **Qualidade de Código**
- ✅ **ESLint** configurado e seguido
- ✅ **Prettier** para formatação consistente
- ✅ **TypeScript strict mode** habilitado
- ✅ **Code review** obrigatório para PRs

---

## 📝 Documentação

### **Comentários**
- ✅ **JSDoc** para funções públicas
- ✅ **Comentários explicativos** para lógica complexa
- ✅ **README atualizado** com instruções de setup
- ✅ **Changelog** para versões

### **Arquivos de Documentação**
- ✅ **README.md** - Visão geral do projeto
- ✅ **PROJECT_RULES.md** - Este arquivo
- ✅ **CONFIGURACAO.md** - Instruções de setup
- ✅ **CHANGELOG.md** - Histórico de mudanças

---

## 🔄 Git e Versionamento

### **Convenções de Commit**
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação de código
refactor: refatoração
test: testes
chore: tarefas de manutenção
```

### **Branches**
- ✅ **main** - Código de produção
- ✅ **develop** - Código em desenvolvimento
- ✅ **feature/*** - Novas funcionalidades
- ✅ **hotfix/*** - Correções urgentes

### **Pull Requests**
- ✅ **Descrição clara** da mudança
- ✅ **Testes passando** antes do merge
- ✅ **Code review** obrigatório
- ✅ **Squash commits** antes do merge

---

## 🚨 Tratamento de Erros

### **Frontend**
- ✅ **Error boundaries** para componentes
- ✅ **Try-catch** para operações assíncronas
- ✅ **Fallback UI** para estados de erro
- ✅ **Logging** de erros para debugging

### **Backend**
- ✅ **Validação de entrada** obrigatória
- ✅ **Tratamento de erros** do Firestore
- ✅ **Logs estruturados** para monitoramento
- ✅ **Fallbacks** para operações críticas

---

## 🔐 Segurança Adicional

### **Validação de Entrada**
- ✅ **Sanitização** de dados do usuário
- ✅ **Validação de tipos** com TypeScript
- ✅ **Rate limiting** para APIs públicas
- ✅ **CORS** configurado adequadamente

### **Dados Sensíveis**
- ✅ **Variáveis de ambiente** para configurações
- ✅ **Secrets** nunca commitados no código
- ✅ **Logs** sem informações sensíveis
- ✅ **Auditoria** de acessos administrativos

---

## 📱 Responsividade e Acessibilidade

### **Responsividade**
- ✅ **Mobile-first** design
- ✅ **Breakpoints** consistentes
- ✅ **Touch-friendly** para dispositivos móveis
- ✅ **Performance** otimizada para mobile

### **Acessibilidade**
- ✅ **ARIA labels** para elementos interativos
- ✅ **Contraste adequado** entre cores
- ✅ **Navegação por teclado** funcional
- ✅ **Screen readers** compatíveis

---

## 🚀 Deploy e Produção

### **Ambientes**
- ✅ **Development** - localhost:3000
- ✅ **Staging** - para testes
- ✅ **Production** - versão final

### **Variáveis de Ambiente**
```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Outras
NODE_ENV=production
```

---

## 📋 Checklist de Qualidade

### **Antes de Fazer Commit**
- [ ] Código segue padrões do projeto
- [ ] TypeScript sem erros
- [ ] ESLint sem warnings
- [ ] Testes passando
- [ ] Responsividade testada
- [ ] Documentação atualizada

### **Antes de Fazer Deploy**
- [ ] Build sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Regras do Firestore aplicadas
- [ ] Testes de integração passando
- [ ] Performance otimizada

---

## 🆘 Suporte e Manutenção

### **Monitoramento**
- ✅ **Logs estruturados** para debugging
- ✅ **Métricas de performance** coletadas
- ✅ **Alertas** para erros críticos
- ✅ **Backup automático** dos dados

### **Manutenção**
- ✅ **Atualizações regulares** de dependências
- ✅ **Security patches** aplicados rapidamente
- ✅ **Performance reviews** mensais
- ✅ **Code quality** monitorada

---

## 📞 Contato e Suporte

- **Desenvolvedor**: Bruno Stersa
- **Email**: brunostersa@gmail.com
- **Projeto**: Klientti - Sistema de Feedback Inteligente
- **Versão**: 1.0.0

---

**Última atualização**: $(date)
**Versão do documento**: 1.0.0

---

> ⚠️ **Importante**: Este documento deve ser revisado e atualizado regularmente para manter a consistência do projeto.
