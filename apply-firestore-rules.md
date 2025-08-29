# 🔧 Aplicar Regras do Firestore - SOLUÇÃO PARA PERMISSÕES

## 🚨 PROBLEMA IDENTIFICADO:
- **"Missing or insufficient permissions"** na página de teste
- Regras muito restritivas estão bloqueando acesso
- Usuários não conseguem ler áreas e feedbacks

## ✅ SOLUÇÃO:
Aplicar as regras simplificadas do arquivo `firestore-rules-klientti-working.txt`

## 📋 PASSOS PARA APLICAR:

### 1. Acessar Firebase Console:
- Vá para: https://console.firebase.google.com/
- Selecione o projeto: **klientti-640d4**

### 2. Ir para Firestore:
- Menu lateral → **Firestore Database**
- Aba **Rules**

### 3. Substituir Regras:
- **DELETE** todas as regras atuais
- **COLE** o conteúdo de `firestore-rules-klientti-working.txt`
- **PUBLISH** as novas regras

### 4. Conteúdo das Regras:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regras para usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para áreas
    match /areas/{areaId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin');
      allow create: if request.auth != null;
    }
    
    // Regras para feedbacks - SIMPLIFICADAS
    match /feedbacks/{feedbackId} {
      // Permitir criação de feedbacks (podem ser anônimos)
      allow create: if true;
      
      // Permitir leitura e edição para usuários autenticados
      allow read, write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin' ||
         // Permitir acesso se o usuário for dono da área relacionada
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

## 🔍 O QUE AS NOVAS REGRAS PERMITEM:

### ✅ **Usuários autenticados podem:**
- Ler/escrever seus próprios dados
- Criar áreas
- Ler/escrever suas próprias áreas
- Ler feedbacks de suas áreas
- Criar feedbacks (anônimos)

### ✅ **Super admins podem:**
- Acessar todos os dados
- Gerenciar todos os usuários

### ✅ **Usuários anônimos podem:**
- Criar feedbacks (para QR codes)

## 🚀 APÓS APLICAR AS REGRAS:

1. **Aguarde 1-2 minutos** para propagação
2. **Teste novamente** a página `/test-db`
3. **Verifique** se os dados aparecem
4. **Teste** a página de opiniões

## 📞 SE AINDA NÃO FUNCIONAR:

- Verifique se as regras foram publicadas
- Aguarde mais tempo para propagação
- Verifique se há erros no console do Firebase
- Me envie os novos logs de erro

---

**⚠️ IMPORTANTE:** Estas regras são mais permissivas que as anteriores, mas ainda mantêm segurança básica. Podemos ajustar conforme necessário após resolver o problema principal.
