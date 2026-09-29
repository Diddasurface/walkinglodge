'use client'

import LoginPage from '@/components/pages/LoginPage'
import { useLang } from '@/components/LangProvider'

export default function Login() {
  const { lang } = useLang()
  return <LoginPage lang={lang} />
}
