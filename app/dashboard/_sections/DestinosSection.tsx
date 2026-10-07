'use client'

import Link from 'next/link'
import { useState } from 'react'
import { TableCard } from '../_ui/TableCard'
import { Badge } from '../_ui/Badge'
import { Spinner } from '../_ui/Spinner'
import { EmptyState } from '../_ui/EmptyState'
import { SlideOver } from '../_ui/SlideOver'
import { Field, inp } from '../_ui/Field'
import { Feedback } from '../_ui/Feedback'
import { SubmitBtn } from '../_ui/SubmitBtn'
import { ImageUpload } from '../_ui/ImageUpload'
import { MultiImageUpload } from '../_ui/MultiImageUpload'
import { TAG_CLS } from '../_lib/constants'
import type { AdminDestination, AdminDestinationDay, AdminDestinationWarning } from '../_lib/types'
import { parseVideoUrl } from '@/lib/media'

interface AdminMedia {
  id: string; type: string; url: string
  provider: string | null; thumbUrl: string | null
  captionEs: string | null; captionEn: string | null; sortOrder: number
}

const TAGS = ['rio', 'bosque', 'fauna']
const SEVERITIES = ['info', 'warning', 'danger']

const EMPTY_F = {
  nameEs: '', nameEn: '', regionEs: '', regionEn: '',
  shortEs: '', shortEn: '', subEs: '', subEn: '',
  descEs: '', descEn: '', experienceEs: '', experienceEn: '',
  tag: 'rio', altitudeM: '', durationDays: '',
  mapAddress: '', contactEmail: '', contactWhatsapp: '',
  coverImg: '',
}
const EMPTY_DAY  = { titleEs: '', titleEn: '', descEs: '', descEn: '', mealsEs: '', mealsEn: '' }
const EMPTY_WARN = { textEs: '', textEn: '', severity: 'warning' }

type Tab = 'basic' | 'desc' | 'contact' | 'itinerary' | 'warnings' | 'gallery'

const TABS: { id: Tab; labelEs: string; labelEn: string; editOnly?: true }[] = [
  { id: 'basic',     labelEs: 'Básico',      labelEn: 'Basic' },
  { id: 'desc',      labelEs: 'Descripción', labelEn: 'Content' },
  { id: 'contact',   labelEs: 'Contacto',    labelEn: 'Contact' },
  { id: 'itinerary', labelEs: 'Itinerario',  labelEn: 'Itinerary', editOnly: true },
  { id: 'warnings',  labelEs: 'Avisos',      labelEn: 'Notices',   editOnly: true },
  { id: 'gallery',   labelEs: 'Galería',     labelEn: 'Gallery',   editOnly: true },
]

const PUBLISH_CLS = (on: boolean) =>
  on
    ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 hover:border-red-500/20'
    : 'bg-slate-100 dark:bg-zinc-700/30 text-gray-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-400 hover:border-green-500/20'

const SEV_CLS: Record<string, string> = {
  info:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger:  'bg-red-500/10 text-red-400 border-red-500/20',
}

const ta      = inp + ' resize-y min-h-[90px]'
const miniBtn = 'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors'

