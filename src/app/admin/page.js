'use client'
import { useState, useEffect } from 'react'
import { Shield, Lock, CheckCircle, AlertTriangle, Trash2, ArrowLeft, Users, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const router = useRouter()
  const [clave, setClave] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [workers, setWorkers] = useState([])
  const [jobs, setJobs] = useState([])
  const [cargando, setCargando] = useState(false)

  const verificarClave = (e) => {
    e.preventDefault()
    if (clave === 'MikaMoy') {
      setAutenticado(true)
      cargarDatosAdmin()
    } else {
      alert('Clave de administración incorrecta.')
    }
  }

  const cargarDatosAdmin = async () => {
    try {
      setCargando(true)
      const { data: wData } = await supabase.from('workers').select('*')
      const { data: jData } = await supabase.from('jobs').select('*')
      if (wData) setWorkers(wData)
      if (jData) setJobs(jData)
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  const eliminarTrabajo = async (id) => {
    if (confirm('¿Eliminar esta solicitud de la plataforma?')) {
      await supabase.from('jobs').delete().eq('id', id)
      cargarDatosAdmin()
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <Shield className="text-yellow-400" size={20} />
          <h1 className="text-sm font-bold">Panel de Administración</h1>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="bg-gray-800 hover:bg-gray-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={14} /> Volver
        </button>
      </div>

      {!autenticado ? (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="text-center space-y-2">
            <Lock className="mx-auto text-yellow-400" size={32} />
            <h2 className="text-sm font-bold">Acceso Restringido</h2>
            <p className="text-xs text-gray-400">Ingresa la clave de supervisor para continuar.</p>
          </div>

          <form onSubmit={verificarClave} className="space-y-3">
            <input 
              type="password" 
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Contraseña de admin" 
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button 
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-gray-950 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
            >
              Desbloquear Panel
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400">Total Profesionales</p>
              <p className="text-lg font-bold text-emerald-400">{workers.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Solicitudes Registradas</p>
              <p className="text-lg font-bold text-blue-400">{jobs.length}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-300">Gestión de Solicitudes</h3>
            {cargando ? (
              <p className="text-xs text-gray-500 text-center py-4">Cargando registros...</p>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="bg-gray-900 border border-gray-800 p-3.5 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">{job.titulo}</p>
                    <p className="text-gray-400 text-[10px]">{job.categoria} • Estatus: {job.estado}</p>
                  </div>
                  <button 
                    onClick={() => eliminarTrabajo(job.id)}
                    className="bg-red-950/40 text-red-400 p-2 rounded-lg border border-red-900/40 hover:bg-red-900/40 cursor-pointer"
                    title="Eliminar solicitud"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-4">No hay solicitudes en la base de datos.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}