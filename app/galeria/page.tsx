'use client'

import GaleriaPage from '@/components/pages/GaleriaPage'
import { useLang } from '@/components/LangProvider'

export default function Galeria() {
  const { lang } = useLang()
  return <main><GaleriaPage lang={lang} /></main>
}
