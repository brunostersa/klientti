import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    // Inicializar Stripe apenas quando necessário
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil' as any,
    });

    const { plan, userId, userEmail, successUrl, cancelUrl } = await request.json();

    // Definir preços dos planos
    const planPrices = {
      starter: {
        price: 17990, // R$ 179,90 em centavos
        name: 'Starter',
        description: 'Plano Starter - Ideal para pequenos negócios que estão começando'
      },
      premium: {
        price: 24990, // R$ 249,90 em centavos
        name: 'Premium',
        description: 'Plano Premium - Para empresas em crescimento com acesso ao grupo premium'
      },
      pro: {
        price: 47990, // R$ 479,90 em centavos
        name: 'Pro',
        description: 'Plano Pro - Para empresas que querem dominar o mercado'
      }
    };

    const selectedPlan = planPrices[plan as keyof typeof planPrices];
    
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      );
    }

    // Criar produto no Stripe
    let product;
    try {
      // Tentar encontrar produto existente
      const products = await stripe.products.list({ limit: 100 });
      product = products.data.find(p => p.name === selectedPlan.name);
      
      if (!product) {
        // Criar novo produto
        product = await stripe.products.create({
          name: selectedPlan.name,
          description: selectedPlan.description,
        });
      }
    } catch (error) {
      console.error('Erro ao criar/encontrar produto:', error);
      return NextResponse.json(
        { error: 'Erro ao configurar produto' },
        { status: 500 }
      );
    }

    // Criar preço no Stripe
    let price;
    try {
      const prices = await stripe.prices.list({ 
        product: product.id,
        limit: 100 
      });
      
      price = prices.data.find(p => 
        p.unit_amount === selectedPlan.price && 
        p.currency === 'brl' &&
        p.recurring?.interval === 'month'
      );
      
      if (!price) {
        // Criar novo preço
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: selectedPlan.price,
          currency: 'brl',
          recurring: {
            interval: 'month',
          },
        });
      }
    } catch (error) {
      console.error('Erro ao criar/encontrar preço:', error);
      return NextResponse.json(
        { error: 'Erro ao configurar preço' },
        { status: 500 }
      );
    }

    // Criar sessão de checkout com período de teste
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 7, // 7 dias de teste grátis
      },
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/planos`,
      customer_email: userEmail,
      metadata: {
        userId,
        plan,
      },
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 