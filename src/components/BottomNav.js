'use client'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Wrench, Shield, HelpCircle, User } from 'lucide-react'

export default function BottomNav({ role = 'cliente' }) {
  const router = useRouter()
  const pathname = usePathname()

  const tabsCliente = [
    { label: 'Explorar', path: '/cliente', icon: Search },
    { label: 'Soporte', path: '/soporte', icon: HelpCircle },
  ]

  const tabsTrabajador = [
    { label: 'Radar', path: '/trabajador', icon: Wrench },
    { label: 'Soporte', path: '/soporte', icon: HelpCircle },
  ]

  const tabs = role === 'trabajador' ? tabsTrabajador : tabsCliente

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 py-2 px-6 flex justify-around items-center z-40 max-w-md mx-auto shadow-2xl">
      {tabs.map((tab, index) => {
        const Icon = tab.icon
        const activo = pathname === tab.path

        return (
          <button
            key={index}
            onClick={() => router.push(tab.path)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
              activo ? 'text-blue-400 font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        )
      })}

      {/* Botón rápido al Admin para tenerlo siempre accesible */}
      <button
        onClick={() => router.push('/admin')}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-gray-400 hover:text-yellow-400 transition cursor-pointer"
        title="Admin"
      >
        <Shield size={20} />
        <span className="text-[10px]">Admin</span>
      </button>
    </div>
  )
}