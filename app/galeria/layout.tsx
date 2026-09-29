import type { ReactNode } from 'react'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Galeria de la selva amazonica',
  description: 'Fotografias de Walking Lodge, el rio Madre de Dios, Lago Sandoval, fauna, bosque y actividades amazonicas.',
  path: '/galeria',
  image: '/images/lodge-night.webp',
})

export default function GaleriaLayout({ children }: { children: ReactNode }) {
  return children
}
