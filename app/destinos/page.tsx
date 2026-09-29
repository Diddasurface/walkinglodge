'use client'

import DestinosPage from '@/components/pages/DestinosPage'
import { useLang } from '@/components/LangProvider'

export default function Destinos() {
  const { lang } = useLang()
  return <main><DestinosPage lang={lang} /></main>
}
