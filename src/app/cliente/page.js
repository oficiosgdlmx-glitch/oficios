'use client'
import { useState, useEffect } from 'react'
import { Search, MapPin, Star, Wrench, PlusCircle, X, ShieldCheck, Upload, MessageCircle, ArrowLeft, Radio } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BottomNav from '../../components/BottomNav'
import { supabase } from '../../lib/supabase'

export default function ClientePage() {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')
  const [workers, setWorkers] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('Plomería')
  const [oficioPersonalizado, setOficioPersonalizado] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [presupuesto, setPresupuesto] = useState('')
  const [ubicacion, setUbicacion] = useState('Guadalajara, Jalisco')
  const [fotoProblema, setFotoProblema] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const obtenerWorkers = async () => {
    try {
      setCargando(true)
      const { data } = await supabase.from('workers').select('*')
      if (data) setWorkers(data)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    obtenerWorkers()
  }, [])

  const workersFiltrados = workers.filter((exp) => {
    const nombre = exp.nombre ? exp.nombre.toLowerCase() : ''
    const oficio = exp.oficio ? exp.oficio.toLowerCase() : ''
    const query = busqueda.toLowerCase()
    return nombre.includes(query) || oficio.includes(query)
  })

  const publicarTrabajo = async (e) => {
    e.preventDefault()
    if (!titulo || !descripcion) return
    const categoriaFinal = categoria === 'Otro' ? oficioPersonalizado : categoria

    try {
      setEnviando(true)
      const { error } = await supabase.from('jobs').insert([
        { 
          titulo, 
          categoria: categoriaFinal, 
          descripcion, 
          presupuesto: presupuesto ? parseFloat(presupuesto) : null, 
          ubicacion, 
          foto_problema: fotoProblema ? fotoProblema.name : null,
          estado: 'pendiente'
        }
      ])
      if (error) {
        alert('Error al publicar la solicitud.')
      } else {
        alert('¡Solicitud publicada con éxito en la bolsa de servicios!')
        setTitulo('')
        setDescripcion('')
        setPresupuesto('')
        setFotoProblema(null)
        setModalAbierto(false)
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="h-full bg-gray-50 min-h-screen pb-24">
      {/* Header con Botón de Regresar */}
      <div className="bg-blue-600 p-5 text-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-700/60 hover:bg-blue-700 text-white p-2 rounded-xl transition cursor-pointer"
            title="Volver al inicio"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3 className="font-bold text-lg">¿Qué necesitas reparar hoy?</h3>
            <p className="text-xs text-blue-100">Directorio de profesionales verificados.</p>
          </div>
        </div>
        <button 
          onClick={() => setModalAbierto(true)}
          className="bg-white text-blue-600 text-xs font-bold px-3 py-2 rounded-xl shadow flex items-center gap-1 active:scale-95 transition cursor-pointer"
        >
          <PlusCircle size={16} /> Publicar
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Indicador Visual Discreto de Actividad en Vivo para el Cliente */}
        <div className="bg-white border border-gray-200 p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-200">
              <Radio size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping"></span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Red de Expertos Cercanos</p>
              <p className="text-[10px] text-gray-500">Profesionales listos para atender tu solicitud</p>
            </div>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-bold">
            Conectados
          </span>
        </div>

        {/* Buscador */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Busca por plomero, mecánico, electricista..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
          />
        </div>

        {/* Categorías */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Categorías de Oficios</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '🚰', query: 'Plomería' },
              { label: '⚡', query: 'Electricidad' },
              { label: '🧱', query: 'Albañilería' },
              { label: '🚗', query: 'Mecánico' }
            ].map((cat, i) => (
              <button 
                key={i} 
                onClick={() => setBusqueda(cat.query)}
                className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-2xl hover:bg-blue-50 transition active:scale-95 cursor-pointer"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Expertos */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3 text-sm">
            {busqueda ? `Resultados para "${busqueda}"` : 'Profesionales Disponibles'}
          </h3>
          
          {cargando ? (
            <p className="text-xs text-gray-500 text-center py-6">Cargando directorio...</p>
          ) : workersFiltrados.length > 0 ? (
            <div className="space-y-3">
              {workersFiltrados.map((exp, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">👨🏽‍🔧</div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-gray-800">{exp.nombre}</p>
                        <ShieldCheck size={14} className="text-blue-600" title="Verificado" />
                      </div>
                      <p className="text-xs text-gray-500">{exp.oficio} • <MapPin size={10} className="inline" /> {exp.ubicacion}</p>
                      <p className="text-xs text-yellow-500 font-medium mt-1">⭐ {exp.calificacion || '5.0'} ({exp.trabajos_realizados || '0'} trabajos)</p>
                    </div>
                  </div>
                  
                  <a 
                    href="https://wa.me/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle size={14} /> Contactar
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-6">No se encontraron profesionales con ese criterio.</p>
          )}
        </div>
      </div>

      {/* Modal Publicar Trabajo */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800 text-base">Publicar Solicitud de Servicio</h3>
              <button onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={publicarTrabajo} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700">Título del problema</label>
                <input 
                  type="text" 
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Fuga en llave de lavabo" 
                  required
                  className="w-full mt-1 p-2.5 border rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Categoría</label>
                <select 
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-xl text-sm bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Plomería">Plomería</option>
                  <option value="Electricidad">Electricidad</option>
                  <option value="Albañilería">Albañilería</option>
                  <option value="Mecánico">Mecánico</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Otro">Otro (Especializado)</option>
                </select>
              </div>

              {categoria === 'Otro' && (
                <div>
                  <label className="text-xs font-bold text-gray-700">Especifica tu oficio</label>
                  <input 
                    type="text" 
                    value={oficioPersonalizado}
                    onChange={(e) => setOficioPersonalizado(e.target.value)}
                    placeholder="Ej. Cerrajero, Dentista..." 
                    required
                    className="w-full mt-1 p-2.5 border rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-700">Descripción detallada</label>
                <textarea 
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe qué necesitas reparar..." 
                  required
                  rows="3"
                  className="w-full p-2.5 border rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Upload size={14} className="text-blue-600" /> Foto de evidencia del problema
                </label>
                <input 
                  type="file" 
                  onChange={(e) => setFotoProblema(e.target.files[0])}
                  className="w-full mt-1 text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-700">Presupuesto Inicial (MXN)</label>
                  <input 
                    type="number" 
                    value={presupuesto}
                    onChange={(e) => setPresupuesto(e.target.value)}
                    placeholder="Ej. 400" 
                    className="w-full mt-1 p-2.5 border rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Ubicación</label>
                  <input 
                    type="text" 
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    placeholder="Ej. Guadalajara, Jal." 
                    className="w-full mt-1 p-2.5 border rounded-xl text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={enviando}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition mt-2 text-sm cursor-pointer"
              >
                {enviando ? 'Publicando...' : 'Publicar Solicitud'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Disclaimer / Deslinde Legal */}
      <div className="px-4 pb-6 text-center">
        <p className="text-[10px] text-gray-400">
          * Oficios opera exclusivamente como directorio e intermediario tecnológico de conexión.
        </p>
      </div>

      <BottomNav role="cliente" />
    </div>
  )
}