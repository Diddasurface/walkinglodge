'use client'

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
import { TYPE_CFG } from '../_lib/constants'
import type { AdminTour } from '../_lib/types'

const PUBLISH_CLS = (on: boolean) =>
  on
    ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 hover:border-red-500/20'
    : 'bg-slate-100 dark:bg-zinc-700/30 text-gray-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-400 hover:border-green-500/20'

export function ToursSection({ lang, tours, loading, onRefresh }: {
  lang: string; tours: AdminTour[]; loading: boolean; onRefresh: () => void
}) {
  const [open, setOpen] = useState(false)
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [f, setF] = useState({
    type: 'ADV', titleEs: '', titleEn: '', subEs: '',
    durationDays: '', durationNights: '', levelEs: 'Moderado',
    coverImg: '', minPax: '1', maxPax: '20', basePrice: '',
  })

  const upd = (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true); setOk(''); setErr('')
    const res = await fetch('/api/admin/tours', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f),
    })
    setSaving(false)
    if (res.ok) {
      setOk(lang === 'es' ? '¡Tour creado!' : 'Tour created!')
      setF({ type: 'ADV', titleEs: '', titleEn: '', subEs: '', durationDays: '', durationNights: '', levelEs: 'Moderado', coverImg: '', minPax: '1', maxPax: '20', basePrice: '' })
      onRefresh()
      setTimeout(() => { setOpen(false); setOk('') }, 1200)
    } else {
      const d = await res.json().catch(() => ({}))
      setErr(d.error || (lang === 'es' ? 'Error al crear el tour' : 'Error creating tour'))
    }
  }

  const togglePublish = async (t: AdminTour) => {
    await fetch(`/api/admin/tours/${t.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !t.published }),
    })
    onRefresh()
  }

  const deleteTour = async (t: AdminTour) => {
    if (!confirm(lang === 'es' ? `¿Eliminar "${t.titleEs}"?` : `Delete "${t.titleEs}"?`)) return
    await fetch(`/api/admin/tours/${t.id}`, { method: 'DELETE' })
    onRefresh()
  }

  const filtered = tours.filter(t =>
    t.titleEs.toLowerCase().includes(search.toLowerCase())
  )

  const searchCls =
    'bg-white dark:bg-[#1c1f21] border border-slate-200 dark:border-white/[0.08] rounded-lg px-3 py-1.5 ' +
    'text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 outline-none ' +
    'focus:border-[#E5A547]/40 w-40 transition-colors'

  return (
    <>
      <TableCard
        title={`${lang === 'es' ? 'Todos los tours' : 'All tours'} (${tours.length})`}
        action={
          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'es' ? 'Buscar…' : 'Search…'}
              className={searchCls}
            />
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1.5 bg-[#E5A547] text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#f0b050] transition-colors"
              style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.04em' }}
            >
              + {lang === 'es' ? 'Nuevo' : 'New'}
            </button>
          </div>
        }
      >
        {loading ? <Spinner /> : filtered.length === 0
          ? <EmptyState label={lang === 'es' ? 'Sin tours' : 'No tours'} />
          : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0f1012]">
                    {[lang === 'es' ? 'Título' : 'Title', lang === 'es' ? 'Tipo' : 'Type', lang === 'es' ? 'Días' : 'Days', lang === 'es' ? 'Nivel' : 'Level', 'Estado', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => {
                    const tc = TYPE_CFG[t.type] ?? TYPE_CFG.ADV
                    return (
                      <tr key={t.id} className="border-t border-slate-100 dark:border-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.015] group">
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-900 dark:text-white">{t.titleEs}</p>
                          {t.featured && <span className="text-[10px] text-[#E5A547]">★ {lang === 'es' ? 'Destacado' : 'Featured'}</span>}
                        </td>
                        <td className="px-5 py-4"><Badge cls={tc.cls}>{lang === 'es' ? tc.es : tc.en}</Badge></td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                          {t.durationDays ?? '—'} {lang === 'es' ? 'días' : 'days'} / {t.durationNights ?? 0} {lang === 'es' ? 'noches' : 'nights'}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-zinc-400">{t.levelEs}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => togglePublish(t)}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${PUBLISH_CLS(t.published)}`}
                          >
                            {t.published ? (lang === 'es' ? 'Publicado' : 'Published') : (lang === 'es' ? 'Borrador' : 'Draft')}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => deleteTour(t)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-400 transition-all text-sm"
                            title={lang === 'es' ? 'Eliminar' : 'Delete'}
                          >✕</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
      </TableCard>

      <SlideOver open={open} onClose={() => { setOpen(false); setOk(''); setErr('') }} title={lang === 'es' ? 'Nuevo tour' : 'New tour'}>
        <Feedback ok={ok} err={err} />
        <form onSubmit={submit} className="space-y-4">
          <Field label={lang === 'es' ? 'Tipo' : 'Type'}>
            <select value={f.type} onChange={upd('type')} className={inp}>
              {Object.entries(TYPE_CFG).map(([v, c]) => (
                <option key={v} value={v}>{lang === 'es' ? c.es : c.en}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Título (ES) *' : 'Title (ES) *'}>
              <input required value={f.titleEs} onChange={upd('titleEs')} placeholder="Selva y rio 3D/2N" className={inp} />
            </Field>
            <Field label={lang === 'es' ? 'Título (EN)' : 'Title (EN)'}>
              <input value={f.titleEn} onChange={upd('titleEn')} placeholder="Jungle and river 3D/2N" className={inp} />
            </Field>
          </div>
          <Field label={lang === 'es' ? 'Descripción corta' : 'Short description'}>
            <input value={f.subEs} onChange={upd('subEs')} placeholder={lang === 'es' ? '3 dias de lodge, caminatas y navegacion' : '3 days of lodge, walks, and river navigation'} className={inp} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label={lang === 'es' ? 'Días *' : 'Days *'}>
              <input required type="number" min={1} value={f.durationDays} onChange={upd('durationDays')} placeholder="4" className={inp} />
            </Field>
            <Field label={lang === 'es' ? 'Noches' : 'Nights'}>
              <input type="number" min={0} value={f.durationNights} onChange={upd('durationNights')} placeholder="3" className={inp} />
            </Field>
            <Field label={lang === 'es' ? 'Precio base (USD)' : 'Base price (USD)'}>
              <input type="number" min={0} value={f.basePrice} onChange={upd('basePrice')} placeholder="890" className={inp} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label={lang === 'es' ? 'Nivel' : 'Level'}>
              <select value={f.levelEs} onChange={upd('levelEs')} className={inp}>
                <option value="Suave">{lang === 'es' ? 'Suave' : 'Easy'}</option>
                <option value="Moderado">{lang === 'es' ? 'Moderado' : 'Moderate'}</option>
                <option value="Exigente">{lang === 'es' ? 'Exigente' : 'Demanding'}</option>
              </select>
            </Field>
            <Field label="Min. pax">
              <input type="number" min={1} value={f.minPax} onChange={upd('minPax')} className={inp} />
            </Field>
            <Field label="Max. pax">
              <input type="number" min={1} value={f.maxPax} onChange={upd('maxPax')} className={inp} />
            </Field>
          </div>
          <Field label={lang === 'es' ? 'Imagen de portada' : 'Cover image'}>
            <ImageUpload
              value={f.coverImg}
              onChange={url => setF(p => ({ ...p, coverImg: url }))}
              lang={lang}
            />
          </Field>
          <div className="pt-2">
            <SubmitBtn loading={saving} label={lang === 'es' ? 'Crear tour' : 'Create tour'} />
          </div>
        </form>
      </SlideOver>
    </>
  )
}
