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
import type { AdminClient } from '../_lib/types'

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  return (
    <div className="w-8 h-8 rounded-full bg-[#E5A547]/15 flex items-center justify-center shrink-0 text-[#E5A547] text-xs font-bold">
      {initials}
    </div>
  )
}

export function ClientesSection({ lang, clients, loading, onRefresh }: {
  lang: string; clients: AdminClient[]; loading: boolean; onRefresh: () => void
}) {
  const [open, setOpen] = useState(false)
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' })

  const upd = (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true); setOk(''); setErr('')
    const res = await fetch('/api/admin/clients', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f),
    })
    setSaving(false)
    if (res.ok) {
      setOk(lang === 'es' ? '¡Cliente creado!' : 'Client created!')
      setF({ name: '', email: '', phone: '', password: '' })
      onRefresh(); setTimeout(() => { setOpen(false); setOk('') }, 1200)
    } else {
      const d = await res.json()
      setErr(d.error || (lang === 'es' ? 'Error al crear el cliente' : 'Error creating client'))
    }
  }

  const toggleActive = async (c: AdminClient) => {
    await fetch(`/api/admin/clients/${c.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !c.isActive }),
    })
    onRefresh()
  }

  const deleteClient = async (c: AdminClient) => {
    if (!confirm(lang === 'es' ? `¿Eliminar "${c.name}"?` : `Delete "${c.name}"?`)) return
    await fetch(`/api/admin/clients/${c.id}`, { method: 'DELETE' })
    onRefresh()
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const searchCls =
    'bg-white dark:bg-[#1c1f21] border border-slate-200 dark:border-white/8 rounded-lg px-3 py-1.5 ' +
    'text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 outline-none ' +
    'focus:border-[#E5A547]/40 w-44 transition-colors'

  return (
    <>
      <TableCard
        title={`${lang === 'es' ? 'Todos los clientes' : 'All clients'} (${clients.length})`}
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
          ? <EmptyState label={lang === 'es' ? 'Sin clientes' : 'No clients'} />
          : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-150">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0f1012]">
                    {[lang === 'es' ? 'Cliente' : 'Client', lang === 'es' ? 'Contacto' : 'Contact', lang === 'es' ? 'Reservas' : 'Bookings', lang === 'es' ? 'Registro' : 'Joined', 'Estado', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} className="border-t border-slate-100 dark:border-white/4 hover:bg-slate-50 dark:hover:bg-white/1.5 group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={c.name} />
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">{c.name}</p>
                            <p className="text-[10px] text-gray-400 dark:text-zinc-600">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-zinc-400">
                        {c.phone ?? <span className="text-gray-300 dark:text-zinc-600">—</span>}
                      </td>
                      <td className="px-5 py-4">
                        <Badge cls={c.bookingCount > 0 ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400' : undefined}>
                          {c.bookingCount}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleActive(c)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                            c.isActive
                              ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 hover:border-red-500/20'
                              : 'bg-slate-100 dark:bg-zinc-700/30 text-gray-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-400 hover:border-green-500/20'
                          }`}
                        >
                          {c.isActive ? (lang === 'es' ? 'Activo' : 'Active') : (lang === 'es' ? 'Inactivo' : 'Inactive')}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => deleteClient(c)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-400 transition-all text-sm"
                        >✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </TableCard>

      <SlideOver open={open} onClose={() => { setOpen(false); setOk(''); setErr('') }} title={lang === 'es' ? 'Nuevo cliente' : 'New client'}>
        <Feedback ok={ok} err={err} />
        <form onSubmit={submit} className="space-y-4">
          <Field label={lang === 'es' ? 'Nombre completo *' : 'Full name *'}>
            <input required value={f.name} onChange={upd('name')} placeholder="Ana García" className={inp} />
          </Field>
          <Field label="Email *">
            <input required type="email" value={f.email} onChange={upd('email')} placeholder="ana@email.com" className={inp} />
          </Field>
          <Field label={lang === 'es' ? 'Teléfono' : 'Phone'}>
            <input value={f.phone} onChange={upd('phone')} placeholder="+51 999 123 456" className={inp} />
          </Field>
          <Field label={lang === 'es' ? 'Contraseña *' : 'Password *'}>
            <input required type="password" value={f.password} onChange={upd('password')} placeholder="········" className={inp} />
          </Field>
          <div className="pt-2">
            <SubmitBtn loading={saving} label={lang === 'es' ? 'Crear cliente' : 'Create client'} />
          </div>
        </form>
      </SlideOver>
    </>
  )
}
