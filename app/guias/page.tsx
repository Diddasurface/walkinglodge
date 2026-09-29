'use client'

import GuiasPage from '@/components/pages/GuiasPage'
import { useLang } from '@/components/LangProvider'

export default function Guias() {
  const { lang } = useLang()
  return <main><GuiasPage lang={lang} /></main>
}
