import Link from 'next/link'
import { T } from '@/lib/i18n'
import type { Lang } from '@/lib/types'
import { DEFAULT_LOGO_URL, SITE_CONTACT } from '@/lib/site'

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
          <img src={DEFAULT_LOGO_URL} alt="" className="footer-logo" />
          <span>{SITE_CONTACT.legalName.toUpperCase()}</span>
        </div>
        <div className="footer-cols">
          {cols.map((c) => (
            <Link key={c.href} href={c.href}>{c.label}</Link>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 {SITE_CONTACT.legalName}</span>
        <span>{tr.footerCopy}</span>
        <span>MADRE DE DIOS · PUERTO MALDONADO · PERÚ</span>
      </div>
    </footer>
  )
}
