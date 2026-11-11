import './globals.css'

export const metadata = {
  title: 'Oficios - Red de Profesionales',
  description: 'Directorio e intermediario tecnológico.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Oficios',
  },
}

export const viewport = {
  themeColor: '#030712',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}