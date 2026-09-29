'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import type { Lang } from '@/lib/types'
import { T } from '@/lib/i18n'

const ACCENT = '#E5A547'

const NAV_ITEMS = [
  { key: 'home', href: '/' },
  { key: 'destinos', href: '/destinos' },
  { key: 'experiencias', href: '/experiencias' },
  { key: 'galeria', href: '/galeria' },
  { key: 'guias', href: '/guias' },
  { key: 'contacto', href: '/contacto' },
]

interface HeaderProps {
  lang: Lang
  setLang: (lang: Lang) => void
}

export default function Header({ lang, setLang }: HeaderProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [isLight,  setIsLight]    = useState(false)
  const [logoUrl, setLogoUrl]     = useState('')
  const { data: session } = useSession()
  const tr = T[lang]

  // Init theme from localStorage (or OS preference as fallback)
  useEffect(() => {
    const stored = localStorage.getItem('site-theme')
    const light = stored
      ? stored === 'light'
      : window.matchMedia('(prefers-color-scheme: light)').matches
    setIsLight(light)
    document.documentElement.classList.toggle('light', light)
  }, [])

  const toggleTheme = () => {
    const next = !isLight
    setIsLight(next)
    document.documentElement.classList.toggle('light', next)
    localStorage.setItem('site-theme', next ? 'light' : 'dark')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setLogoUrl(data?.logoUrl ?? ''))
      .catch(() => setLogoUrl(''))
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isHome = pathname === '/'

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''} ${!isHome ? 'header-solid' : ''}`}>
        <div className="header-inner">
          <Link href="/" className="brand">
            {logoUrl ? (
              <img src={logoUrl} alt="Walking Lodge" className="brand-logo" />
            ) : (
              <>
                <span className="brand-mark" aria-hidden="true">
                  <svg viewBox="0 0 32 32" width="28" height="28">
                    <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    <path
                      d="M2 16 H30 M16 2 Q22 16 16 30 Q10 16 16 2 M4 9 H28 M4 23 H28"
                      fill="none" stroke="currentColor" strokeWidth="1"
                    />
                  </svg>
                </span>
                <span className="brand-text">
                  <span className="brand-1">WALKING</span>
                  <span className="brand-2">LODGE</span>
                </span>
              </>
            )}
          </Link>

          <nav className="nav">
            {NAV_ITEMS.map((item, i) => {
              const label = tr.nav[i]
              const isActive = item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={isActive ? 'active' : ''}
                >
                  {label}
                  {isActive && (
                    <span className="nav-underline" style={{ background: ACCENT }} />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="header-actions">
            <button
              className="lang-toggle"
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              aria-label="Toggle language"
            >
              <span className={lang === 'es' ? 'active' : ''}>ES</span>
              <span className="divider">/</span>
              <span className={lang === 'en' ? 'active' : ''}>EN</span>
            </button>
            <button className="icon-btn" onClick={toggleTheme} aria-label={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'} title={isLight ? 'Modo oscuro' : 'Modo claro'}>
              {isLight ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
            </button>
            <button className="icon-btn" aria-label="Search">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            {session ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  href="/dashboard"
                  style={{ fontSize: '0.75rem', color: ACCENT, textDecoration: 'none', fontWeight: 600, letterSpacing: '0.05em' }}
                >
                  {lang === 'es' ? 'MI PANEL' : 'DASHBOARD'}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="icon-btn"
                  aria-label="Cerrar sesión"
                  title={lang === 'es' ? 'Cerrar sesión' : 'Sign out'}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link href="/login" className="icon-btn" aria-label="Iniciar sesión">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
              </Link>
            )}

            {/* Hamburger — visible only on mobile */}
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              <span className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
        <div className="header-progress" style={{ background: ACCENT }} />
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="mobile-nav">
          {NAV_ITEMS.map((item, i) => {
            const label = tr.nav[i]
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                style={isActive ? { color: ACCENT } : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span className="mobile-nav-num">0{i + 1}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="mobile-menu-footer">
          <button
            className="lang-toggle"
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          >
            <span className={lang === 'es' ? 'active' : ''}>ES</span>
            <span className="divider">/</span>
            <span className={lang === 'en' ? 'active' : ''}>EN</span>
          </button>
          <button className="icon-btn" onClick={toggleTheme} aria-label={isLight ? 'Modo oscuro' : 'Modo claro'} style={{ border: '1px solid var(--line)' }}>
            {isLight ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </button>
          <p className="mobile-menu-copy">© 2026 Walking Lodge</p>
        </div>
      </div>
    </>
  )
}
