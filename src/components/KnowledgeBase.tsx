'use client';

import { useState, useEffect } from 'react';
import { KnowledgeItem, KnowledgeSegment } from '@/types/Knowledge';
import Card, { CardHeader, CardContent } from '@/components/Card';

// Dados da base de conhecimento
const knowledgeData: KnowledgeSegment[] = [
  {
    id: 'varejo',
    name: 'Varejo',
    description: 'Lojas físicas e e-commerce',
    icon: '🛍️',
    color: 'bg-blue-500',
    items: [
      {
        id: '1',
        title: 'Filas e Tempo de Espera',
        description: 'Problema comum em períodos de pico',
        problem: 'Clientes reclamam de filas longas e demora no atendimento, especialmente em horários de pico e promoções.',
        solution: 'Implementar sistema de senhas digitais, aumentar equipe em horários de pico, e otimizar processos de pagamento.',
        tips: [
          'Instale totens de autoatendimento',
          'Treine equipe para atendimento rápido',
          'Monitore horários de pico',
          'Ofereça opções de pagamento digital'
        ],
        segment: 'Varejo',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Falta de Produtos',
        description: 'Estoque insuficiente',
        problem: 'Produtos populares ficam fora de estoque rapidamente, causando frustração nos clientes.',
        solution: 'Implementar sistema de gestão de estoque em tempo real e previsão de demanda.',
        tips: [
          'Use sistema de alerta de estoque baixo',
          'Analise histórico de vendas',
          'Mantenha fornecedores alternativos',
          'Comunique disponibilidade aos clientes'
        ],
        segment: 'Varejo',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Atendimento Impessoal',
        description: 'Falta de conexão com o cliente',
        problem: 'Funcionários não criam conexão emocional com os clientes, resultando em experiência fria.',
        solution: 'Treinar equipe em técnicas de vendas consultivas e relacionamento com cliente.',
        tips: [
          'Treine equipe em comunicação',
          'Incentive abordagem personalizada',
          'Reconheça clientes recorrentes',
          'Crie programa de fidelidade'
        ],
        segment: 'Varejo',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        title: 'Problemas de Estacionamento',
        description: 'Falta de vagas e dificuldade de acesso',
        problem: 'Clientes reclamam da falta de vagas de estacionamento e dificuldade para acessar a loja.',
        solution: 'Implementar sistema de validação de estacionamento e parcerias com estacionamentos próximos.',
        tips: [
          'Faça parceria com estacionamentos',
          'Ofereça validação de ticket',
          'Implemente sistema de vagas reservadas',
          'Comunique opções de transporte público'
        ],
        segment: 'Varejo',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        title: 'Preços Inconsistentes',
        description: 'Diferenças entre preços online e físico',
        problem: 'Preços diferentes entre site, aplicativo e loja física causam confusão e desconfiança.',
        solution: 'Sincronizar preços em todos os canais e implementar sistema de preços unificado.',
        tips: [
          'Sincronize preços em tempo real',
          'Treine equipe sobre preços atuais',
          'Implemente sistema de preços dinâmicos',
          'Comunique mudanças de preço claramente'
        ],
        segment: 'Varejo',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '6',
        title: 'Falta de Informações do Produto',
        description: 'Informações insuficientes nas prateleiras',
        problem: 'Clientes não conseguem encontrar informações detalhadas sobre produtos nas prateleiras.',
        solution: 'Implementar QR codes informativos e treinar equipe para fornecer detalhes completos.',
        tips: [
          'Adicione QR codes nas prateleiras',
          'Treine equipe sobre produtos',
          'Crie guias visuais informativos',
          'Ofereça tablets para consulta'
        ],
        segment: 'Varejo',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '7',
        title: 'Problemas de Devolução',
        description: 'Processo burocrático e demorado',
        problem: 'Processo de devolução é complicado, demorado e gera frustração nos clientes.',
        solution: 'Simplificar processo de devolução com política clara e atendimento dedicado.',
        tips: [
          'Simplifique a política de devolução',
          'Crie área dedicada para devoluções',
          'Treine equipe para agilizar processo',
          'Ofereça troca imediata quando possível'
        ],
        segment: 'Varejo',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '8',
        title: 'Falta de Opções de Pagamento',
        description: 'Poucas formas de pagamento aceitas',
        problem: 'Loja aceita apenas dinheiro e cartão, limitando opções de pagamento dos clientes.',
        solution: 'Implementar PIX, cartões de débito e crédito, e outras formas de pagamento digital.',
        tips: [
          'Implemente PIX e pagamentos digitais',
          'Aceite diferentes tipos de cartão',
          'Ofereça parcelamento sem juros',
          'Considere carteiras digitais'
        ],
        segment: 'Varejo',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '9',
        title: 'Problemas de Limpeza',
        description: 'Ambiente sujo e desorganizado',
        problem: 'Loja apresenta problemas de limpeza, prateleiras desorganizadas e ambiente pouco atrativo.',
        solution: 'Implementar rotina de limpeza rigorosa e treinar equipe para manter organização.',
        tips: [
          'Crie rotina de limpeza diária',
          'Treine equipe sobre organização',
          'Monitore limpeza constantemente',
          'Implemente checklist de limpeza'
        ],
        segment: 'Varejo',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '10',
        title: 'Falta de Treinamento da Equipe',
        description: 'Funcionários sem conhecimento adequado',
        problem: 'Equipe não tem conhecimento suficiente sobre produtos e políticas da empresa.',
        solution: 'Implementar programa de treinamento contínuo e sistema de mentoria.',
        tips: [
          'Crie programa de treinamento',
          'Implemente sistema de mentoria',
          'Faça reuniões semanais de conhecimento',
          'Crie base de conhecimento interna'
        ],
        segment: 'Varejo',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '11',
        title: 'Problemas de Segurança',
        description: 'Furtos e sensação de insegurança',
        problem: 'Loja apresenta problemas de segurança, gerando sensação de insegurança nos clientes.',
        solution: 'Implementar sistema de segurança visível e treinar equipe em procedimentos de segurança.',
        tips: [
          'Instale câmeras de segurança visíveis',
          'Contrate segurança armado',
          'Treine equipe em procedimentos',
          'Implemente sistema de alarme'
        ],
        segment: 'Varejo',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '12',
        title: 'Falta de Personalização',
        description: 'Atendimento padronizado demais',
        problem: 'Atendimento é muito padronizado, sem personalização para diferentes perfis de cliente.',
        solution: 'Implementar sistema de perfil de cliente e treinar equipe em atendimento personalizado.',
        tips: [
          'Implemente sistema de perfil de cliente',
          'Treine equipe em personalização',
          'Ofereça recomendações personalizadas',
          'Crie programa de fidelidade individual'
        ],
        segment: 'Varejo',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '13',
        title: 'Problemas de Comunicação',
        description: 'Informações não chegam aos clientes',
        problem: 'Promoções e novidades não chegam aos clientes de forma eficiente.',
        solution: 'Implementar sistema de comunicação multicanal e base de dados de clientes.',
        tips: [
          'Crie base de dados de clientes',
          'Implemente WhatsApp Business',
          'Use redes sociais ativamente',
          'Envie newsletter semanal'
        ],
        segment: 'Varejo',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: 'restaurante',
    name: 'Restaurante',
    description: 'Bares, restaurantes e delivery',
    icon: '🍽️',
    color: 'bg-orange-500',
    items: [
      {
        id: '14',
        title: 'Tempo de Preparo',
        description: 'Demora na entrega dos pratos',
        problem: 'Clientes reclamam do tempo de espera entre pedido e entrega, especialmente em horários de pico.',
        solution: 'Otimizar processos na cozinha, treinar equipe e implementar sistema de gestão de pedidos.',
        tips: [
          'Organize cozinha por fluxo de trabalho',
          'Treine equipe em eficiência',
          'Use sistema de gestão de pedidos',
          'Comunique tempo de espera'
        ],
        segment: 'Restaurante',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '15',
        title: 'Qualidade Inconsistente',
        description: 'Variação na qualidade dos pratos',
        problem: 'Mesmo prato tem qualidade diferente dependendo de quem prepara ou do dia.',
        solution: 'Padronizar receitas, treinar equipe e implementar controle de qualidade.',
        tips: [
          'Padronize receitas e processos',
          'Treine equipe constantemente',
          'Implemente controle de qualidade',
          'Use ingredientes consistentes'
        ],
        segment: 'Restaurante',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '6',
        title: 'Limpeza e Higiene',
        description: 'Ambiente e utensílios',
        problem: 'Clientes notam problemas de limpeza no ambiente, banheiros ou utensílios.',
        solution: 'Implementar protocolos rigorosos de limpeza e treinar equipe em higiene.',
        tips: [
          'Crie checklist de limpeza',
          'Treine equipe em higiene',
          'Inspecione regularmente',
          'Mantenha estoque de produtos'
        ],
        segment: 'Restaurante',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '17',
        title: 'Problemas de Delivery',
        description: 'Demora e comida fria na entrega',
        problem: 'Pedidos de delivery demoram muito e chegam frios, causando insatisfação dos clientes.',
        solution: 'Implementar sistema de delivery próprio ou parcerias com entregadores confiáveis.',
        tips: [
          'Contrate entregadores próprios',
          'Faça parceria com apps confiáveis',
          'Use embalagens térmicas',
          'Monitore tempo de entrega'
        ],
        segment: 'Restaurante',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '18',
        title: 'Falta de Opções Vegetarianas',
        description: 'Poucas opções para dietas especiais',
        problem: 'Cardápio não oferece opções adequadas para vegetarianos, veganos e outras dietas.',
        solution: 'Expandir cardápio com opções vegetarianas e treinar equipe sobre restrições alimentares.',
        tips: [
          'Adicione pratos vegetarianos',
          'Treine equipe sobre dietas',
          'Marque opções no cardápio',
          'Ofereça substituições'
        ],
        segment: 'Restaurante',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '19',
        title: 'Problemas de Reservas',
        description: 'Sistema de reservas ineficiente',
        problem: 'Sistema de reservas é confuso, não confirma reservas e gera confusão.',
        solution: 'Implementar sistema de reservas online e treinar equipe para gerenciar reservas.',
        tips: [
          'Implemente sistema online',
          'Confirme reservas por WhatsApp',
          'Treine equipe para reservas',
          'Mantenha lista de espera'
        ],
        segment: 'Restaurante',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '20',
        title: 'Falta de Higiene Visível',
        description: 'Ambiente não transmite confiança',
        problem: 'Cozinha não é visível e ambiente não transmite confiança na higiene.',
        solution: 'Implementar cozinha aberta e manter ambiente sempre limpo e organizado.',
        tips: [
          'Implemente cozinha aberta',
          'Mantenha ambiente sempre limpo',
          'Use uniformes limpos',
          'Exiba certificados de higiene'
        ],
        segment: 'Restaurante',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '21',
        title: 'Problemas de Temperatura',
        description: 'Ambiente muito quente ou frio',
        problem: 'Restaurante não tem controle adequado de temperatura, causando desconforto.',
        solution: 'Implementar sistema de ar condicionado adequado e monitorar temperatura constantemente.',
        tips: [
          'Instale ar condicionado adequado',
          'Monitore temperatura constantemente',
          'Ajuste conforme ocupação',
          'Ofereça ventiladores em emergência'
        ],
        segment: 'Restaurante',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '22',
        title: 'Falta de Estacionamento',
        description: 'Dificuldade para estacionar',
        problem: 'Cliente não consegue estacionar próximo ao restaurante.',
        solution: 'Implementar parcerias com estacionamentos e validação de tickets.',
        tips: [
          'Faça parceria com estacionamentos',
          'Ofereça validação de ticket',
          'Indique estacionamentos próximos',
          'Considere valet parking'
        ],
        segment: 'Restaurante',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '23',
        title: 'Problemas de Barulho',
        description: 'Ambiente muito barulhento',
        problem: 'Restaurante é muito barulhento, dificultando conversas.',
        solution: 'Implementar acústica adequada e controlar volume da música.',
        tips: [
          'Instale isolamento acústico',
          'Controle volume da música',
          'Use tapetes para absorver som',
          'Organize mesas com espaçamento'
        ],
        segment: 'Restaurante',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '24',
        title: 'Falta de Opções para Crianças',
        description: 'Cardápio infantil limitado',
        problem: 'Cardápio não oferece opções adequadas para crianças.',
        solution: 'Criar cardápio infantil atrativo e oferecer atividades para crianças.',
        tips: [
          'Crie cardápio infantil',
          'Ofereça atividades para crianças',
          'Tenha cadeiras especiais',
          'Ofereça brindes'
        ],
        segment: 'Restaurante',
        priority: 'low',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '25',
        title: 'Problemas de Pagamento',
        description: 'Sistema de pagamento lento',
        problem: 'Sistema de pagamento é lento e gera filas na saída.',
        solution: 'Implementar sistema de pagamento rápido e treinar equipe.',
        tips: [
          'Implemente PIX e pagamentos digitais',
          'Treine equipe para agilizar',
          'Use terminais móveis',
          'Ofereça pagamento na mesa'
        ],
        segment: 'Restaurante',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '26',
        title: 'Falta de Promoções',
        description: 'Poucas ofertas atrativas',
        problem: 'Restaurante não oferece promoções atrativas para fidelizar clientes.',
        solution: 'Implementar programa de fidelidade e promoções sazonais.',
        tips: [
          'Crie programa de fidelidade',
          'Ofereça promoções sazonais',
          'Implemente happy hour',
          'Crie combos especiais'
        ],
        segment: 'Restaurante',
        priority: 'low',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '27',
        title: 'Problemas de Atendimento',
        description: 'Equipe desatenta e lenta',
        problem: 'Equipe é desatenta, demora para atender e não é proativa.',
        solution: 'Treinar equipe em atendimento proativo e implementar sistema de avaliação.',
        tips: [
          'Treine equipe em atendimento',
          'Implemente sistema de avaliação',
          'Monitore tempo de atendimento',
          'Recompense bom desempenho'
        ],
        segment: 'Restaurante',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '28',
        title: 'Falta de Flexibilidade no Cardápio',
        description: 'Não aceita modificações',
        problem: 'Restaurante não aceita modificações nos pratos, limitando opções dos clientes.',
        solution: 'Implementar política de modificações e treinar equipe para ser flexível.',
        tips: [
          'Aceite modificações simples',
          'Treine equipe para ser flexível',
          'Marque opções modificáveis',
          'Ofereça alternativas'
        ],
        segment: 'Restaurante',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: 'saude',
    name: 'Saúde',
    description: 'Clínicas, hospitais e consultórios',
    icon: '🏥',
    color: 'bg-green-500',
    items: [
      {
        id: '7',
        title: 'Tempo de Espera',
        description: 'Demora para atendimento médico',
        problem: 'Pacientes reclamam de longas esperas para consultas e exames.',
        solution: 'Otimizar agenda, implementar triagem eficiente e comunicar horários.',
        tips: [
          'Otimize agenda de consultas',
          'Implemente triagem eficiente',
          'Comunique atrasos',
          'Ofereça agendamento online'
        ],
        segment: 'Saúde',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '8',
        title: 'Falta de Humanização',
        description: 'Atendimento muito técnico',
        problem: 'Profissionais focam apenas no aspecto técnico, esquecendo o lado humano.',
        solution: 'Treinar equipe em comunicação empática e humanização do atendimento.',
        tips: [
          'Treine equipe em empatia',
          'Use linguagem acessível',
          'Demonstre interesse pessoal',
          'Explique procedimentos claramente'
        ],
        segment: 'Saúde',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '9',
        title: 'Falta de Informação',
        description: 'Pacientes mal informados',
        problem: 'Pacientes não recebem informações claras sobre tratamentos e procedimentos.',
        solution: 'Implementar protocolos de comunicação e material educativo.',
        tips: [
          'Crie material educativo',
          'Explique procedimentos',
          'Ofereça segunda opinião',
          'Mantenha comunicação clara'
        ],
        segment: 'Saúde',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '30',
        title: 'Problemas de Agendamento',
        description: 'Sistema de agendamento confuso',
        problem: 'Sistema de agendamento é confuso, não confirma consultas e gera confusão.',
        solution: 'Implementar sistema de agendamento online e treinar equipe para gerenciar agenda.',
        tips: [
          'Implemente agendamento online',
          'Confirme consultas por WhatsApp',
          'Treine equipe para agenda',
          'Mantenha lista de espera'
        ],
        segment: 'Saúde',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '31',
        title: 'Falta de Explicação de Procedimentos',
        description: 'Pacientes não entendem tratamentos',
        problem: 'Profissionais não explicam procedimentos de forma clara e acessível.',
        solution: 'Implementar protocolos de explicação e material educativo.',
        tips: [
          'Crie material explicativo',
          'Use linguagem simples',
          'Demonstre procedimentos',
          'Ofereça segunda opinião'
        ],
        segment: 'Saúde',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '32',
        title: 'Problemas de Limpeza',
        description: 'Ambiente não transmite higiene',
        problem: 'Ambiente não transmite sensação de limpeza e higiene.',
        solution: 'Implementar protocolos rigorosos de limpeza e manutenção.',
        tips: [
          'Crie checklist de limpeza',
          'Monitore limpeza constantemente',
          'Use produtos de qualidade',
          'Mantenha ambiente organizado'
        ],
        segment: 'Saúde',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '33',
        title: 'Falta de Acessibilidade',
        description: 'Dificuldade para pessoas com deficiência',
        problem: 'Clínica não oferece acessibilidade adequada para pessoas com deficiência.',
        solution: 'Implementar rampas, elevadores e treinar equipe em atendimento inclusivo.',
        tips: [
          'Instale rampas e elevadores',
          'Treine equipe em inclusão',
          'Ofereça atendimento prioritário',
          'Adapte banheiros'
        ],
        segment: 'Saúde',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '34',
        title: 'Problemas de Comunicação',
        description: 'Informações não chegam aos pacientes',
        problem: 'Resultados de exames e informações importantes não chegam aos pacientes.',
        solution: 'Implementar sistema de comunicação eficiente e base de dados de pacientes.',
        tips: [
          'Crie base de dados de pacientes',
          'Implemente WhatsApp Business',
          'Envie resultados por email',
          'Mantenha comunicação ativa'
        ],
        segment: 'Saúde',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '35',
        title: 'Falta de Segurança',
        description: 'Ambiente não transmite segurança',
        problem: 'Clínica não transmite sensação de segurança e confiabilidade.',
        solution: 'Implementar sistema de segurança visível e treinar equipe.',
        tips: [
          'Instale câmeras de segurança',
          'Contrate segurança',
          'Treine equipe em segurança',
          'Implemente controle de acesso'
        ],
        segment: 'Saúde',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '36',
        title: 'Problemas de Estacionamento',
        description: 'Dificuldade para estacionar',
        problem: 'Pacientes não conseguem estacionar próximo à clínica.',
        solution: 'Implementar parcerias com estacionamentos e validação de tickets.',
        tips: [
          'Faça parceria com estacionamentos',
          'Ofereça validação de ticket',
          'Indique estacionamentos próximos',
          'Considere valet parking'
        ],
        segment: 'Saúde',
        priority: 'low',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '37',
        title: 'Falta de Conforto',
        description: 'Sala de espera desconfortável',
        problem: 'Sala de espera é desconfortável e não oferece distrações.',
        solution: 'Melhorar mobiliário da sala de espera e oferecer entretenimento.',
        tips: [
          'Melhore mobiliário',
          'Ofereça TV e revistas',
          'Mantenha temperatura adequada',
          'Ofereça água e café'
        ],
        segment: 'Saúde',
        priority: 'low',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '38',
        title: 'Problemas de Pagamento',
        description: 'Sistema de pagamento confuso',
        problem: 'Sistema de pagamento é confuso e não aceita diferentes formas.',
        solution: 'Implementar sistema de pagamento claro e aceitar diferentes formas.',
        tips: [
          'Implemente PIX e pagamentos digitais',
          'Aceite diferentes tipos de cartão',
          'Ofereça parcelamento',
          'Treine equipe para pagamentos'
        ],
        segment: 'Saúde',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '39',
        title: 'Falta de Especialização',
        description: 'Equipe sem especialização adequada',
        problem: 'Equipe não tem especialização adequada para casos complexos.',
        solution: 'Investir em treinamento e especialização da equipe.',
        tips: [
          'Invista em treinamento',
          'Contrate especialistas',
          'Faça parcerias com centros especializados',
          'Mantenha equipe atualizada'
        ],
        segment: 'Saúde',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '40',
        title: 'Problemas de Tecnologia',
        description: 'Equipamentos obsoletos',
        problem: 'Equipamentos são obsoletos e não oferecem qualidade adequada.',
        solution: 'Investir em equipamentos modernos e treinar equipe.',
        tips: [
          'Invista em equipamentos modernos',
          'Treine equipe em novos equipamentos',
          'Mantenha equipamentos atualizados',
          'Faça manutenção preventiva'
        ],
        segment: 'Saúde',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '41',
        title: 'Falta de Seguimento',
        description: 'Pacientes abandonam tratamento',
        problem: 'Pacientes abandonam tratamento por falta de seguimento.',
        solution: 'Implementar sistema de seguimento e lembretes.',
        tips: [
          'Implemente sistema de lembretes',
          'Faça contato regular',
          'Ofereça suporte emocional',
          'Monitore progresso'
        ],
        segment: 'Saúde',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '42',
        title: 'Problemas de Horário',
        description: 'Horários inadequados para pacientes',
        problem: 'Horários de funcionamento não atendem às necessidades dos pacientes.',
        solution: 'Ajustar horários de funcionamento e oferecer atendimento flexível.',
        tips: [
          'Ajuste horários de funcionamento',
          'Ofereça atendimento noturno',
          'Implemente plantão de fim de semana',
          'Ofereça atendimento emergencial'
        ],
        segment: 'Saúde',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: 'educacao',
    name: 'Educação',
    description: 'Escolas, cursos e treinamentos',
    icon: '🎓',
    color: 'bg-purple-500',
    items: [
      {
        id: '10',
        title: 'Falta de Individualização',
        description: 'Ensino padronizado demais',
        problem: 'Metodologia não considera as diferenças individuais dos alunos.',
        solution: 'Implementar ensino personalizado e metodologias adaptativas.',
        tips: [
          'Use metodologias adaptativas',
          'Ofereça suporte individual',
          'Avalie progresso personalizado',
          'Adapte conteúdo por aluno'
        ],
        segment: 'Educação',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '11',
        title: 'Falta de Feedback',
        description: 'Alunos não sabem como estão',
        problem: 'Alunos não recebem feedback claro sobre seu progresso e desenvolvimento.',
        solution: 'Implementar sistema de avaliação contínua e feedback regular.',
        tips: [
          'Implemente avaliação contínua',
          'Ofereça feedback regular',
          'Crie relatórios de progresso',
          'Mantenha comunicação com pais'
        ],
        segment: 'Educação',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '12',
        title: 'Infraestrutura Limitada',
        description: 'Recursos insuficientes',
        problem: 'Falta de recursos tecnológicos e infraestrutura adequada para o ensino.',
        solution: 'Investir em tecnologia educacional e melhorar infraestrutura.',
        tips: [
          'Invista em tecnologia educacional',
          'Melhore infraestrutura',
          'Ofereça recursos digitais',
          'Mantenha equipamentos atualizados'
        ],
        segment: 'Educação',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: 'servicos',
    name: 'Serviços',
    description: 'Consultorias e serviços profissionais',
    icon: '💼',
    color: 'bg-gray-500',
    items: [
      {
        id: '13',
        title: 'Falta de Transparência',
        description: 'Preços e processos não claros',
        problem: 'Clientes não entendem claramente os preços, processos e prazos dos serviços.',
        solution: 'Implementar comunicação transparente sobre preços, processos e prazos.',
        tips: [
          'Seja transparente com preços',
          'Explique processos claramente',
          'Defina prazos realistas',
          'Ofereça contratos claros'
        ],
        segment: 'Serviços',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '14',
        title: 'Falta de Resultados',
        description: 'Promessas não cumpridas',
        problem: 'Serviços não entregam os resultados prometidos ou esperados.',
        solution: 'Estabelecer expectativas realistas e acompanhar resultados.',
        tips: [
          'Estabeleça expectativas realistas',
          'Acompanhe resultados',
          'Ofereça garantias',
          'Comunique progresso'
        ],
        segment: 'Serviços',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '15',
        title: 'Falta de Comunicação',
        description: 'Cliente mal informado',
        problem: 'Falta de comunicação regular sobre o progresso e status dos serviços.',
        solution: 'Implementar sistema de comunicação regular e relatórios de progresso.',
        tips: [
          'Comunique regularmente',
          'Ofereça relatórios de progresso',
          'Responda rapidamente',
          'Use múltiplos canais'
        ],
        segment: 'Serviços',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '55',
        title: 'Falta de Especialização',
        description: 'Equipe sem conhecimento específico',
        problem: 'Equipe não tem especialização adequada para o tipo de serviço oferecido.',
        solution: 'Investir em treinamento e especialização da equipe.',
        tips: [
          'Invista em treinamento',
          'Contrate especialistas',
          'Faça parcerias estratégicas',
          'Mantenha equipe atualizada'
        ],
        segment: 'Serviços',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '56',
        title: 'Problemas de Prazo',
        description: 'Atrasos constantes na entrega',
        problem: 'Serviços constantemente atrasam, causando frustração nos clientes.',
        solution: 'Implementar gestão de projetos eficiente e comunicação proativa.',
        tips: [
          'Implemente gestão de projetos',
          'Comunique atrasos antecipadamente',
          'Estabeleça prazos realistas',
          'Monitore progresso constantemente'
        ],
        segment: 'Serviços',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '57',
        title: 'Falta de Suporte Pós-Venda',
        description: 'Sem acompanhamento após entrega',
        problem: 'Serviço termina na entrega, sem suporte ou acompanhamento posterior.',
        solution: 'Implementar sistema de suporte pós-venda e acompanhamento.',
        tips: [
          'Implemente suporte pós-venda',
          'Ofereça acompanhamento',
          'Mantenha contato regular',
          'Ofereça manutenção preventiva'
        ],
        segment: 'Serviços',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '58',
        title: 'Problemas de Qualidade',
        description: 'Qualidade inconsistente',
        problem: 'Qualidade do serviço varia dependendo de quem executa.',
        solution: 'Implementar padrões de qualidade e controle de processos.',
        tips: [
          'Implemente padrões de qualidade',
          'Controle processos rigorosamente',
          'Treine equipe constantemente',
          'Monitore qualidade'
        ],
        segment: 'Serviços',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '59',
        title: 'Falta de Inovação',
        description: 'Serviços ultrapassados',
        problem: 'Serviços não evoluem e ficam ultrapassados com o tempo.',
        solution: 'Investir em pesquisa e desenvolvimento e inovação.',
        tips: [
          'Invista em P&D',
          'Monitore tendências do mercado',
          'Inove constantemente',
          'Adapte-se às mudanças'
        ],
        segment: 'Serviços',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '60',
        title: 'Problemas de Escalabilidade',
        description: 'Não consegue crescer',
        problem: 'Serviço não consegue escalar para atender mais clientes.',
        solution: 'Implementar processos escaláveis e automação.',
        tips: [
          'Implemente processos escaláveis',
          'Automatize tarefas repetitivas',
          'Padronize procedimentos',
          'Use tecnologia para escalar'
        ],
        segment: 'Serviços',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '61',
        title: 'Falta de Documentação',
        description: 'Processos não documentados',
        problem: 'Processos e procedimentos não estão documentados adequadamente.',
        solution: 'Implementar sistema de documentação e conhecimento.',
        tips: [
          'Documente todos os processos',
          'Crie manuais de procedimentos',
          'Mantenha documentação atualizada',
          'Treine equipe na documentação'
        ],
        segment: 'Serviços',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '62',
        title: 'Problemas de Gestão',
        description: 'Falta de liderança eficiente',
        problem: 'Falta de liderança eficiente e gestão adequada dos projetos.',
        solution: 'Investir em capacitação de gestores e liderança.',
        tips: [
          'Capacite gestores',
          'Implemente metodologias ágeis',
          'Desenvolva liderança',
          'Monitore performance'
        ],
        segment: 'Serviços',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '63',
        title: 'Falta de Tecnologia',
        description: 'Processos manuais e ineficientes',
        problem: 'Processos são manuais e ineficientes, causando lentidão.',
        solution: 'Investir em tecnologia e automação de processos.',
        tips: [
          'Invista em tecnologia',
          'Automatize processos',
          'Use ferramentas digitais',
          'Mantenha-se atualizado'
        ],
        segment: 'Serviços',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '64',
        title: 'Problemas de Custo',
        description: 'Preços muito altos',
        problem: 'Preços são muito altos em relação ao valor oferecido.',
        solution: 'Otimizar processos para reduzir custos e melhorar valor.',
        tips: [
          'Otimize processos',
          'Reduza custos operacionais',
          'Melhore eficiência',
          'Ofereça mais valor'
        ],
        segment: 'Serviços',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '65',
        title: 'Falta de Marca',
        description: 'Sem identidade de marca',
        problem: 'Serviço não tem identidade de marca forte e reconhecível.',
        solution: 'Desenvolver estratégia de marca e posicionamento.',
        tips: [
          'Desenvolva identidade de marca',
          'Posicione-se no mercado',
          'Comunique valores claramente',
          'Construa reputação'
        ],
        segment: 'Serviços',
        priority: 'low',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    description: 'Startups e empresas de TI',
    icon: '💻',
    color: 'bg-indigo-500',
    items: [
      {
        id: '16',
        title: 'Complexidade Excessiva',
        description: 'Produtos difíceis de usar',
        problem: 'Produtos e serviços são muito complexos para o usuário final.',
        solution: 'Simplificar interfaces e processos, focando na experiência do usuário.',
        tips: [
          'Simplifique interfaces',
          'Teste com usuários reais',
          'Ofereça tutoriais',
          'Mantenha design intuitivo'
        ],
        segment: 'Tecnologia',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '17',
        title: 'Suporte Técnico',
        description: 'Atendimento inadequado',
        problem: 'Suporte técnico lento, ineficiente ou não resolve problemas.',
        solution: 'Melhorar qualidade do suporte técnico e implementar canais eficientes.',
        tips: [
          'Treine equipe de suporte',
          'Ofereça múltiplos canais',
          'Resolva problemas rapidamente',
          'Mantenha base de conhecimento'
        ],
        segment: 'Tecnologia',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '18',
        title: 'Falta de Documentação',
        description: 'Produtos mal documentados',
        problem: 'Produtos não possuem documentação clara ou tutorial adequado.',
        solution: 'Criar documentação completa e tutoriais interativos.',
        tips: [
          'Crie documentação completa',
          'Ofereça tutoriais interativos',
          'Mantenha documentação atualizada',
          'Use linguagem simples'
        ],
        segment: 'Tecnologia',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '66',
        title: 'Problemas de Performance',
        description: 'Sistemas lentos e instáveis',
        problem: 'Sistemas são lentos, instáveis e não atendem às necessidades de performance.',
        solution: 'Implementar otimizações de performance e monitoramento contínuo.',
        tips: [
          'Otimize código e banco de dados',
          'Implemente monitoramento',
          'Use CDN e cache',
          'Monitore métricas de performance'
        ],
        segment: 'Tecnologia',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '67',
        title: 'Falta de Segurança',
        description: 'Vulnerabilidades de segurança',
        problem: 'Sistemas apresentam vulnerabilidades de segurança e não protegem dados.',
        solution: 'Implementar práticas de segurança e auditorias regulares.',
        tips: [
          'Implemente autenticação forte',
          'Use HTTPS e criptografia',
          'Faça auditorias de segurança',
          'Mantenha sistemas atualizados'
        ],
        segment: 'Tecnologia',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '68',
        title: 'Problemas de Escalabilidade',
        description: 'Sistemas não crescem',
        problem: 'Sistemas não conseguem escalar para atender mais usuários.',
        solution: 'Implementar arquitetura escalável e automação de infraestrutura.',
        tips: [
          'Use arquitetura em nuvem',
          'Implemente automação',
          'Use containers e microserviços',
          'Monitore capacidade'
        ],
        segment: 'Tecnologia',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '69',
        title: 'Falta de Testes',
        description: 'Qualidade não testada',
        problem: 'Produtos não passam por testes adequados antes do lançamento.',
        solution: 'Implementar pipeline de testes automatizados e QA rigoroso.',
        tips: [
          'Implemente testes automatizados',
          'Use TDD e BDD',
          'Faça testes de integração',
          'Implemente CI/CD'
        ],
        segment: 'Tecnologia',
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '70',
        title: 'Problemas de DevOps',
        description: 'Processos manuais de deploy',
        problem: 'Processos de deploy são manuais e propensos a erros.',
        solution: 'Implementar práticas de DevOps e automação de pipeline.',
        tips: [
          'Implemente CI/CD',
          'Use containers e orquestração',
          'Automatize infraestrutura',
          'Monitore aplicações'
        ],
        segment: 'Tecnologia',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '71',
        title: 'Problemas de UX/UI',
        description: 'Interface confusa e feia',
        problem: 'Interface do usuário é confusa, feia e não intuitiva.',
        solution: 'Investir em design de UX/UI e pesquisa com usuários.',
        tips: [
          'Contrate designers de UX/UI',
          'Faça pesquisa com usuários',
          'Teste protótipos',
          'Itere baseado em feedback'
        ],
        segment: 'Tecnologia',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '72',
        title: 'Falta de Suporte',
        description: 'Usuários sem ajuda',
        problem: 'Usuários não recebem suporte adequado quando precisam de ajuda.',
        solution: 'Implementar sistema de suporte e documentação para usuários.',
        tips: [
          'Implemente sistema de suporte',
          'Crie documentação para usuários',
          'Ofereça chat ao vivo',
          'Mantenha base de conhecimento'
        ],
        segment: 'Tecnologia',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '73',
        title: 'Problemas de Compatibilidade',
        description: 'Não funciona em todos os dispositivos',
        problem: 'Produtos não funcionam em todos os dispositivos e navegadores.',
        solution: 'Implementar testes de compatibilidade e design responsivo.',
        tips: [
          'Teste em múltiplos dispositivos',
          'Use design responsivo',
          'Teste em diferentes navegadores',
          'Monitore compatibilidade'
        ],
        segment: 'Tecnologia',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '74',
        title: 'Falta de Inovação',
        description: 'Produtos ultrapassados',
        problem: 'Produtos não inovam e ficam ultrapassados com o tempo.',
        solution: 'Investir em pesquisa e desenvolvimento e acompanhar tendências.',
        tips: [
          'Invista em P&D',
          'Acompanhe tendências',
          'Inove constantemente',
          'Experimente novas tecnologias'
        ],
        segment: 'Tecnologia',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '75',
        title: 'Problemas de Gestão de Dados',
        description: 'Dados mal organizados',
        problem: 'Dados não estão organizados e não são utilizados adequadamente.',
        solution: 'Implementar estratégia de dados e governança.',
        tips: [
          'Implemente governança de dados',
          'Organize e limpe dados',
          'Use analytics e BI',
          'Proteja dados sensíveis'
        ],
        segment: 'Tecnologia',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '76',
        title: 'Falta de Agilidade',
        description: 'Processos burocráticos',
        problem: 'Processos de desenvolvimento são burocráticos e lentos.',
        solution: 'Implementar metodologias ágeis e cultura de inovação.',
        tips: [
          'Implemente metodologias ágeis',
          'Crie cultura de inovação',
          'Reduza burocracia',
          'Promova colaboração'
        ],
        segment: 'Tecnologia',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

interface KnowledgeBaseProps {
  userSegment?: string;
}

export default function KnowledgeBase({ userSegment }: KnowledgeBaseProps) {
  const [selectedSegment, setSelectedSegment] = useState<string>(userSegment || '');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSegments = knowledgeData.filter(segment =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    segment.items.some(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const currentSegment = knowledgeData.find(seg => seg.id === selectedSegment);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📚 Base de Conhecimento
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Descubra os problemas mais frequentes do seu segmento e como resolvê-los
        </p>
      </div>

      {/* Busca */}
      <div className="max-w-md mx-auto">
                  <input
            type="text"
            placeholder="Buscar por segmento ou problema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          />
      </div>

      {/* Segmentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSegments.map((segment) => (
          <Card
            key={segment.id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              selectedSegment === segment.id ? 'ring-2 ring-secondary-color' : ''
            }`}
            onClick={() => setSelectedSegment(segment.id)}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{segment.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {segment.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {segment.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {segment.items.length} problemas identificados
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detalhes do Segmento */}
      {currentSegment && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentSegment.icon} {currentSegment.name}
            </h2>
            <p className="text-gray-600">{currentSegment.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentSegment.items.map((item) => (
              <Card
                key={item.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedItem?.id === item.id ? 'ring-2 ring-secondary-color' : ''
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority === 'high' ? 'Alta' : 
                       item.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Detalhes do Item */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedItem.title}
                </h2>
                                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Problema */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🚨 Problema Identificado
                  </h3>
                  <p className="text-gray-700 bg-red-50 p-4 rounded-lg">
                    {selectedItem.problem}
                  </p>
                </div>

                {/* Solução */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ✅ Solução Recomendada
                  </h3>
                  <p className="text-gray-700 bg-green-50 p-4 rounded-lg">
                    {selectedItem.solution}
                  </p>
                </div>

                {/* Dicas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    💡 Dicas Práticas
                  </h3>
                  <ul className="space-y-2">
                    {selectedItem.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ações */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      // Aqui você pode implementar ação para aplicar a solução
                      alert('Funcionalidade de aplicação da solução será implementada!');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Aplicar Solução
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 