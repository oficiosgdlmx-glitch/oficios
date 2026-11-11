'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wrench, User, FileText, Camera, ShieldCheck, ArrowLeft, HelpCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function RegistroPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [oficio, setOficio] = useState('Plomero')
  const [oficioPersonalizado, setOficioPersonalizado] = useState('')
  const [zona, setZona] = useState('Guadalajara, Jalisco')
  
  // Archivos y verificación
  const [ine, setIne] = useState(null)
  const [selfie, setSelfie] = useState(null)
  const [comprobante, setComprobante] = useState(null)
  const [cartaPolicia, setCartaPolicia] = useState(null)
  const [respuestaTest, setRespuestaTest] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mostrarTutorial, setMostrarTutorial] = useState(false)

  const registrarExperto = async (e) => {
    e.preventDefault()
    const especialidadFinal = oficio === 'Otro' ? oficioPersonalizado : oficio
    if (!nombre || !respuestaTest || !ine) {
      alert('Por favor completa los campos obligatorios y adjunta tu INE.')
      return
    }

    try {
      setCargando(true)
      const { error } = await supabase
        .from('trabajadores')
        .insert([
          { 
            nombre, 
            oficio: especialidadFinal, 
            ubicacion: zona, 
            estado_verificacion: 'pendiente_revision',
            test_respuesta: respuestaTest,
            documento_ine: ine ? ine.name : null,
            selfie_url: selfie ? selfie.name : null,
            comprobante_domicilio: comprobante ? comprobante.name : null,
            carta_policia: cartaPolicia ? cartaPolicia.name : null
          }
        ])

      if (error) {
        console.error('Error:', error.message)
        alert('Error al registrarse en la red.')
      } else {
        alert('¡Registro enviado con éxito! Tu perfil pasará a revisión del Administrador para su activación.')
        router.push('/')
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="h-full bg-gray-50 min-h-screen p-6 flex flex-col justify-center max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft size={16} /> Volver
        </button>
        <button 
          onClick={() => setMostrarTutorial(!mostrarTutorial)}
          className="text-xs text-blue-600 font-bold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
        >
          <HelpCircle size={14} /> ¿Cómo funciona el registro?
        </button>
      </div>

      {mostrarTutorial && (
        <div className="bg-blue-600 text-white p-4 rounded-2xl mb-4 text-xs space-y-2 shadow-md">
          <p className="font-bold">Guía rápida para Expertos:</p>
          <p>1. Llena tus datos reales y cobertura (ahora disponible en todo el país).</p>
          <p>2. Sube tu INE y comprobante para garantizar la seguridad de la comunidad.</p>
          <p>3. Responde el test psicológico/técnico. El Administrador revisará tu perfil para activarlo.</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Registro de Nuevo Profesional</h2>
          <p className="text-xs text-gray-500 mt-1">Únete a la red nacional de Oficios con verificación de identidad.</p>
        </div>

        <form onSubmit={registrarExperto} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700">Nombre completo</label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Roberto Carlos Garza" 
              required
              className="w-full mt-1 p-3 border rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-gray-700">Oficio o Especialidad</label>
              <select 
                value={oficio}
                onChange={(e) => setOficio(e.target.value)}
                className="w-full mt-1 p-3 border rounded-xl text-sm bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Plomero">Plomero</option>
                <option value="Electricista">Electricista</option>
                <option value="Albañil">Albañil</option>
                <option value="Limpieza">Limpieza</option>
                <option value="Mecánico">Mecánico</option>
                <option value="Dentista">Dentista / Salud</option>
                <option value="Otro">Otro (Especificar)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">Cobertura (Estado / Ciudad)</label>
              <input 
                type="text" 
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                placeholder="Ej. Monterrey, N.L." 
                required
                className="w-full mt-1 p-3 border rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {oficio === 'Otro' && (
            <div>
              <label className="text-xs font-bold text-gray-700">Especifica tu oficio o profesión</label>
              <input 
                type="text" 
                value={oficioPersonalizado}
                onChange={(e) => setOficioPersonalizado(e.target.value)}
                placeholder="Ej. Cerrajero, Técnico en refrigeración..." 
                required
                className="w-full mt-1 p-3 border rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Documentos de Identidad Obligatorios y Opcionales */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <ShieldCheck size={14} className="text-blue-600" /> Verificación de Seguridad
            </p>
            
            <div>
              <label className="text-[11px] font-bold text-gray-600">INE o Identificación Oficial (Obligatorio)</label>
              <input type="file" onChange={(e) => setIne(e.target.files[0])} required className="w-full mt-1 text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600">Comprobante de Domicilio</label>
              <input type="file" onChange={(e) => setComprobante(e.target.files[0])} className="w-full mt-1 text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600">Carta de Policía (Opcional)</label>
              <input type="file" onChange={(e) => setCartaPolicia(e.target.files[0])} className="w-full mt-1 text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700" />
            </div>
          </div>

          {/* Test Psicológico / Técnico */}
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-2">
            <label className="text-xs font-bold text-blue-900 block">
              Test Técnico y Psicológico: ¿Cómo manejas un desacuerdo con un cliente sobre el presupuesto de materiales?
            </label>
            <textarea 
              value={respuestaTest}
              onChange={(e) => setRespuestaTest(e.target.value)}
              placeholder="Explica tu metodología profesional..."
              required
              rows="3"
              className="w-full p-2.5 bg-white border border-blue-200 rounded-xl text-xs text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition text-sm"
          >
            {cargando ? 'Enviando a revisión...' : 'Enviar Registro para Aprobación'}
          </button>
        </form>
      </div>
    </div>
  )
}