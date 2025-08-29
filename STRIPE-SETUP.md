# 🔧 Configuração do Stripe - Klientti

## 🚨 PROBLEMA IDENTIFICADO:
- **Botões de upgrade não funcionam**
- **Integração com Stripe não configurada**
- **Variáveis de ambiente faltando**

## ✅ SOLUÇÃO IMPLEMENTADA:

### **1. Função de Upgrade Criada:**
- Função `handleUpgrade()` implementada
- Integração com API `/api/create-checkout-session`
- Redirecionamento para Stripe Checkout

### **2. Botões Corrigidos:**
- Botões agora chamam `handleUpgrade()`
- Integração completa com Stripe

## 🔑 CONFIGURAÇÃO NECESSÁRIA:

### **1. Criar arquivo `.env.local`:**
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Sua chave secreta do Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Sua chave pública do Stripe

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://klientti.com
```

### **2. Obter Chaves do Stripe:**
1. Acesse: https://dashboard.stripe.com/
2. Vá para **Developers** → **API keys**
3. Copie **Publishable key** e **Secret key**
4. Use chaves de **teste** para desenvolvimento

### **3. Configurar Webhooks (opcional):**
1. **Developers** → **Webhooks**
2. **Add endpoint**: `https://klientti.com/api/webhook`
3. **Events**: `checkout.session.completed`

## 🚀 COMO FUNCIONA AGORA:

### **1. Usuário clica em "Fazer Upgrade":**
- Chama `handleUpgrade(plan)`
- Faz requisição para `/api/create-checkout-session`
- Cria sessão no Stripe

### **2. Stripe Checkout:**
- Redireciona para página de pagamento
- Usuário insere dados do cartão
- Pagamento processado

### **3. Webhook (quando configurado):**
- Stripe notifica sobre pagamento
- Sistema atualiza plano do usuário
- Redireciona para sucesso

## 📋 PLANOS CONFIGURADOS:

### **Starter:**
- **Preço:** R$ 29/mês
- **Features:** 5 áreas, 200 feedbacks/mês
- **Stripe Price ID:** Criado automaticamente

### **Professional:**
- **Preço:** R$ 79/mês
- **Features:** Ilimitado, suporte 24/7
- **Stripe Price ID:** Criado automaticamente

## 🔍 TESTE RÁPIDO:

### **1. Configurar variáveis:**
```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### **2. Testar upgrade:**
- Acessar `/planos`
- Clicar em "Fazer Upgrade para Starter"
- Verificar console para logs
- Redirecionamento para Stripe

### **3. Verificar logs:**
```
Iniciando upgrade para plano: starter
Sessão de checkout criada: cs_...
```

## ⚠️ IMPORTANTE:

### **Para Produção:**
- Use chaves **live** do Stripe
- Configure webhooks corretamente
- Teste fluxo completo de pagamento

### **Para Desenvolvimento:**
- Use chaves **test** do Stripe
- Cartões de teste funcionam
- Não há cobrança real

## 📞 PRÓXIMOS PASSOS:

1. **Configurar variáveis** de ambiente
2. **Testar upgrade** para Starter
3. **Verificar redirecionamento** para Stripe
4. **Configurar webhooks** (opcional)

---

**🔧 Após configurar as variáveis, o sistema de assinaturas funcionará perfeitamente!**
