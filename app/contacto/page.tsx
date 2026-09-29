'use client'

import ContactoPage from '@/components/pages/ContactoPage'
import { useLang } from '@/components/LangProvider'

export default function Contacto() {
  const { lang } = useLang()
  return <main><ContactoPage lang={lang} /></main>
}
