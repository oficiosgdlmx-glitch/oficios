'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TestEnvPage() {
  const router = useRouter()
  const [estadoSupabase, setEstadoSupabase] = useState('Verificando...')
  const [estadoStripe, setEstadoStripe] = useState('Verificando...')
  const [errorSupabase, setErrorSupabase] = useState(false)

  useEffect(() => {
    async function probarConexiones() {
      // 1. Probar Supabase haciendo una consulta rápida a la tabla workers
      try {
        const { data, error } = await supabase.from('workers').select('id').limit(1)
        if (error) {
          setErrorSupabase(true)
          setEstadoSupabase(`Error: ${error.message}`)
        } else {
          setEstadoSupabase('¡Conectado con éxito a Supabase!')
        }
      } catch (err) {
        setErrorSupabase(true)
        setEstadoSupabase(`Excepción: ${err.message}`)
      }

      // 2. Verificar llaves públicas de Stripe en el navegador
      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      if (stripeKey && stripeKey.startsWith('pk_')) {
        setEstadoStripe('¡Llave pública de Stripe detectada correctamente!')
      } else {
        setEstadoStripe('Advertencia: Falta la llave pública de Stripe o no empieza con pk_')
      }
    }

    probarConexiones()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h1 className="text-sm font-bold">Diagnóstico de Conexiones</h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={14} /> Volver
        </button>
      </div>

      <div className="space-y-4">
        {/* Test Supabase */}
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-2">
          <p className="text-xs font-bold text-gray-400">Base de Datos (Supabase):</p>
          <div className="flex items-center gap-2">
            {errorSupabase ? (
              <AlertTriangle className="text-red-400" size={18} />
            ) : (
              <CheckCircle2 className="text-emerald-400" size={18} />
            )}
            <p className={`text-xs font-medium ${errorSupabase ? 'text-red-400' : 'text-emerald-400'}`}>
              {estadoSupabase}
            </p>
          </div>
        </div>

        {/* Test Stripe */}
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-2">
          <p className="text-xs font-bold text-gray-400">Pasarela de Pagos (Stripe Frontend):</p>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-blue-400" size={18} />
            <p className="text-xs font-medium text-blue-300">
              {estadoStripe}
            </p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 text-center">
        * Si ambos indicadores responden positivamente, tus variables de entorno están correctamente leídas por Next.js.
      </p>
    </div>
  )
}