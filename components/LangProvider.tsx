'use client'

import { createContext, useContext, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Lang } from '@/lib/types'
import Header from './Header'
import Footer from './Footer'

const AUTH_PATHS = ['/login', '/registro', '/recuperar', '/dashboard']

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextValue>({ lang: 'es', setLang: () => {} })

export function useLang() {
  return useContext(LangContext)
}

interface LangProviderProps {
  children: React.ReactNode
}

export default function LangProvider({ children }: LangProviderProps) {
  const [lang, setLang] = useState<Lang>('es')
  const pathname = usePathname()
  const isAuth = AUTH_PATHS.includes(pathname)

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {!isAuth && <Header lang={lang} setLang={setLang} />}
      {children}
      {!isAuth && <Footer lang={lang} />}
    </LangContext.Provider>
  )
}
