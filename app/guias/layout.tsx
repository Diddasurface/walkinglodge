import type { ReactNode } from 'react'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Guias locales de Madre de Dios',
  description: 'Conoce a los guias locales que acompañan las actividades de naturaleza y fauna de Walking Lodge.',
  path: '/guias',
})

export default function GuiasLayout({ children }: { children: ReactNode }) {
  return children
}