export function DestinosSection({ lang, destinations, loading, onRefresh }: {
  lang: string; destinations: AdminDestination[]; loading: boolean; onRefresh: () => void
}) {
  const [open, setOpen]       = useState(false)
  const [editing, setEditing] = useState<AdminDestination | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('basic')
  const [ok, setOk]           = useState('')
  const [err, setErr]         = useState('')
  const [search, setSearch]   = useState('')
  const [saving, setSaving]   = useState(false)
  const [f, setF]             = useState(EMPTY_F)

  const [days, setDays]         = useState<AdminDestinationDay[]>([])
  const [newDay, setNewDay]     = useState(EMPTY_DAY)
  const [savingDay, setSavingDay] = useState(false)

  const [warnings, setWarnings]   = useState<AdminDestinationWarning[]>([])
  const [newWarn, setNewWarn]     = useState(EMPTY_WARN)
  const [savingWarn, setSavingWarn] = useState(false)

  const [media, setMedia]           = useState<AdminMedia[]>([])
  const [mediaMode, setMediaMode]   = useState<'image' | 'video'>('image')
  const [newVid, setNewVid]         = useState({ url: '', thumbUrl: '', captionEs: '', captionEn: '' })
  const [savingMedia, setSavingMedia] = useState(false)
  const [mediaErr, setMediaErr]     = useState('')

  const upd = (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF(p => ({ ...p, [k]: e.target.value }))

  const updDay = (k: keyof typeof EMPTY_DAY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setNewDay(p => ({ ...p, [k]: e.target.value }))

  const updWarn = (k: keyof typeof EMPTY_WARN) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setNewWarn(p => ({ ...p, [k]: e.target.value }))

  const fetchEditData = (id: string) => {
    Promise.all([
      fetch(`/api/admin/destinations/${id}/days`).then(r => r.json()),
      fetch(`/api/admin/destinations/${id}/warnings`).then(r => r.json()),
      fetch(`/api/admin/destinations/${id}/media`).then(r => r.json()),
    ]).then(([d, w, m]) => { setDays(d); setWarnings(w); setMedia(m) })
  }

  const postMedia = async (body: object) => {
    if (!editing) return
    const res = await fetch(`/api/admin/destinations/${editing.id}/media`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    if (res.ok) {
      const item = await res.json()
      setMedia(p => [...p, item])
    }
  }

  const addVideoItem = async () => {
    if (!editing || !newVid.url) return
    setSavingMedia(true); setMediaErr('')
    const res = await fetch(`/api/admin/destinations/${editing.id}/media`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'video', url: newVid.url, thumbUrl: newVid.thumbUrl, captionEs: newVid.captionEs, captionEn: newVid.captionEn }),
    })
    setSavingMedia(false)
    if (res.ok) {
      const item = await res.json()
      setMedia(p => [...p, item])
      setNewVid({ url: '', thumbUrl: '', captionEs: '', captionEn: '' })
    } else {
      const d = await res.json().catch(() => ({}))
      setMediaErr(d.error || 'Error al agregar')
    }
  }

  const deleteMedia = async (mediaId: string) => {
    if (!editing) return
    await fetch(`/api/admin/destinations/${editing.id}/media/${mediaId}`, { method: 'DELETE' })
    setMedia(p => p.filter(m => m.id !== mediaId))
  }

  const addItem = async (
    endpoint: string,
    body: object,
    setLoading: (v: boolean) => void,
    onSuccess: () => void
  ) => {
    if (!editing) return
    setLoading(true)
    const res = await fetch(`/api/admin/destinations/${editing.id}/${endpoint}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    if (res.ok) { onSuccess(); fetchEditData(editing.id) }
    setLoading(false)
  }

  const deleteItem = async (endpoint: string, itemId: string) => {
    if (!editing) return
    await fetch(`/api/admin/destinations/${editing.id}/${endpoint}/${itemId}`, { method: 'DELETE' })
    fetchEditData(editing.id)
  }

  const addDay      = () => addItem('days',     newDay,  setSavingDay,  () => setNewDay(EMPTY_DAY))
  const deleteDay   = (id: string) => deleteItem('days', id)
  const addWarning  = () => addItem('warnings', newWarn, setSavingWarn, () => setNewWarn(EMPTY_WARN))
  const deleteWarning = (id: string) => deleteItem('warnings', id)

  const resetSlide = () => {
    setF(EMPTY_F); setDays([]); setWarnings([]); setMedia([])
    setNewDay(EMPTY_DAY); setNewWarn(EMPTY_WARN)
setNewVid({ url: '', thumbUrl: '', captionEs: '', captionEn: '' })
    setMediaErr(''); setOk(''); setErr(''); setActiveTab('basic')
  }

  const openNew = () => {
    setEditing(null)
    resetSlide()
    setOpen(true)
  }

  const openEdit = (d: AdminDestination) => {
    setEditing(d)
    setF({
      nameEs: d.nameEs, nameEn: d.nameEn,
      regionEs: d.regionEs, regionEn: d.regionEn,
      shortEs: d.shortEs ?? '', shortEn: d.shortEn ?? '',
      subEs: d.subEs ?? '', subEn: d.subEn ?? '',
      descEs: d.descEs ?? '', descEn: d.descEn ?? '',
      experienceEs: d.experienceEs ?? '', experienceEn: d.experienceEn ?? '',
      tag: d.tag,
      altitudeM:    d.altitudeM    ? String(d.altitudeM)    : '',
      durationDays: d.durationDays ? String(d.durationDays) : '',
      mapAddress:   d.mapAddress ?? '',
      contactEmail: d.contactEmail ?? '',
      contactWhatsapp: d.contactWhatsapp ?? '',
      coverImg: d.coverImg,
    })
    setDays([]); setWarnings([]); setMedia([])
    setNewDay(EMPTY_DAY); setNewWarn(EMPTY_WARN)
setNewVid({ url: '', thumbUrl: '', captionEs: '', captionEn: '' })
    setMediaMode('image'); setMediaErr('')
    setOk(''); setErr(''); setActiveTab('basic')
    setOpen(true)
    fetchEditData(d.id)
  }

  const closeSlide = () => { setOpen(false); setOk(''); setErr('') }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!f.nameEs || !f.regionEs) {
      setActiveTab('basic')
      setErr(lang === 'es' ? 'Nombre y región son obligatorios' : 'Name and region are required')
      return
    }
    if (!f.coverImg) {
      setActiveTab('basic')
      setErr(lang === 'es' ? 'La imagen de portada es obligatoria' : 'Cover image is required')
      return
    }
    setSaving(true); setOk(''); setErr('')

    const res = editing
      ? await fetch(`/api/admin/destinations/${editing.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f),
        })
      : await fetch('/api/admin/destinations', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f),
        })

    setSaving(false)

    if (res.ok) {
      onRefresh()
      if (!editing) {
        // After create: stay open in edit mode so the user can add description, days, etc.
        const created = await res.json()
        const asAdmin: AdminDestination = {
          id: created.id, slug: created.slug,
          nameEs: created.nameEs, nameEn: created.nameEn,
          regionEs: created.regionEs, regionEn: created.regionEn,
          shortEs: created.shortEs ?? '', shortEn: created.shortEn ?? '',
          subEs: created.subEs ?? '', subEn: created.subEn ?? '',
          descEs: created.descEs ?? '', descEn: created.descEn ?? '',
          experienceEs: null, experienceEn: null,
          coverImg: created.coverImg, published: false,
          altitudeM: created.altitudeM ?? null,
          durationDays: null, mapAddress: null,
          contactEmail: null, contactWhatsapp: null,
          tag: created.tag,
        }
        setEditing(asAdmin)
        setActiveTab('desc')
        setOk(lang === 'es' ? '¡Creado! Ahora completa la descripción e itinerario.' : 'Created! Now complete the description and itinerary.')
      } else {
        setOk(lang === 'es' ? '¡Guardado!' : 'Saved!')
        setTimeout(() => setOk(''), 2500)
      }
    } else {
      const d = await res.json().catch(() => ({}))
      setErr(d.error || (lang === 'es' ? 'Error al guardar' : 'Error saving'))
    }
  }

  const togglePublish = async (d: AdminDestination) => {
    await fetch(`/api/admin/destinations/${d.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !d.published }),
    })
    onRefresh()
  }

  const deleteDestination = async (d: AdminDestination) => {
    if (!confirm(lang === 'es' ? `¿Eliminar "${d.nameEs.replace(/\n/g, ' ')}"?` : `Delete "${d.nameEs.replace(/\n/g, ' ')}"?`)) return
    setErr('')
    setOk('')
    const res = await fetch(`/api/admin/destinations/${d.id}`, { method: 'DELETE' })
    if (res.ok) {
      setOk(lang === 'es' ? 'Destino eliminado' : 'Destination deleted')
      onRefresh()
      setTimeout(() => setOk(''), 2000)
      return
    }

    const body = await res.json().catch(() => ({}))
    setErr(body.error || (lang === 'es' ? 'No se pudo eliminar el destino' : 'Could not delete destination'))
  }

  const filtered = destinations.filter(d =>
    d.nameEs.toLowerCase().includes(search.toLowerCase())
  )

  const searchCls =
    'bg-white dark:bg-[#1c1f21] border border-slate-200 dark:border-white/[0.08] rounded-lg px-3 py-1.5 ' +
    'text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 outline-none ' +
    'focus:border-[#E5A547]/40 w-40 transition-colors'

  const visibleTabs = TABS.filter(t => !t.editOnly || editing)

  return (
    <>
      {/* ── TABLE ── */}
      <TableCard
        title={`${lang === 'es' ? 'Todos los destinos' : 'All destinations'} (${destinations.length})`}
        action={
          <div className="flex items-center gap-3">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang === 'es' ? 'Buscar…' : 'Search…'} className={searchCls} />
            <button
              onClick={openNew}
              className="flex items-center gap-1.5 bg-[#E5A547] text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#f0b050] transition-colors"
              style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.04em' }}
            >
              + {lang === 'es' ? 'Nuevo' : 'New'}
            </button>
          </div>
        }
      >
        {loading ? <Spinner /> : filtered.length === 0
          ? <EmptyState label={lang === 'es' ? 'Sin destinos' : 'No destinations'} />
          : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-145">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0f1012]">
                    {[lang === 'es' ? 'Nombre' : 'Name', lang === 'es' ? 'Región' : 'Region', 'Tag', lang === 'es' ? 'Altitud' : 'Altitude', 'Estado', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => (
                    <tr key={d.id} className="border-t border-slate-100 dark:border-white/4 hover:bg-slate-50 dark:hover:bg-white/1.5 group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {d.coverImg && <img src={d.coverImg} alt={d.nameEs} className="w-9 h-9 rounded-lg object-cover shrink-0" />}
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">{d.nameEs.replace(/\n/g, ' ')}</p>
                            <p className="text-[10px] text-gray-400 dark:text-zinc-600">{d.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-zinc-400">{d.regionEs}</td>
                      <td className="px-5 py-4">
                        <Badge cls={TAG_CLS[d.tag] ?? 'bg-slate-100 dark:bg-zinc-700/40 text-gray-500 dark:text-zinc-400'}>{d.tag}</Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-zinc-400">
                        {d.altitudeM ? `${d.altitudeM.toLocaleString()} m` : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => togglePublish(d)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${PUBLISH_CLS(d.published)}`}
                        >
                          {d.published ? (lang === 'es' ? 'Publicado' : 'Published') : (lang === 'es' ? 'Borrador' : 'Draft')}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(d)}
                            title={lang === 'es' ? 'Editar' : 'Edit'}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-black dark:text-zinc-200 hover:bg-[#E5A547]/20 hover:text-[#9a650f] dark:hover:text-[#E5A547] transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <Link
                            href={`/dashboard/destinos/${d.id}/galeria`}
                            title={lang === 'es' ? 'Galería' : 'Gallery'}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-black dark:text-zinc-200 hover:bg-[#E5A547]/20 hover:text-[#9a650f] dark:hover:text-[#E5A547] transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="m21 15-5-5L5 21" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => deleteDestination(d)}
                            title={lang === 'es' ? 'Eliminar' : 'Delete'}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-black dark:text-zinc-200 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors text-base leading-none"
                          >✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </TableCard>

      {/* ── SLIDE-OVER ── */}
      <SlideOver
        open={open}
        onClose={closeSlide}
        title={editing
          ? (lang === 'es' ? 'Editar destino' : 'Edit destination')
          : (lang === 'es' ? 'Nuevo destino' : 'New destination')}
      >
        <Feedback ok={ok} err={err} />

        {/* Tab bar */}
        <div className="flex gap-1 mb-5 p-1 rounded-lg bg-black/20 overflow-x-auto">
          {visibleTabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-[#E5A547] text-black'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
              style={activeTab === t.id ? { fontFamily: 'var(--font-oswald)', letterSpacing: '0.05em' } : undefined}
            >
              {lang === 'es' ? t.labelEs : t.labelEn}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">

          {/* ── TAB: BÁSICO ── */}
          {activeTab === 'basic' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label={lang === 'es' ? 'Nombre (ES) *' : 'Name (ES) *'}>
                  <input value={f.nameEs} onChange={upd('nameEs')} placeholder="Lago Sandoval" className={inp} />
                </Field>
                <Field label={lang === 'es' ? 'Nombre (EN)' : 'Name (EN)'}>
                  <input value={f.nameEn} onChange={upd('nameEn')} placeholder="Lake Sandoval" className={inp} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label={lang === 'es' ? 'Región (ES) *' : 'Region (ES) *'}>
                  <input value={f.regionEs} onChange={upd('regionEs')} placeholder="Madre de Dios · Tambopata" className={inp} />
                </Field>
                <Field label={lang === 'es' ? 'Región (EN)' : 'Region (EN)'}>
                  <input value={f.regionEn} onChange={upd('regionEn')} placeholder="Madre de Dios · Tambopata" className={inp} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label={lang === 'es' ? 'Subtítulo (ES)' : 'Subtitle (ES)'}>
                  <input value={f.subEs} onChange={upd('subEs')} placeholder="Rio, bosque y fauna" className={inp} />
                </Field>
                <Field label={lang === 'es' ? 'Subtítulo (EN)' : 'Subtitle (EN)'}>
                  <input value={f.subEn} onChange={upd('subEn')} placeholder="River, forest, and wildlife" className={inp} />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Tag *">
                  <select value={f.tag} onChange={upd('tag')} className={inp}>
                    {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label={lang === 'es' ? 'Altitud (m)' : 'Altitude (m)'}>
                  <input type="number" value={f.altitudeM} onChange={upd('altitudeM')} placeholder="2430" className={inp} />
                </Field>
                <Field label={lang === 'es' ? 'Días' : 'Days'}>
                  <input type="number" value={f.durationDays} onChange={upd('durationDays')} placeholder="4" className={inp} />
                </Field>
              </div>
              <Field label={lang === 'es' ? 'Imagen de portada *' : 'Cover image *'}>
                <ImageUpload value={f.coverImg} onChange={url => setF(p => ({ ...p, coverImg: url }))} lang={lang} />
              </Field>
            </>
          )}

          {/* ── TAB: DESCRIPCIÓN ── */}
          {activeTab === 'desc' && (
            <>
              <Field label={lang === 'es' ? 'Descripción corta (ES)' : 'Short description (ES)'}>
                <textarea value={f.descEs} onChange={upd('descEs')} placeholder={lang === 'es' ? 'Párrafo introductorio mostrado en la tarjeta…' : 'Intro paragraph shown on the card…'} className={ta} />
              </Field>
              <Field label={lang === 'es' ? 'Descripción corta (EN)' : 'Short description (EN)'}>
                <textarea value={f.descEn} onChange={upd('descEn')} placeholder="Intro paragraph shown on the card…" className={ta} />
              </Field>
              <Field label={lang === 'es' ? 'Experiencia completa (ES)' : 'Full experience (ES)'}>
                <textarea value={f.experienceEs} onChange={upd('experienceEs')} placeholder={lang === 'es' ? 'Narrativa detallada: qué vivirá el viajero, cómo es el paisaje, qué esperar…' : 'Detailed narrative: what the traveler will experience…'} className={ta} style={{ minHeight: 160 }} />
              </Field>
              <Field label={lang === 'es' ? 'Experiencia completa (EN)' : 'Full experience (EN)'}>
                <textarea value={f.experienceEn} onChange={upd('experienceEn')} placeholder="Detailed narrative: what the traveler will experience…" className={ta} style={{ minHeight: 160 }} />
              </Field>
            </>
          )}

          {/* ── TAB: CONTACTO ── */}
          {activeTab === 'contact' && (
            <>
              <Field label={lang === 'es' ? 'Correo de contacto' : 'Contact email'}>
                <input type="email" value={f.contactEmail} onChange={upd('contactEmail')} placeholder="info@agencia.com" className={inp} />
              </Field>
              <Field label="WhatsApp">
                <input value={f.contactWhatsapp} onChange={upd('contactWhatsapp')} placeholder="+51 999 000 111" className={inp} />
              </Field>
              <Field label={lang === 'es' ? 'Dirección para Google Maps' : 'Google Maps address'}>
                <input value={f.mapAddress} onChange={upd('mapAddress')} placeholder="Rio Madre de Dios, Tambopata, Madre de Dios, Peru" className={inp} />
              </Field>
            </>
          )}

          {/* Save button — visible on basic / desc / contact tabs */}
          {activeTab !== 'itinerary' && activeTab !== 'warnings' && (
            <div className="pt-2">
              <SubmitBtn loading={saving} label={editing
                ? (lang === 'es' ? 'Guardar cambios' : 'Save changes')
                : (lang === 'es' ? 'Crear destino' : 'Create destination')} />
            </div>
          )}
        </form>

        {/* ── TAB: ITINERARIO (edit only) ── */}
        {activeTab === 'itinerary' && editing && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-500">
              {lang === 'es'
                ? `${days.length} día(s) agregado(s). Los días se guardan automáticamente.`
                : `${days.length} day(s) added. Days are saved automatically.`}
            </p>

            {days.map(day => (
              <div key={day.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/3 border border-white/6">
                <span className="text-[#E5A547] text-xs font-bold mt-0.5 shrink-0" style={{ fontFamily: 'var(--font-oswald)' }}>
                  {lang === 'es' ? 'Día' : 'Day'} {day.dayNumber}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{day.titleEs}</p>
                  {day.mealsEs && <p className="text-xs text-zinc-500 mt-0.5 truncate">🍽 {day.mealsEs}</p>}
                </div>
                <button onClick={() => deleteDay(day.id)} className="text-zinc-600 hover:text-red-400 transition-colors text-sm shrink-0">✕</button>
              </div>
            ))}

            <div className="p-3 rounded-lg bg-white/2 border border-white/6 space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                {lang === 'es' ? '+ Nuevo día' : '+ New day'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Field label={lang === 'es' ? 'Título (ES) *' : 'Title (ES) *'}>
                  <input value={newDay.titleEs} onChange={updDay('titleEs')} placeholder={lang === 'es' ? 'Llegada al lodge' : 'Arrival at the lodge'} className={inp} />
                </Field>
                <Field label={lang === 'es' ? 'Título (EN)' : 'Title (EN)'}>
                  <input value={newDay.titleEn} onChange={updDay('titleEn')} placeholder="Arrival at the lodge" className={inp} />
                </Field>
              </div>
              <Field label={lang === 'es' ? 'Descripción (ES)' : 'Description (ES)'}>
                <textarea value={newDay.descEs} onChange={updDay('descEs')} placeholder={lang === 'es' ? 'Detalle de actividades…' : 'Activity detail…'} className={ta} style={{ minHeight: 70 }} />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label={lang === 'es' ? 'Comidas (ES)' : 'Meals (ES)'}>
                  <input value={newDay.mealsEs} onChange={updDay('mealsEs')} placeholder={lang === 'es' ? 'Desayuno y cena' : 'Breakfast and dinner'} className={inp} />
                </Field>
                <Field label={lang === 'es' ? 'Comidas (EN)' : 'Meals (EN)'}>
                  <input value={newDay.mealsEn} onChange={updDay('mealsEn')} placeholder="Breakfast and dinner" className={inp} />
                </Field>
              </div>
              <button
                onClick={addDay}
                disabled={savingDay || !newDay.titleEs}
                className={`${miniBtn} bg-[#E5A547] text-black hover:bg-[#f0b050] disabled:opacity-40`}
              >
                {savingDay ? '…' : (lang === 'es' ? 'Agregar día' : 'Add day')}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: AVISOS (edit only) ── */}
        {activeTab === 'warnings' && editing && (
          <div className="space-y-4 pb-6">
            <p className="text-xs text-zinc-500">
              {lang === 'es'
                ? `${warnings.length} aviso(s). Se guardan automáticamente.`
                : `${warnings.length} notice(s). Saved automatically.`}
            </p>

            {warnings.map(w => (
              <div key={w.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/3 border border-white/6">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium border shrink-0 ${SEV_CLS[w.severity] ?? SEV_CLS.warning}`}>
                  {w.severity}
                </span>
                <p className="flex-1 text-sm text-white/80 min-w-0">{w.textEs}</p>
                <button onClick={() => deleteWarning(w.id)} className="text-zinc-600 hover:text-red-400 transition-colors text-sm shrink-0">✕</button>
              </div>
            ))}

            <div className="p-3 rounded-lg bg-white/2 border border-white/6 space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                {lang === 'es' ? '+ Nuevo aviso' : '+ New notice'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Field label={lang === 'es' ? 'Texto (ES) *' : 'Text (ES) *'}>
                  <input value={newWarn.textEs} onChange={updWarn('textEs')} placeholder={lang === 'es' ? 'Llevar ropa abrigada…' : 'Bring warm clothing…'} className={inp} />
                </Field>
                <Field label={lang === 'es' ? 'Texto (EN)' : 'Text (EN)'}>
                  <input value={newWarn.textEn} onChange={updWarn('textEn')} placeholder="Bring warm clothing…" className={inp} />
                </Field>
              </div>
              <Field label={lang === 'es' ? 'Tipo' : 'Type'}>
                <select value={newWarn.severity} onChange={updWarn('severity')} className={inp}>
                  {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <button
                onClick={addWarning}
                disabled={savingWarn || !newWarn.textEs}
                className={`${miniBtn} bg-[#E5A547] text-black hover:bg-[#f0b050] disabled:opacity-40`}
              >
                {savingWarn ? '…' : (lang === 'es' ? 'Agregar aviso' : 'Add notice')}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: GALERÍA (edit only) ── */}
        {activeTab === 'gallery' && editing && (
          <div className="space-y-5 pb-6">
            <p className="text-xs text-zinc-500">
              {lang === 'es'
                ? `${media.length} elemento(s). Se guardan automáticamente.`
                : `${media.length} item(s). Saved automatically.`}
            </p>

            {/* Grid de items actuales */}
            {media.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {media.map(m => {
                  const thumb = m.thumbUrl || (m.type === 'image' ? m.url : '')
                  return (
                    <div key={m.id} className="relative group rounded-lg overflow-hidden aspect-video bg-black/30">
                      {thumb
                        ? <img src={thumb} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">video</div>
                      }
                      {m.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-7 h-7 rounded-full bg-[#E5A547]/80 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="white"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => deleteMedia(m.id)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >✕</button>
                      {(m.captionEs) && (
                        <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-black/50 text-[9px] text-white/80 truncate">{m.captionEs}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Toggle foto/video */}
            <div className="flex gap-1 p-0.5 rounded-lg bg-black/20 w-fit">
              {(['image', 'video'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setMediaMode(mode)}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    mediaMode === mode ? 'bg-[#E5A547] text-black' : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  {mode === 'image' ? (lang === 'es' ? '📷 Foto' : '📷 Photo') : '▶ Video'}
                </button>
              ))}
            </div>

            {/* Form: fotos (multi-upload) */}
            {mediaMode === 'image' && (
              <div className="p-3 rounded-lg bg-white/2 border border-white/6">
                <MultiImageUpload
                  lang={lang}
                  onUploadEach={url => postMedia({ type: 'image', url })}
                />
              </div>
            )}

            {/* Form: video */}
            {mediaMode === 'video' && (
              <div className="p-3 rounded-lg bg-white/2 border border-white/6 space-y-3">
                <Field label="URL (YouTube, Vimeo o .mp4)">
                  <input
                    value={newVid.url}
                    onChange={e => {
                      const url = e.target.value
                      const parsed = parseVideoUrl(url)
                      setNewVid(p => ({ ...p, url, thumbUrl: parsed?.autoThumb || p.thumbUrl }))
                    }}
                    placeholder="https://youtube.com/watch?v=..."
                    className={inp}
                  />
                </Field>
                <Field label={lang === 'es' ? 'Miniatura personalizada (opcional)' : 'Custom thumbnail (optional)'}>
                  <ImageUpload
                    value={newVid.thumbUrl}
                    onChange={url => setNewVid(p => ({ ...p, thumbUrl: url }))}
                    lang={lang}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label={lang === 'es' ? 'Pie de video (ES)' : 'Caption (ES)'}>
                    <input value={newVid.captionEs} onChange={e => setNewVid(p => ({ ...p, captionEs: e.target.value }))} placeholder={lang === 'es' ? 'Sobrevuelo del cañón…' : 'Canyon flyover…'} className={inp} />
                  </Field>
                  <Field label={lang === 'es' ? 'Pie de video (EN)' : 'Caption (EN)'}>
                    <input value={newVid.captionEn} onChange={e => setNewVid(p => ({ ...p, captionEn: e.target.value }))} placeholder="Canyon flyover…" className={inp} />
                  </Field>
                </div>
                {mediaErr && <p className="text-xs text-red-400">{mediaErr}</p>}
                <button
                  type="button"
                  onClick={addVideoItem}
                  disabled={savingMedia || !newVid.url}
                  className={`${miniBtn} bg-[#E5A547] text-black hover:bg-[#f0b050] disabled:opacity-40`}
                >
                  {savingMedia ? '…' : (lang === 'es' ? 'Agregar video' : 'Add video')}
                </button>
              </div>
            )}
          </div>
        )}
      </SlideOver>
    </>
  )
}
