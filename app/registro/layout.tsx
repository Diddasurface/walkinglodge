import type { ReactNode } from 'react'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Registro',
  description: 'Registro de usuarios de Walking Lodge.',
  path: '/registro',
  noIndex: true,
})

export default function RegistroLayout({ children }: { children: ReactNode }) {
  return children
}
