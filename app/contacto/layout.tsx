import type { ReactNode } from 'react'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Contacto y reservas',
  description: 'Consulta disponibilidad y organiza tu estadia en Walking Lodge, a dos horas rio abajo de Puerto Maldonado.',
  path: '/contacto',
  image: '/images/lodge-day.webp',
})

export default function ContactoLayout({ children }: { children: ReactNode }) {
  return children
}
