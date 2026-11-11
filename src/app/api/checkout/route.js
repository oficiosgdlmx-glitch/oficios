import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key', {
  apiVersion: '2023-10-16',
})

export async function POST(req) {
  try {
    const { plan, email } = await req.json()

    // Creamos la sesión de pago en Stripe para la Membresía Pro ($299 MXN)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: 'Membresía Pro - Oficios',
              description: 'Acceso ilimitado a la bolsa de servicios y cero comisiones.',
            },
            unit_amount: 29900, // $299.00 MXN en centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/pagos?success=true`,
      cancel_url: `${req.headers.get('origin')}/pagos?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Error en Stripe Checkout:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}