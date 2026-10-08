'use client'

import { Fragment, useState } from 'react'
import { TableCard } from '../_ui/TableCard'
import { Badge } from '../_ui/Badge'
import { Spinner } from '../_ui/Spinner'
import { EmptyState } from '../_ui/EmptyState'
import { SlideOver } from '../_ui/SlideOver'
import { Field, inp } from '../_ui/Field'
import { Feedback } from '../_ui/Feedback'
import { SubmitBtn } from '../_ui/SubmitBtn'
import type { AdminBooking, AdminClient } from '../_lib/types'

const STATUS_CFG: Record<string, { es: string; en: string; cls: string }> = {
  NEW:         { es: 'Nuevo',        en: 'New',         cls: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400' },
  CONTACTED:   { es: 'Contactado',   en: 'Contacted',   cls: 'bg-sky-500/15 text-sky-700 dark:text-sky-400' },
  QUOTED:      { es: 'Cotizado',     en: 'Quoted',      cls: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400' },
  PENDING:     { es: 'Pendiente',    en: 'Pending',     cls: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400' },
  CONFIRMED:   { es: 'Confirmado',   en: 'Confirmed',   cls: 'bg-blue-500/15   text-blue-700   dark:text-blue-400' },
  PAID:        { es: 'Pagado',       en: 'Paid',        cls: 'bg-green-500/15  text-green-700  dark:text-green-400' },
  IN_PROGRESS: { es: 'En curso',     en: 'In progress', cls: 'bg-purple-500/15 text-purple-700 dark:text-purple-400' },
  COMPLETED:   { es: 'Completado',   en: 'Completed',   cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
  CANCELLED:   { es: 'Cancelado',    en: 'Cancelled',   cls: 'bg-red-500/15    text-red-700    dark:text-red-400' },
  REFUNDED:    { es: 'Reembolsado',  en: 'Refunded',    cls: 'bg-orange-500/15 text-orange-700 dark:text-orange-400' },
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function ReservasSection({ lang, bookings, clients, loading, onRefresh }: {
  lang: string; bookings: AdminBooking[]; clients: AdminClient[]; loading: boolean; onRefresh: () => void
}) {
  const [open, setOpen] = useState(false)
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sourceFilter, setSourceFilter] = useState('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [f, setF] = useState({
    userId: clients[0]?.id ?? '',
    totalAmount: '', pax: '1',
    startDate: '', endDate: '',
    specialRequests: '',
  })

  const upd = (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true); setOk(''); setErr('')
    const res = await fetch('/api/admin/bookings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f),
    })
    setSaving(false)
    if (res.ok) {
      setOk(lang === 'es' ? '¡Reserva creada!' : 'Booking created!')
      setF({ userId: clients[0]?.id ?? '', totalAmount: '', pax: '1', startDate: '', endDate: '', specialRequests: '' })
      onRefresh(); setTimeout(() => { setOpen(false); setOk('') }, 1200)
    } else {
      const d = await res.json()
      setErr(d.error || (lang === 'es' ? 'Error al crear la reserva' : 'Error creating booking'))
    }
  }

  const changeStatus = async (b: AdminBooking, status: string) => {
    await fetch(`/api/admin/bookings/${b.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    onRefresh()
  }

  const deleteBooking = async (b: AdminBooking) => {
    if (!confirm(lang === 'es' ? `¿Eliminar reserva "${b.reference}"?` : `Delete booking "${b.reference}"?`)) return
    await fetch(`/api/admin/bookings/${b.id}`, { method: 'DELETE' })
    onRefresh()
  }

  const filtered = bookings
    .filter(b => statusFilter === 'ALL' || b.status === statusFilter)
    .filter(b => sourceFilter === 'ALL' || b.source === sourceFilter)
    .filter(b =>
      b.reference.toLowerCase().includes(search.toLowerCase()) ||
      b.clientName.toLowerCase().includes(search.toLowerCase()) ||
      b.clientEmail.toLowerCase().includes(search.toLowerCase())
    )

  const searchCls =
    'bg-white dark:bg-[#1c1f21] border border-slate-200 dark:border-white/8 rounded-lg px-3 py-1.5 ' +
    'text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 outline-none ' +
    'focus:border-[#E5A547]/40 w-40 transition-colors'

  const selectCls = searchCls.replace('w-40', 'w-36')

  return (
    <>
      <TableCard
        title={`${lang === 'es' ? 'Todas las reservas' : 'All bookings'} (${bookings.length})`}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className={selectCls}>
              <option value="ALL">{lang === 'es' ? 'Todos los origenes' : 'All sources'}</option>
              <option value="CONTACT">{lang === 'es' ? 'Contacto' : 'Contact'}</option>
              <option value="DASHBOARD">{lang === 'es' ? 'Reserva interna' : 'Internal booking'}</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selectCls}>
              <option value="ALL">{lang === 'es' ? 'Todos' : 'All'}</option>
              {Object.entries(STATUS_CFG).map(([v, c]) => (
                <option key={v} value={v}>{lang === 'es' ? c.es : c.en}</option>
              ))}
            </select>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang === 'es' ? 'Buscar…' : 'Search…'} className={searchCls} />
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1.5 bg-[#E5A547] text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#f0b050] transition-colors"
              style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.04em' }}
            >
              + {lang === 'es' ? 'Nueva' : 'New'}
            </button>
          </div>
        }
      >
        {loading ? <Spinner /> : filtered.length === 0
          ? <EmptyState label={lang === 'es' ? 'Sin reservas' : 'No bookings'} />
          : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-225">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0f1012]">
                    {[lang === 'es' ? 'Referencia' : 'Reference', lang === 'es' ? 'Origen' : 'Source', lang === 'es' ? 'Cliente' : 'Client', lang === 'es' ? 'Fechas' : 'Dates', 'Pax', 'Total', lang === 'es' ? 'Estado' : 'Status', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => {
                    const sc = STATUS_CFG[b.status] ?? STATUS_CFG.PENDING
                    const isContact = b.source === 'CONTACT'
                    return (
                      <Fragment key={b.id}>
                      <tr
                        onClick={() => setExpandedId(current => current === b.id ? null : b.id)}
                        className={`border-t cursor-pointer transition-colors group ${isContact
                          ? 'border-cyan-200 bg-cyan-50/70 hover:bg-cyan-100/70 dark:border-cyan-900/60 dark:bg-cyan-950/20 dark:hover:bg-cyan-950/35'
                          : 'border-amber-100 bg-amber-50/25 hover:bg-amber-50/70 dark:border-amber-950/40 dark:bg-amber-950/10 dark:hover:bg-amber-950/20'}`}
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-900 dark:text-white font-mono">{b.reference}</p>
                          <p className="text-[10px] text-gray-500 dark:text-zinc-500">{lang === 'es' ? 'Enviado' : 'Submitted'}: {fmtDate(b.createdAt)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded px-2 py-1 text-[10px] font-bold uppercase ${isContact ? 'bg-cyan-600 text-white' : 'bg-amber-400 text-black'}`}>
                            {isContact ? (lang === 'es' ? 'Contacto' : 'Contact') : (lang === 'es' ? 'Interna' : 'Internal')}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-900 dark:text-white">{b.clientName}</p>
                          <p className="text-[10px] text-gray-400 dark:text-zinc-600">{b.clientEmail}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                          {b.startDate && b.endDate
                            ? `${fmtDate(b.startDate)} - ${fmtDate(b.endDate)}`
                            : b.requestedDates || (lang === 'es' ? 'Por definir' : 'To be defined')}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 dark:text-zinc-400">{b.pax}</td>
                        <td className="px-5 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          {b.totalAmount === null ? (lang === 'es' ? 'Por cotizar' : 'To be quoted') : `$${b.totalAmount.toLocaleString()} ${b.currency}`}
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={b.status}
                            onClick={e => e.stopPropagation()}
                            onChange={e => changeStatus(b, e.target.value)}
                            className={`text-[11px] font-medium rounded px-2 py-1 border outline-none cursor-pointer transition-colors ${sc.cls} border-current/20 bg-transparent`}
                          >
                            {Object.entries(STATUS_CFG).map(([v, c]) => (
                              <option key={v} value={v}>{lang === 'es' ? c.es : c.en}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={e => { e.stopPropagation(); deleteBooking(b) }}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-black dark:text-zinc-200 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors text-base"
                          >✕</button>
                        </td>
                      </tr>
                      {expandedId === b.id && (
                        <tr className={isContact ? 'bg-cyan-50 dark:bg-cyan-950/20' : 'bg-amber-50/50 dark:bg-amber-950/10'}>
                          <td colSpan={8} className="px-5 pb-5 pt-1">
                            <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-4 text-xs dark:border-white/8 dark:bg-[#151719] md:grid-cols-3">
                              <div>
                                <p className="mb-1 text-[10px] uppercase text-gray-400">{lang === 'es' ? 'Seguimiento' : 'Tracking'}</p>
                                <p className="text-gray-800 dark:text-zinc-200">{lang === 'es' ? 'Estado actual' : 'Current status'}: {lang === 'es' ? sc.es : sc.en}</p>
                                <p className="text-gray-500 dark:text-zinc-400">{lang === 'es' ? 'Actualizado' : 'Updated'}: {fmtDate(b.updatedAt)}</p>
                              </div>
                              <div>
                                <p className="mb-1 text-[10px] uppercase text-gray-400">{lang === 'es' ? 'Datos del viajero' : 'Traveler details'}</p>
                                <p className="text-gray-800 dark:text-zinc-200">{b.contactPhone || (lang === 'es' ? 'Sin telefono' : 'No phone')}</p>
                                <p className="text-gray-500 dark:text-zinc-400">{b.nationality || (lang === 'es' ? 'Nacionalidad no registrada' : 'No nationality')}</p>
                              </div>
                              <div>
                                <p className="mb-1 text-[10px] uppercase text-gray-400">{lang === 'es' ? 'Viaje solicitado' : 'Requested trip'}</p>
                                <p className="text-gray-800 dark:text-zinc-200">{b.destinationInterest || (lang === 'es' ? 'A medida' : 'Custom')}</p>
                                <p className="text-gray-500 dark:text-zinc-400">{b.requestedDates || (lang === 'es' ? 'Fechas por definir' : 'Dates to be defined')}</p>
                              </div>
                              {(b.message || b.specialRequests) && (
                                <div className="md:col-span-3">
                                  <p className="mb-1 text-[10px] uppercase text-gray-400">{lang === 'es' ? 'Mensaje y notas' : 'Message and notes'}</p>
                                  <p className="whitespace-pre-wrap text-gray-700 dark:text-zinc-300">{b.message || b.specialRequests}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
      </TableCard>

      <SlideOver open={open} onClose={() => { setOpen(false); setOk(''); setErr('') }} title={lang === 'es' ? 'Nueva reserva' : 'New booking'}>
        <Feedback ok={ok} err={err} />
        <form onSubmit={submit} className="space-y-4">
          <Field label={lang === 'es' ? 'Cliente *' : 'Client *'}>
            <select required value={f.userId} onChange={upd('userId')} className={inp}>
              {clients.length === 0
                ? <option value="">{lang === 'es' ? 'Sin clientes aún' : 'No clients yet'}</option>
                : clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)
              }
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Fecha inicio *' : 'Start date *'}>
              <input required type="date" value={f.startDate} onChange={upd('startDate')} className={inp} />
            </Field>
            <Field label={lang === 'es' ? 'Fecha fin *' : 'End date *'}>
              <input required type="date" value={f.endDate} onChange={upd('endDate')} className={inp} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Pax *">
              <input required type="number" min={1} value={f.pax} onChange={upd('pax')} className={inp} />
            </Field>
            <Field label={lang === 'es' ? 'Total USD *' : 'Total USD *'}>
              <input required type="number" min={0} value={f.totalAmount} onChange={upd('totalAmount')} placeholder="1500" className={inp} />
            </Field>
          </div>
          <Field label={lang === 'es' ? 'Solicitudes especiales' : 'Special requests'}>
            <textarea rows={2} value={f.specialRequests} onChange={upd('specialRequests')} placeholder={lang === 'es' ? 'Notas adicionales…' : 'Additional notes…'} className={`${inp} resize-none`} />
          </Field>
          <div className="pt-2">
            <SubmitBtn loading={saving} label={lang === 'es' ? 'Crear reserva' : 'Create booking'} />
          </div>
        </form>
      </SlideOver>
    </>
  )
}
