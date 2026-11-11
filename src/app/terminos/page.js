'use client'
import { ArrowLeft, ShieldCheck, MapPin, Camera, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TerminosPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 pb-24 max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h1 className="text-sm font-bold flex items-center gap-2">
          <ShieldCheck className="text-amber-400" size={18} /> Términos y Condiciones
        </h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={14} /> Volver
        </button>
      </div>

      <div className="space-y-4 text-xs text-gray-300 leading-relaxed bg-gray-900 p-5 rounded-2xl border border-gray-800">
        <section className="space-y-2">
          <h2 className="font-bold text-white text-sm">1. Naturaleza de la Plataforma</h2>
          <p>
            <strong>Oficios</strong> opera exclusivamente como una plataforma tecnológica de directorio e intermediario de conexión entre clientes y profesionales independientes. La plataforma no asume responsabilidad laboral, civil ni fiscal por los servicios prestados directamente entre particulares.
          </p>
        </section>

        <section className="space-y-2 pt-2 border-t border-gray-800">
          <h2 className="font-bold text-white text-sm flex items-center gap-1.5">
            <MapPin size={16} className="text-blue-400" /> 2. Permiso de Ubicación
          </h2>
          <p>
            La aplicación solicita acceso a tu ubicación geográfica (GPS) con el único propósito de mostrar solicitudes cercanas en la bolsa de servicios y facilitar la conexión local entre profesionales y clientes.
          </p>
        </section>

        <section className="space-y-2 pt-2 border-t border-gray-800">
          <h2 className="font-bold text-white text-sm flex items-center gap-1.5">
            <Camera size={16} className="text-green-400" /> 3. Permiso de Cámara y Archivos
          </h2>
          <p>
            Para subir evidencias fotográficas de los problemas a reparar o marcar el estado "Antes y Después", la plataforma requiere acceso temporal a la cámara y galería de tu dispositivo. Las imágenes se almacenan de forma segura para validar el servicio.
          </p>
        </section>

        <section className="space-y-2 pt-2 border-t border-gray-800">
          <h2 className="font-bold text-white text-sm flex items-center gap-1.5">
            <Lock size={16} className="text-amber-400" /> 4. Privacidad y Seguridad
          </h2>
          <p>
            Los datos de contacto compartidos (como WhatsApp y números telefónicos) se utilizan estrictamente para la coordinación del servicio acordado entre las partes una vez aceptada la solicitud.
          </p>
        </section>
      </div>
    </div>
  )
}