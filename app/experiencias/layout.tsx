import type { ReactNode } from 'react'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Experiencias y tours amazonicos',
  description: 'Programas de naturaleza y aventura desde Walking Lodge, cerca de Puerto Maldonado y la reserva de Tambopata.',
  path: '/experiencias',
  image: '/images/lago-sandoval.webp',
})

export default function ExperienciasLayout({ children }: { children: ReactNode }) {
  return children
}
