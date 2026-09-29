'use client'

import { signOut } from 'next-auth/react'
import { NAV } from '../_lib/constants'
import { Icon } from '../_ui/Icon'
import type { Section } from '../_lib/types'

export function Sidebar({ section, setSection, session, lang, open, onClose }: {
  section: Section
  setSection: (s: Section) => void
  session: any
  lang: string
  open: boolean
  onClose: () => void
}) {
  const handleNav = (id: Section) => {
    setSection(id)
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col
        bg-white dark:bg-[#0b0c0d]
        border-r border-slate-200 dark:border-white/[0.06]
        transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>

        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 py-[17px] border-b border-slate-200 dark:border-white/[0.06] shrink-0">
          <div className="w-7 h-7 rounded-md bg-[#E5A547] flex items-center justify-center shrink-0">
            <span className="text-black font-bold text-[10px]" style={{ fontFamily: 'var(--font-oswald)' }}>AE</span>
          </div>
          <div className="min-w-0">
            <p
              className="text-gray-900 dark:text-white text-xs font-semibold leading-none truncate"
              style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.05em' }}
            >
              AMAZON EXP.
            </p>
            <p className="text-gray-400 dark:text-zinc-600 text-[10px] mt-0.5">
              {lang === 'es' ? 'Panel de admin' : 'Admin panel'}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-px">
          {NAV.map(({ id, es, en, icon, soon }) => {
            const active = section === id
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-left transition-colors ${
                  active
                    ? 'bg-[#E5A547]/10 text-[#E5A547]'
                    : 'text-gray-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon d={icon} cls="w-[15px] h-[15px] shrink-0" />
                <span className="flex-1 truncate">{lang === 'es' ? es : en}</span>
                {soon && (
                  <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                    soon
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-2.5 border-t border-slate-200 dark:border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-[#E5A547]/20 flex items-center justify-center shrink-0 text-[#E5A547] text-xs font-bold">
              {session?.user?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 dark:text-white text-xs font-medium truncate">{session?.user?.name}</p>
              <p className="text-gray-400 dark:text-zinc-600 text-[10px] truncate">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <a
              href="/"
              className="flex-1 text-center text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white text-xs py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors"
            >
              ← {lang === 'es' ? 'Inicio' : 'Home'}
            </a>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex-1 text-gray-500 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 text-xs py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/[0.06] transition-colors"
            >
              {lang === 'es' ? 'Salir' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
