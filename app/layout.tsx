import type { Metadata } from 'next'
import { Oswald, Inter } from 'next/font/google'
import './globals.css'
import LangProvider from '@/components/LangProvider'
import SessionProvider from '@/components/providers/SessionProvider'

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Walking Lodge - Madre de Dios',
  description:
    'Lodge amazonico a dos horas rio abajo desde Puerto Maldonado, con actividades de naturaleza, canopy, fauna y experiencias en Madre de Dios.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${oswald.variable} ${inter.variable}`}>
      <body>
        <SessionProvider>
          <LangProvider>{children}</LangProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
