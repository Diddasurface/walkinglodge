'use client'

import { SECTION_TITLE } from '../_lib/constants'
import { useTheme } from '../_lib/theme'
import type { Section } from '../_lib/types'

export function Topbar({ section, lang, onMenuClick }: {
  section: Section
  lang: string
  onMenuClick: () => void
}) {
  const { theme, toggle } = useTheme()
  const t = SECTION_TITLE[section]

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between pl-4 pr-4 md:pl-6 md:pr-6 py-4 bg-slate-50/90 dark:bg-[#0b0c0d]/90 backdrop-blur border-b border-slate-200 dark:border-white/6 shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/6 transition-colors shrink-0"
          aria-label="Abrir menú"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div>
          <p className="text-gray-400 dark:text-zinc-600 text-[11px] uppercase tracking-wider">
            {lang === 'es' ? 'Administración' : 'Administration'}
          </p>
          <h1
            className="text-gray-900 dark:text-white text-base font-semibold mt-0.5"
            style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.04em' }}
          >
            {lang === 'es' ? t.es : t.en}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Light / dark toggle */}
        <button
          onClick={toggle}
          title={theme === 'dark'
            ? (lang === 'es' ? 'Cambiar a modo claro' : 'Switch to light mode')
            : (lang === 'es' ? 'Cambiar a modo oscuro' : 'Switch to dark mode')}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/6 transition-colors"
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-400 dark:text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          {lang === 'es' ? 'Sistema activo' : 'System active'}
        </div>
      </div>
    </header>
  )
}
