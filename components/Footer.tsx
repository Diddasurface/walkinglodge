import Link from 'next/link'
import { T } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

const ACCENT = '#E5A547'

interface FooterProps {
  lang: Lang
}

export default function Footer({ lang }: FooterProps) {
  const tr = T[lang]

  const cols = [
    { href: '/destinos', label: tr.nav[1] },
    { href: '/experiencias', label: tr.nav[2] },
    { href: '/galeria', label: tr.nav[3] },
    { href: '/guias', label: tr.nav[4] },
    { href: '/contacto', label: tr.nav[5] },
  ]

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span style={{ color: ACCENT }}>
            <svg viewBox="0 0 32 32" width="22" height="22">
              <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path
                d="M2 16 H30 M16 2 Q22 16 16 30 Q10 16 16 2 M4 9 H28 M4 23 H28"
                fill="none" stroke="currentColor" strokeWidth="1"
              />
            </svg>
          </span>
          <span>WALKING LODGE</span>
        </div>
        <div className="footer-cols">
          {cols.map((c) => (
            <Link key={c.href} href={c.href}>{c.label}</Link>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Walking Lodge</span>
        <span>{tr.footerCopy}</span>
        <span>MADRE DE DIOS · TAMBOPATA · TAMBOPATA</span>
      </div>
    </footer>
  )
}
