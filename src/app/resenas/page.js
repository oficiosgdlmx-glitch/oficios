'use client'
import { useState } from 'react'
import { Star, ShieldCheck, ArrowLeft, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function ResenasPage({ jobId, workerId, onCompletado }) {
  const router = useRouter()
  const [calificacion, setCalificacion] = useState(5)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviarReseña = async (e) => {
    e.preventDefault()
    if (!comentario) {
      alert('Por favor escribe un breve comentario sobre el servicio.')
      return
    }

    try {
      setEnviando(true)
      // 1. Guardar la reseña en la tabla reviews
      const { error: errorReseña } = await supabase.from('reviews').insert([
        { 
          job_id: jobId || 1, 
          worker_id: workerId || 1, 
          calificacion, 
          comentario 
        }
      ])

      if (errorReseña) {
        console.error('Error al guardar reseña:', errorReseña.message)
      }

      // 2. Incrementar el contador de trabajos realizados del trabajador y actualizar promedio
      const { data: workerData } = await supabase.from('workers').select('trabajos_realizados, calificacion').eq('id', workerId || 1).single()
      
      if (workerData) {
        const nuevosTrabajos = (workerData.trabajos_realizados || 0) + 1
        await supabase.from('workers').update({ 
          trabajos_realizados: nuevosTrabajos,
          calificacion: ((workerData.calificacion || 5.0) + calificacion) / 2 // Promedio simple en vivo
        }).eq('id', workerId || 1)
      }

      alert('¡Gracias por tu calificación! La reputación del profesional ha sido actualizada.')
      if (onCompletado) onCompletado()
      else router.push('/cliente')

    } catch (err) {
      console.error('Error:', err)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-bold text-gray-800 text-base flex items-center gap-1.5">
          <Star className="text-yellow-500 fill-yellow-500" size={18} /> Calificar Servicio
        </h3>
        <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
          Oficios Verificados
        </span>
      </div>

      <form onSubmit={enviarReseña} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-2">Selecciona tu calificación (1 a 5 Estrellas)</label>
          <div className="flex justify-center gap-2 py-2 bg-gray-50 rounded-xl border border-gray-100">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setCalificacion(num)}
                className="p-1 transition active:scale-90 cursor-pointer"
              >
                <Star 
                  size={28} 
                  className={num <= calificacion ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700">Comentario u opinión sobre el trabajo</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="¿Qué tal quedó la reparación? ¿Puntualidad y limpieza?"
            rows="3"
            required
            className="w-full mt-1 p-3 border rounded-xl text-xs text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition text-sm cursor-pointer"
        >
          {enviando ? 'Guardando calificación...' : 'Enviar Calificación y Cerrar Servicio'}
        </button>
      </form>
    </div>
  )
}