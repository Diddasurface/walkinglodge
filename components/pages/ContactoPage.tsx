'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { enUS, es } from 'react-day-picker/locale'
import { getCountries, getCountryCallingCode, parsePhoneNumber, type Country } from 'react-phone-number-input'
import labelsEn from 'react-phone-number-input/locale/en.json'
import labelsEs from 'react-phone-number-input/locale/es.json'
import PageHero from '@/components/PageHero'
import { PAGE_T } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

const ACCENT = '#E5A547'
const DISPLAY_FONT = 'var(--font-oswald), Oswald, sans-serif'

interface ContactoPageProps {
  lang: Lang
}

const EMPTY_FORM = {
  name: '', email: '', phone: '', nationality: '', dest: '', dates: '', people: '2', msg: '',
}

function flagEmoji(country: Country) {
  return country
    .toUpperCase()
    .replace(/./g, character => String.fromCodePoint(127397 + character.charCodeAt(0)))
}

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export default function ContactoPage({ lang }: ContactoPageProps) {
  const tr = PAGE_T[lang]
  const [form, setForm] = useState(EMPTY_FORM)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>()
  const calendarRef = useRef<HTMLDivElement>(null)
  const countryRef = useRef<HTMLDivElement>(null)

  const phoneLabels = lang === 'es' ? labelsEs : labelsEn
  const countries = useMemo(() => getCountries()
    .map(code => ({ code, name: phoneLabels[code] || code }))
    .sort((a, b) => a.name.localeCompare(b.name, lang)), [lang, phoneLabels])
  const countryMatches = useMemo(() => {
    const query = normalizeSearch(form.nationality)
    if (query.length < 2 || selectedCountry) return []
    return countries.filter(country => normalizeSearch(country.name).includes(query)).slice(0, 8)
  }, [countries, form.nationality, selectedCountry])
  const phoneCountry = useMemo(() => {
    try {
      const parsedCountry = form.phone ? parsePhoneNumber(form.phone)?.country : undefined
      if (parsedCountry) return parsedCountry

      const digits = form.phone.replace(/\D/g, '')
      if (!digits) return undefined
      const prefixMatches = getCountries().filter(country => digits.startsWith(getCountryCallingCode(country)))
      return prefixMatches.length === 1 ? prefixMatches[0] : undefined
    } catch {
      return undefined
    }
  }, [form.phone])

  useEffect(() => {
    if (!calendarOpen) return
    const closeCalendar = (event: MouseEvent) => {
      if (!calendarRef.current?.contains(event.target as Node)) setCalendarOpen(false)
    }
    document.addEventListener('mousedown', closeCalendar)
    return () => document.removeEventListener('mousedown', closeCalendar)
  }, [calendarOpen])

  useEffect(() => {
    if (!countryOpen) return
    const closeCountries = (event: MouseEvent) => {
      if (!countryRef.current?.contains(event.target as Node)) setCountryOpen(false)
    }
    document.addEventListener('mousedown', closeCountries)
    return () => document.removeEventListener('mousedown', closeCountries)
  }, [countryOpen])

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const formatDate = (date: Date) => new Intl.DateTimeFormat(lang === 'es' ? 'es-PE' : 'en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(date)

  const selectDates = (range: DateRange | undefined) => {
    setDateRange(range)
    const dates = range?.from
      ? range.to
        ? `${formatDate(range.from)} - ${formatDate(range.to)}`
        : formatDate(range.from)
      : ''
    setForm(current => ({ ...current, dates }))
    if (range?.from && range.to) setCalendarOpen(false)
  }

  const clearDates = () => {
    setDateRange(undefined)
    setForm(current => ({ ...current, dates: '' }))
  }

  const selectCountry = (country: Country, name: string) => {
    setSelectedCountry(country)
    setForm(current => ({ ...current, nationality: name }))
    setCountryOpen(false)
  }

  const changeNationality = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSelectedCountry(undefined)
    setForm(current => ({ ...current, nationality: value }))
    setCountryOpen(normalizeSearch(value).length >= 2)
  }

  const changePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/[^\d\s()-]/g, '')
    setForm(current => ({ ...current, phone: digits ? `+${digits}` : '' }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'No se pudo enviar la consulta.')
      setForm(EMPTY_FORM)
      setDateRange(undefined)
      setSelectedCountry(undefined)
      setSent(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo enviar la consulta.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page page-contacto">
      <PageHero
        eyebrow={lang === 'es' ? '04 — DISEÑEMOS TU VIAJE' : "04 — LET'S DESIGN YOUR TRIP"}
        title={tr.contactoHero}
        lead={tr.contactoLead}
        accent={ACCENT}
        bg="/images/lago-sandoval.webp"
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
              <button type="button" className="link-btn" style={{ color: ACCENT }} onClick={() => setSent(false)}>
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
                  <div className="contact-phone-simple">
                    <span className={phoneCountry ? 'phone-prefix is-flag' : 'phone-prefix'} aria-hidden="true">
                      {phoneCountry ? flagEmoji(phoneCountry) : '+'}
                    </span>
                    <input
                      type="tel"
                      value={form.phone.replace(/^\+/, '')}
                      onChange={changePhone}
                      placeholder={lang === 'es' ? '51 999 999 999' : '1 555 555 5555'}
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </div>
                </div>
                <div className="field">
                  <span>{lang === 'es' ? 'Nacionalidad' : 'Nationality'}</span>
                  <div className="country-autocomplete" ref={countryRef}>
                    {selectedCountry && <span className="country-selected-flag" aria-hidden="true">{flagEmoji(selectedCountry)}</span>}
                    <input
                      type="text"
                      value={form.nationality}
                      onChange={changeNationality}
                      onFocus={() => setCountryOpen(normalizeSearch(form.nationality).length >= 2 && !selectedCountry)}
                      required
                      maxLength={100}
                      autoComplete="off"
                      role="combobox"
                      aria-expanded={countryOpen}
                      aria-controls="nationality-options"
                      placeholder={lang === 'es' ? 'Busca tu país' : 'Search your country'}
                    />
                    {countryOpen && countryMatches.length > 0 && (
                      <div id="nationality-options" className="country-options" role="listbox">
                        {countryMatches.map(country => (
                          <button
                            type="button"
                            key={country.code}
                            role="option"
                            aria-selected={country.code === selectedCountry}
                            onClick={() => selectCountry(country.code, country.name)}
                          >
                            <span className="country-option-flag" aria-hidden="true">{flagEmoji(country.code)}</span>
                            <span>{country.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <span>{tr.formPeople}</span>
                  <select value={form.people} onChange={upd('people')}>
                    {['1','2','3','4','5','6','7','8+'].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <span>{tr.formDest}</span>
                  <select value={form.dest} onChange={upd('dest')}>
                    <option value="">{lang === 'es' ? 'Selecciona una experiencia' : 'Select an experience'}</option>
                    <option>{lang === 'es' ? 'Escapada Amazonica 3D/2N' : 'Amazon Escape 3D/2N'}</option>
                    <option>{lang === 'es' ? 'Canopy y fauna 4D/3N' : 'Canopy and wildlife 4D/3N'}</option>
                    <option>{lang === 'es' ? 'Lago Sandoval' : 'Lake Sandoval'}</option>
                    <option>{lang === 'es' ? 'Collpa de guacamayos' : 'Macaw clay lick'}</option>
                    <option>{lang === 'es' ? 'Estadia a medida' : 'Custom stay'}</option>
                  </select>
                </div>
              </div>
              <div className="field field-full">
                <span>{tr.formDates}</span>
                <div className="date-range-picker" ref={calendarRef}>
                  <div className={`date-range-control${calendarOpen ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="date-range-trigger"
                      onClick={() => setCalendarOpen(open => !open)}
                      aria-expanded={calendarOpen}
                      aria-haspopup="dialog"
                    >
                      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M16 3v4M8 3v4M3 10h18" />
                      </svg>
                      <span className={form.dates ? 'has-dates' : ''}>
                        {form.dates || (lang === 'es' ? 'Selecciona llegada y salida' : 'Select arrival and departure')}
                      </span>
                    </button>
                    {form.dates && (
                      <button type="button" className="date-range-clear" onClick={clearDates} aria-label={lang === 'es' ? 'Limpiar fechas' : 'Clear dates'}>
                        &times;
                      </button>
                    )}
                  </div>

                  {calendarOpen && (
                    <div className="date-calendar" role="dialog" aria-label={lang === 'es' ? 'Seleccionar rango de fechas' : 'Select date range'}>
                      <DayPicker
                        mode="range"
                        selected={dateRange}
                        onSelect={selectDates}
                        locale={lang === 'es' ? es : enUS}
                        disabled={{ before: new Date() }}
                        showOutsideDays
                        fixedWeeks
                      />
                      <div className="date-calendar-help">
                        <span>{lang === 'es' ? 'Primero llegada, luego salida' : 'Arrival first, then departure'}</span>
                        {dateRange?.from && (
                          <button type="button" onClick={clearDates}>{lang === 'es' ? 'Limpiar' : 'Clear'}</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="field field-full">
                <span>{tr.formMsg}</span>
                <textarea rows={5} value={form.msg} onChange={upd('msg')} required />
              </div>
              <div className="form-actions">
                <button type="submit" className="form-submit" style={{ background: ACCENT }} disabled={sending}>
                  {sending ? (lang === 'es' ? 'Enviando...' : 'Sending...') : tr.formSubmit}
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                <span className="form-note">{tr.formNote}</span>
              </div>
              {error && <p role="alert" style={{ color: '#c2410c', marginTop: '12px' }}>{error}</p>}
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
