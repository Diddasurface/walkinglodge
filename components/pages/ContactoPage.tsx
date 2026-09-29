'use client'

import { useState } from 'react'
import PageHero from '@/components/PageHero'
import { PAGE_T } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

const ACCENT = '#E5A547'
const DISPLAY_FONT = 'var(--font-oswald), Oswald, sans-serif'

interface ContactoPageProps {
  lang: Lang
}

export default function ContactoPage({ lang }: ContactoPageProps) {
  const tr = PAGE_T[lang]
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dest: '', dates: '', people: '2', msg: '',
  })
  const [sent, setSent] = useState(false)

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="page page-contacto">
      <PageHero
        eyebrow={lang === 'es' ? '04 — DISEÑEMOS TU VIAJE' : "04 — LET'S DESIGN YOUR TRIP"}
        title={tr.contactoHero}
        lead={tr.contactoLead}
        accent={ACCENT}
        bg="/uploads/1778347444962-3lozdulfu64.jpg"
      />

      <div className="contacto-layout">
        <form className="contacto-form" onSubmit={submit}>
          {sent ? (
            <div className="form-sent">
              <div className="form-sent-icon" style={{ borderColor: ACCENT, color: ACCENT }}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 style={{ fontFamily: DISPLAY_FONT }}>{lang === 'es' ? '¡Mensaje enviado!' : 'Message sent!'}</h3>
              <p>
                {lang === 'es'
                  ? 'Te contactaremos en menos de 24 horas para comenzar a diseñar tu aventura.'
                  : 'We will contact you in less than 24 hours to start designing your adventure.'}
              </p>
              <button className="link-btn" style={{ color: ACCENT }} onClick={() => setSent(false)}>
                {lang === 'es' ? 'Enviar otra consulta' : 'Send another inquiry'}
              </button>
            </div>
          ) : (
            <>
              <div className="form-row">
                <div className="field">
                  <span>{tr.formName}</span>
                  <input type="text" value={form.name} onChange={upd('name')} required />
                </div>
                <div className="field">
                  <span>{tr.formEmail}</span>
                  <input type="email" value={form.email} onChange={upd('email')} required />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <span>{tr.formPhone}</span>
                  <input type="tel" value={form.phone} onChange={upd('phone')} />
                </div>
                <div className="field">
                  <span>{tr.formPeople}</span>
                  <select value={form.people} onChange={upd('people')}>
                    {['1','2','3','4','5','6','7','8+'].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field field-full">
                <span>{tr.formDest}</span>
                <select value={form.dest} onChange={upd('dest')}>
                  <option value="">{lang === 'es' ? 'Selecciona un destino' : 'Select a destination'}</option>
                  <option>{lang === 'es' ? 'Escapada Amazonica 3D/2N' : 'Amazon Escape 3D/2N'}</option>
                  <option>{lang === 'es' ? 'Canopy y fauna 4D/3N' : 'Canopy and wildlife 4D/3N'}</option>
                  <option>{lang === 'es' ? 'Lago Sandoval' : 'Lake Sandoval'}</option>
                  <option>{lang === 'es' ? 'Collpa de guacamayos' : 'Macaw clay lick'}</option>
                  <option>{lang === 'es' ? 'Estadia a medida' : 'Custom stay'}</option>
                </select>
              </div>
              <div className="field field-full">
                <span>{tr.formDates}</span>
                <input type="text" placeholder={lang === 'es' ? 'ej. Julio 2026, 10 días' : 'e.g. July 2026, 10 days'} value={form.dates} onChange={upd('dates')} />
              </div>
              <div className="field field-full">
                <span>{tr.formMsg}</span>
                <textarea rows={5} value={form.msg} onChange={upd('msg')} required />
              </div>
              <div className="form-actions">
                <button type="submit" className="form-submit" style={{ background: ACCENT }}>
                  {tr.formSubmit}
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                <span className="form-note">{tr.formNote}</span>
              </div>
            </>
          )}
        </form>

        <aside className="contacto-info">
          <h4 style={{ fontFamily: DISPLAY_FONT }}>{tr.contactInfoTitle}</h4>

          <div className="info-block">
            <p className="info-label">{tr.addrTitle}</p>
            <p>Puerto Maldonado, Madre de Dios</p>
            <p>Lodge a 2 horas rio abajo por el Madre de Dios</p>
            <p>Oficina de coordinacion en Puerto Maldonado</p>
          </div>

          <div className="info-block">
            <p className="info-label">{tr.bookingTitle}</p>
            <a href="mailto:reservas@walkinglodge.com">reservas@walkinglodge.com</a>
            <a href="tel:+5184234567">+51 84 234 567</a>
          </div>

          <div className="info-block">
            <p className="info-label">{tr.hoursTitle}</p>
            <p>{tr.hoursVal}</p>
          </div>

          <div className="info-block">
            <p className="info-label">{tr.pressTitle}</p>
            <a href="mailto:prensa@walkinglodge.com">prensa@walkinglodge.com</a>
          </div>
        </aside>
      </div>
    </div>
  )
}
