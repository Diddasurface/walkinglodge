'use client'

import ExperienciasPage from '@/components/pages/ExperienciasPage'
import { useLang } from '@/components/LangProvider'

export default function Experiencias() {
  const { lang } = useLang()
  return <main><ExperienciasPage lang={lang} /></main>
}
