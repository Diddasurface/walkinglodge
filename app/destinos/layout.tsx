import type { ReactNode } from 'react'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Actividades en Madre de Dios',
  description: 'Descubre canopy, Lago Sandoval, collpa de guacamayos, caminatas nocturnas y navegacion por el rio Madre de Dios.',
  path: '/destinos',
  image: '/images/route-boat-2.webp',
})

export default function DestinosLayout({ children }: { children: ReactNode }) {
  return children
}
