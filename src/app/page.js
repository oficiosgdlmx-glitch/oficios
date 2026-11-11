'use client'
import { useRouter } from 'next/navigation'
import { Search, Wrench, HelpCircle, CreditCard, ArrowRight, Shield, Hammer, FileText } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const modulos = [
    {
      titulo: 'Mi Oficio',
      descripcion: 'Consulta solicitudes activas, agendamiento y gestión de servicios.',
      ruta: '/trabajador',
      icono: Wrench,
      color: 'bg-green-600/20 text-green-400 border-green-500/30'
    },
    {
      titulo: 'Panel de Cliente',
      descripcion: 'Publica solicitudes, sube fotos de evidencia y busca profesionales.',
      ruta: '/cliente',
      icono: Search,
      color: 'bg-blue-600/20 text-blue-400 border-blue-500/30'
    },
    {
      titulo: 'Soporte y Ayuda',
      descripcion: 'Asistencia y resolución de incidencias en la plataforma.',
      ruta: '/soporte',
      icono: HelpCircle,
      color: 'bg-purple-600/20 text-purple-400 border-purple-500/30'
    },
    {
      titulo: 'Membresía Pro',
      descripcion: 'Activación de cuenta y métodos de pago seguros.',
      ruta: '/pagos',
      icono: CreditCard,
      color: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
    },
    {
      titulo: 'Términos y Condiciones',
      descripcion: 'Políticas de uso, avisos de privacidad y deslinde legal.',
      ruta: '/terminos',
      icono: FileText,
      color: 'bg-amber-600/20 text-amber-400 border-amber-500/30'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 pb-24 max-w-md mx-auto space-y-6">
      {/* Header con Logo y Herramientas */}
      <div className="text-center space-y-2 pt-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl border border-gray-800 text-green-400 shadow-inner mb-1">
          <Hammer size={28} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">OFICIOS</h1>
        <p className="text-xs text-gray-400">
          Red de conexión entre profesionales y clientes.
        </p>
      </div>

      {/* Lista de accesos directos principales */}
      <div className="space-y-3 pt-2">
        {modulos.map((mod, index) => {
          const Icon = mod.icono
          return (
            <div 
              key={index}
              onClick={() => router.push(mod.ruta)}
              className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center justify-between hover:border-gray-700 transition cursor-pointer group shadow-sm"
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${mod.color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-green-400 transition">{mod.titulo}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{mod.descripcion}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-600 group-hover:text-white transition flex-shrink-0 ml-2" />
            </div>
          )
        })}
      </div>

      {/* Acceso de Administración Muy Discreto con clave MikaMoy */}
      <div className="pt-6 border-t border-gray-900 flex justify-between items-center text-xs">
        <p className="text-[10px] text-gray-600">© Oficios - Intermediario Tecnológico</p>
        <button 
          onClick={() => router.push('/admin')}
          className="text-gray-600 hover:text-gray-400 flex items-center gap-1 transition cursor-pointer font-medium"
        >
          <Shield size={12} /> Admin
        </button>
      </div>
    </div>
  )
}