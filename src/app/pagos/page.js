'use client'
import { useState } from 'react'
import { CreditCard, ArrowLeft, CheckCircle, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PagosPage() {
  const router = useRouter()
  const [metodo, setMetodo] = useState('tarjeta')
  const [procesando, setProcesando] = useState(false)

  const manejarPagoStripe = async (e) => {
    e.preventDefault()
    setProcesando(true)

    if (metodo === 'spei') {
      alert('Guarda tu referencia SPEI para completar el depósito interbancario.')
      setProcesando(false)
      return
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'Pro' }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url // Redirige al Checkout oficial de Stripe
      } else {
        alert('Error al conectar con la pasarela de pagos.')
        setProcesando(false)
      }
    } catch (err) {
      console.error('Error:', err)
      setProcesando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 pb-24 max-w-md mx-auto space-y-6">
      {/* Header con Botón de Regresar */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/')}
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-xl transition cursor-pointer border border-gray-700"
            title="Volver al inicio"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-sm font-bold">Membresía Pro</h1>
            <p className="text-[11px] text-gray-400">Activación mediante Stripe</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Resumen del Plan */}
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Plan Mensual Pro</span>
            <span className="text-sm font-bold text-emerald-400">$299 MXN / mes</span>
          </div>
          <p className="text-[11px] text-gray-400">
            Procesamiento seguro cifrado de extremo a extremo mediante Stripe.
          </p>
        </div>

        {/* Selección de Método */}
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-4">
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => setMetodo('tarjeta')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${metodo === 'tarjeta' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
            >
              💳 Tarjeta (Stripe)
            </button>
            <button 
              type="button"
              onClick={() => setMetodo('spei')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${metodo === 'spei' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
            >
              🏦 Transferencia SPEI
            </button>
          </div>

          <form onSubmit={manejarPagoStripe} className="space-y-4 pt-2">
            {metodo === 'spei' && (
              <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 text-center space-y-2">
                <p className="text-xs font-bold text-white">CLABE Interbancaria SPEI</p>
                <p className="text-sm font-mono text-emerald-400 font-bold bg-gray-900 p-2 rounded border border-gray-700">6461 8015 2000 1234 56</p>
                <p className="text-[11px] text-gray-400">Banco STP • Referencia: OFICIOS-PRO</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={procesando}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock size={14} /> {procesando ? 'Conectando con Stripe...' : metodo === 'tarjeta' ? 'Pagar con Tarjeta Segura (Stripe)' : 'Confirmar Referencia SPEI'}
            </button>
          </form>
        </div>
      </div>

      {/* Disclaimer / Deslinde Legal */}
      <div className="text-center pt-2">
        <p className="text-[10px] text-gray-500 leading-relaxed">
          * <strong className="text-gray-400">Aviso Legal:</strong> Las transacciones con tarjeta son procesadas de manera segura por Stripe. Oficios opera exclusivamente como plataforma tecnológica de directorio e intermediario.
        </p>
      </div>
    </div>
  )
}