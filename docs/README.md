# 📚 Documentação do Projeto Klientti

## 🎯 Visão Geral

Esta pasta contém toda a documentação técnica, regras e padrões do projeto Klientti. A documentação está organizada de forma estruturada para facilitar a manutenção e o desenvolvimento.

## 📁 Estrutura da Documentação

### 🔧 **Regras e Padrões**
- **[PROJECT_RULES.md](./PROJECT_RULES.md)** - Regras gerais do projeto, padrões de código e arquitetura
- **[QUALITY_CHECKLIST.md](./QUALITY_CHECKLIST.md)** - Checklist de qualidade para desenvolvimento e deploy

### 🎨 **Sistema de Temas**
- **[THEME_SYSTEM.md](./THEME_SYSTEM.md)** - Sistema de temas unificado com CSS variables e classes utilitárias

### 🔒 **Segurança e Configuração**
- **[firestore-rules-production.txt](./firestore-rules-production.txt)** - Regras de segurança do Firestore para produção

## 🚀 Como Usar

### **Para Desenvolvedores**
1. **Leia** `PROJECT_RULES.md` para entender os padrões do projeto
2. **Consulte** `THEME_SYSTEM.md` para implementar temas consistentes
3. **Use** `QUALITY_CHECKLIST.md` antes de commits e deploys
4. **Aplique** as regras do Firestore em produção

### **Para Novos Membros**
1. **Comece** com `PROJECT_RULES.md` para entender a base
2. **Explore** `THEME_SYSTEM.md` para o sistema visual
3. **Familiarize-se** com o checklist de qualidade
4. **Revise** as regras de segurança

## 📋 Documentação Relacionada

### **No Projeto Root**
- `README.md` - Visão geral do projeto
- `SETUP.md` - Guia de configuração inicial
- `PAYMENT_SETUP.md` - Configuração de pagamentos
- `STRIPE-SETUP.md` - Configuração do Stripe
- `SUBSCRIPTION_MANAGEMENT.md` - Gerenciamento de assinaturas

### **Scripts e Configurações**
- `cron-sync-stripe.sh` - Sincronização automática com Stripe
- `cron-sync-subscriptions.sh` - Sincronização de assinaturas
- `scripts/sync-stripe-firestore.js` - Script de sincronização

## 🔄 Atualizações

### **Processo de Atualização**
1. **Modifique** o arquivo relevante
2. **Atualize** a versão no cabeçalho
3. **Teste** as mudanças
4. **Commit** com mensagem descritiva
5. **Atualize** este README se necessário

### **Versionamento**
- **Formato**: `X.Y.Z` (Semantic Versioning)
- **Major**: Mudanças incompatíveis
- **Minor**: Novas funcionalidades
- **Patch**: Correções e melhorias

## 📊 Status da Documentação

| Documento | Versão | Status | Última Atualização |
|-----------|--------|--------|-------------------|
| PROJECT_RULES.md | 1.0.0 | ✅ Ativo | Dezembro 2024 |
| QUALITY_CHECKLIST.md | 1.0.0 | ✅ Ativo | Dezembro 2024 |
| THEME_SYSTEM.md | 1.0.0 | ✅ Ativo | Dezembro 2024 |
| firestore-rules-production.txt | 1.0.0 | ✅ Ativo | Dezembro 2024 |

## 🎯 Próximos Passos

### **Documentação Planejada**
- [ ] **API_DOCUMENTATION.md** - Documentação das APIs
- [ ] **DEPLOYMENT_GUIDE.md** - Guia de deploy
- [ ] **TESTING_STRATEGY.md** - Estratégia de testes
- [ ] **PERFORMANCE_GUIDE.md** - Guia de performance

### **Melhorias**
- [ ] **Exemplos práticos** em cada documento
- [ ] **Diagramas** e fluxogramas
- [ ] **Vídeos tutoriais** para processos complexos
- [ ] **Template de issues** para documentação

## 🤝 Contribuição

### **Como Contribuir**
1. **Identifique** uma área que precisa de documentação
2. **Crie** ou **atualize** o documento relevante
3. **Siga** os padrões estabelecidos
4. **Teste** a documentação
5. **Submeta** um pull request

### **Padrões de Escrita**
- **Clareza**: Seja direto e objetivo
- **Exemplos**: Inclua exemplos práticos
- **Estrutura**: Use headers e listas organizadas
- **Revisão**: Revise antes de submeter

## 📞 Suporte

### **Dúvidas sobre Documentação**
- **Issues**: Abra uma issue no GitHub
- **Discussões**: Use as discussões do GitHub
- **Contato**: Entre em contato com a equipe

### **Sugestões de Melhoria**
- **Feedback**: Compartilhe suas ideias
- **Propostas**: Sugira novos documentos
- **Correções**: Reporte erros ou inconsistências

---

**Versão da documentação**: 1.0.0  
**Responsável**: Bruno Stersa  
**Última atualização**: Dezembro 2024  
**Status**: ✅ Ativo e Mantido
