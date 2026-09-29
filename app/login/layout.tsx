import type { ReactNode } from 'react'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Ingresar',
  description: 'Acceso privado a Walking Lodge.',
  path: '/login',
  noIndex: true,
})

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children
}
