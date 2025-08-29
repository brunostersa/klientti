# 🚨 CORREÇÃO DE EMERGÊNCIA - REGRAS DO FIRESTORE QUEBRADAS

## 🚨 PROBLEMA CRÍTICO:
- **Não consegue criar áreas** na versão online
- **Regras muito restritivas** estão bloqueando operações básicas
- **Sistema parou de funcionar**

## ✅ SOLUÇÃO IMEDIATA:

### 1. Acessar Firebase Console URGENTEMENTE:
- URL: https://console.firebase.google.com/
- Projeto: **klientti-640d4**

### 2. Ir para Firestore Rules:
- Menu lateral → **Firestore Database**
- Aba **Rules**

### 3. APLICAR REGRAS DE EMERGÊNCIA:
**DELETE tudo e COLE estas regras:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regras para usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para áreas - CORRIGIDAS
    match /areas/{areaId} {
      // Permitir criação para usuários autenticados
      allow create: if request.auth != null;
      
      // Permitir leitura e edição para dono da área ou super admin
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin');
    }
    
    // Regras para feedbacks - CORRIGIDAS
    match /feedbacks/{feedbackId} {
      // Permitir criação de feedbacks (podem ser anônimos)
      allow create: if true;
      
      // Permitir leitura para usuários autenticados
      allow read: if request.auth != null;
      
      // Permitir edição para dono da área ou super admin
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin' ||
         (exists(/databases/$(database)/documents/areas/$(resource.data.areaId)) &&
          get(/databases/$(database)/documents/areas/$(resource.data.areaId)).data.userId == request.auth.uid));
    }
    
    // Regras para assinaturas
    match /subscriptions/{subscriptionId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin');
      allow create: if request.auth != null;
    }
    
    // Regras para pagamentos
    match /payments/{paymentId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin');
      allow create: if request.auth != null;
    }
    
    // Regras para testes (apenas em desenvolvimento)
    match /test/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. PUBLISH IMEDIATAMENTE:
- Clique em **PUBLISH**
- Aguarde confirmação

### 5. TESTAR:
- **Aguarde 1-2 minutos** para propagação
- **Teste criar uma área** na versão online
- **Teste a página** `/test-db`

## 🔍 O QUE FOI CORRIGIDO:

### ❌ **Problema nas regras anteriores:**
- Regras muito complexas
- Validações que falhavam
- Bloqueio de criação de áreas

### ✅ **Solução implementada:**
- **Regras simples e diretas**
- **Criação de áreas permitida** para usuários autenticados
- **Leitura de feedbacks** para usuários autenticados
- **Segurança mantida** sem complexidade excessiva

## 🚀 APÓS APLICAR:

1. **Sistema deve voltar a funcionar** em 1-2 minutos
2. **Criação de áreas** deve funcionar
3. **Página de opiniões** deve carregar dados
4. **Teste `/test-db`** deve mostrar informações

## 📞 SE AINDA NÃO FUNCIONAR:

- **Verifique se as regras foram publicadas**
- **Aguarde mais tempo** (até 5 minutos)
- **Verifique console** do Firebase
- **Me envie** novos erros

---

**⚠️ URGENTE:** Aplique estas regras AGORA para restaurar o funcionamento do sistema!
