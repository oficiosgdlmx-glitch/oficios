'use client'
import { useState } from 'react'
import { HelpCircle, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SoportePage() {
  const router = useRouter()
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)

  const manejarEnvio = (e) => {
    e.preventDefault()
    // Abre el cliente de correo predeterminado del usuario directo al correo oficial
    const mailtoLink = `mailto:oficios.gdl.mx@gmail.com?subject=Soporte Oficios: ${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`
    window.location.href = mailtoLink
    setEnviado(true)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 pb-24 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h1 className="text-sm font-bold flex items-center gap-2">
          <HelpCircle className="text-purple-400" size={18} /> Centro de Soporte
        </h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={14} /> Volver
        </button>
      </div>

      <div className="space-y-4">
        {/* Tarjeta de Correo Oficial */}
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600/20 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/30">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Atención por Correo Oficial</p>
              <a href="mailto:oficios.gdl.mx@gmail.com" className="text-xs text-purple-400 font-mono hover:underline">
                oficios.gdl.mx@gmail.com
              </a>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 pt-1">
            ¿Dudas, aclaraciones o reportes? Escríbenos directamente y te responderemos a la brevedad.
          </p>
        </div>

        {/* Formulario de Contacto */}
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl space-y-4">
          <h2 className="text-xs font-bold text-gray-300">Enviar Mensaje a Soporte</h2>

          {enviado ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="mx-auto text-emerald-400" size={32} />
              <p className="text-xs font-bold text-white">¡Redirigiendo a tu correo!</p>
              <p className="text-[11px] text-gray-400">Se ha abierto tu aplicación de correo para enviar el reporte a oficios.gdl.mx@gmail.com.</p>
              <button 
                onClick={() => setEnviado(false)}
                className="text-xs text-purple-400 font-bold hover:underline pt-2 cursor-pointer"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={manejarEnvio} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-300">Asunto del reporte o duda</label>
                <input 
                  type="text" 
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  placeholder="Ej. Problema con membresía o reporte de usuario" 
                  required
                  className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300">Descripción detallada</label>
                <textarea 
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Explícanos tu situación..." 
                  required
                  rows="4"
                  className="w-full mt-1 p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send size={14} /> Abrir Correo y Enviar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}