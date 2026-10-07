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
import type { AdminHotel, AdminDestination } from '../_lib/types'

const STARS = [1, 2, 3, 4, 5]

const PUBLISH_CLS = (on: boolean) =>
  on
    ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 hover:border-red-500/20'
    : 'bg-slate-100 dark:bg-zinc-700/30 text-gray-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-400 hover:border-green-500/20'

function StarRating({ n }: { n: number }) {
  return (
    <span className="text-amber-400 text-xs tracking-tighter">
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )
}

export function HotelesSection({ lang, hotels, destinations, loading, onRefresh }: {
  lang: string; hotels: AdminHotel[]; destinations: AdminDestination[]; loading: boolean; onRefresh: () => void
}) {
  const [open, setOpen] = useState(false)
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [f, setF] = useState({
    nameEs: '', nameEn: '', stars: '3',
    destinationId: destinations[0]?.id ?? '',
    coverImg: '', address: '', phone: '', email: '',
    checkInTime: '14:00', checkOutTime: '12:00',
  })

  const upd = (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true); setOk(''); setErr('')
    const res = await fetch('/api/admin/hotels', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f),
    })
    setSaving(false)
    if (res.ok) {
      setOk(lang === 'es' ? '¡Hotel creado!' : 'Hotel created!')
      setF({ nameEs: '', nameEn: '', stars: '3', destinationId: destinations[0]?.id ?? '', coverImg: '', address: '', phone: '', email: '', checkInTime: '14:00', checkOutTime: '12:00' })
      onRefresh(); setTimeout(() => { setOpen(false); setOk('') }, 1200)
    } else {
      const d = await res.json().catch(() => ({}))
      setErr(d.error || (lang === 'es' ? 'Error al crear el hotel' : 'Error creating hotel'))
    }
  }

  const togglePublish = async (h: AdminHotel) => {
    await fetch(`/api/admin/hotels/${h.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !h.published }),
    })
    onRefresh()
  }

  const deleteHotel = async (h: AdminHotel) => {
    if (!confirm(lang === 'es' ? `¿Eliminar "${h.nameEs}"?` : `Delete "${h.nameEs}"?`)) return
    await fetch(`/api/admin/hotels/${h.id}`, { method: 'DELETE' })
    onRefresh()
  }

  const filtered = hotels.filter(h =>
    h.nameEs.toLowerCase().includes(search.toLowerCase()) ||
    h.destinationName.toLowerCase().includes(search.toLowerCase())
  )

  const searchCls =
    'bg-white dark:bg-[#1c1f21] border border-slate-200 dark:border-white/8 rounded-lg px-3 py-1.5 ' +
    'text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 outline-none ' +
    'focus:border-[#E5A547]/40 w-44 transition-colors'

  return (
    <>
      <TableCard
        title={`${lang === 'es' ? 'Todos los hoteles' : 'All hotels'} (${hotels.length})`}
        action={
          <div className="flex items-center gap-3">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang === 'es' ? 'Buscar…' : 'Search…'} className={searchCls} />
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
          ? <EmptyState label={lang === 'es' ? 'Sin hoteles' : 'No hotels'} />
          : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-150">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0f1012]">
                    {[lang === 'es' ? 'Hotel' : 'Hotel', lang === 'es' ? 'Destino' : 'Destination', lang === 'es' ? 'Estrellas' : 'Stars', lang === 'es' ? 'Habitaciones' : 'Rooms', 'Estado', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(h => (
                    <tr key={h.id} className="border-t border-slate-100 dark:border-white/4 hover:bg-slate-50 dark:hover:bg-white/1.5 group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {h.coverImg
                            ? <img src={h.coverImg} alt={h.nameEs} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                            : <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-gray-400 dark:text-zinc-600 text-lg">🏨</div>
                          }
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">{h.nameEs}</p>
                            {h.address && <p className="text-[10px] text-gray-400 dark:text-zinc-600 truncate max-w-40">{h.address}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-zinc-400">{h.destinationName}</td>
                      <td className="px-5 py-4"><StarRating n={h.stars} /></td>
                      <td className="px-5 py-4">
                        <Badge>{h.roomCount} {lang === 'es' ? 'hab.' : 'rooms'}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => togglePublish(h)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${PUBLISH_CLS(h.published)}`}
                        >
                          {h.published ? (lang === 'es' ? 'Publicado' : 'Published') : (lang === 'es' ? 'Borrador' : 'Draft')}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => deleteHotel(h)}
                          className="w-8 h-8 inline-flex items-center justify-center rounded-md text-black dark:text-zinc-200 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors text-base"
                        >✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </TableCard>

      <SlideOver open={open} onClose={() => { setOpen(false); setOk(''); setErr('') }} title={lang === 'es' ? 'Nuevo hotel' : 'New hotel'}>
        <Feedback ok={ok} err={err} />
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Nombre (ES) *' : 'Name (ES) *'}>
              <input required value={f.nameEs} onChange={upd('nameEs')} placeholder="Walking Lodge" className={inp} />
            </Field>
            <Field label={lang === 'es' ? 'Nombre (EN)' : 'Name (EN)'}>
              <input value={f.nameEn} onChange={upd('nameEn')} placeholder="Walking Lodge" className={inp} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Destino *' : 'Destination *'}>
              <select required value={f.destinationId} onChange={upd('destinationId')} className={inp}>
                {destinations.length === 0
                  ? <option value="">{lang === 'es' ? 'Sin destinos aún' : 'No destinations yet'}</option>
                  : destinations.map(d => <option key={d.id} value={d.id}>{d.nameEs}</option>)
                }
              </select>
            </Field>
            <Field label={lang === 'es' ? 'Estrellas *' : 'Stars *'}>
              <select required value={f.stars} onChange={upd('stars')} className={inp}>
                {STARS.map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
              </select>
            </Field>
          </div>
          <Field label={lang === 'es' ? 'Dirección' : 'Address'}>
            <input value={f.address} onChange={upd('address')} placeholder="Rio Madre de Dios, Tambopata" className={inp} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Teléfono' : 'Phone'}>
              <input value={f.phone} onChange={upd('phone')} placeholder="+51 84 231234" className={inp} />
            </Field>
            <Field label="Email">
              <input type="email" value={f.email} onChange={upd('email')} placeholder="reservas@hotel.com" className={inp} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Check-in">
              <input value={f.checkInTime} onChange={upd('checkInTime')} placeholder="14:00" className={inp} />
            </Field>
            <Field label="Check-out">
              <input value={f.checkOutTime} onChange={upd('checkOutTime')} placeholder="12:00" className={inp} />
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
            <SubmitBtn loading={saving} label={lang === 'es' ? 'Crear hotel' : 'Create hotel'} />
          </div>
        </form>
      </SlideOver>
    </>
  )
}
