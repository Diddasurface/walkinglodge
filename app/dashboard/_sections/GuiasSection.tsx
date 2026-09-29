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
import type { AdminGuide } from '../_lib/types'

const PUBLISH_CLS = (on: boolean) =>
  on
    ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 hover:border-red-500/20'
    : 'bg-slate-100 dark:bg-zinc-700/30 text-gray-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-400 hover:border-green-500/20'

export function GuiasSection({ lang, guides, loading, onRefresh }: {
  lang: string; guides: AdminGuide[]; loading: boolean; onRefresh: () => void
}) {
  const [open, setOpen] = useState(false)
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [f, setF] = useState({
    name: '', baseEs: '', baseEn: '', years: '', langs: 'ES,EN',
    specEs: '', specEn: '', bioEs: '', bioEn: '', img: '',
  })

  const [editOpen, setEditOpen] = useState(false)
  const [editOk, setEditOk] = useState('')
  const [editErr, setEditErr] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editId, setEditId] = useState('')
  const [ef, setEf] = useState({
    name: '', baseEs: '', baseEn: '', years: '', langs: '',
    specEs: '', specEn: '', bioEs: '', bioEn: '', img: '',
  })

  const upd = (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF(p => ({ ...p, [k]: e.target.value }))

  const updE = (k: keyof typeof ef) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setEf(p => ({ ...p, [k]: e.target.value }))

  const openEdit = (g: AdminGuide) => {
    setEditId(g.id)
    setEf({
      name: g.name, baseEs: g.baseEs, baseEn: g.baseEn ?? '',
      years: String(g.years), langs: g.langs,
      specEs: g.specEs, specEn: g.specEn ?? '',
      bioEs: g.bioEs ?? '', bioEn: g.bioEn ?? '', img: g.img,
    })
    setEditOk(''); setEditErr('')
    setEditOpen(true)
  }

  const submitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditSaving(true); setEditOk(''); setEditErr('')
    const res = await fetch(`/api/admin/guides/${editId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...ef, years: Number(ef.years) }),
    })
    setEditSaving(false)
    if (res.ok) {
      setEditOk(lang === 'es' ? '¡Guardado!' : 'Saved!')
      onRefresh()
      setTimeout(() => { setEditOpen(false); setEditOk('') }, 1200)
    } else {
      const d = await res.json().catch(() => ({}))
      setEditErr(d.error || (lang === 'es' ? 'Error al guardar' : 'Error saving'))
    }
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true); setOk(''); setErr('')
    const res = await fetch('/api/admin/guides', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, years: Number(f.years) }),
    })
    setSaving(false)
    if (res.ok) {
      setOk(lang === 'es' ? '¡Guía creado!' : 'Guide created!')
      setF({ name: '', baseEs: '', baseEn: '', years: '', langs: 'ES,EN', specEs: '', specEn: '', bioEs: '', bioEn: '', img: '' })
      onRefresh()
      setTimeout(() => { setOpen(false); setOk('') }, 1200)
    } else {
      const d = await res.json().catch(() => ({}))
      setErr(d.error || (lang === 'es' ? 'Error al crear el guía' : 'Error creating guide'))
    }
  }

  const togglePublish = async (g: AdminGuide) => {
    await fetch(`/api/admin/guides/${g.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !g.published }),
    })
    onRefresh()
  }

  const deleteGuide = async (g: AdminGuide) => {
    if (!confirm(lang === 'es' ? `¿Eliminar "${g.name}"?` : `Delete "${g.name}"?`)) return
    await fetch(`/api/admin/guides/${g.id}`, { method: 'DELETE' })
    onRefresh()
  }

  const filtered = guides.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  const searchCls =
    'bg-white dark:bg-[#1c1f21] border border-slate-200 dark:border-white/[0.08] rounded-lg px-3 py-1.5 ' +
    'text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 outline-none ' +
    'focus:border-[#E5A547]/40 w-36 transition-colors'

  return (
    <>
      <TableCard
        title={`${lang === 'es' ? 'Todos los guías' : 'All guides'} (${guides.length})`}
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
          ? <EmptyState label={lang === 'es' ? 'Sin guías' : 'No guides'} />
          : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[580px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0f1012]">
                    {['Nombre', lang === 'es' ? 'Base' : 'Location', lang === 'es' ? 'Idiomas' : 'Languages', lang === 'es' ? 'Experiencia' : 'Experience', 'Estado', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(g => (
                    <tr key={g.id} className="border-t border-slate-100 dark:border-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.015] group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {g.img && <img src={g.img} alt={g.name} className="w-8 h-8 rounded-full object-cover shrink-0 opacity-80" />}
                          <span className="text-sm text-gray-900 dark:text-white">{g.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-zinc-400">{g.baseEs}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {(g.langs || '').split(',').map((l: string) => <Badge key={l}>{l.trim()}</Badge>)}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-zinc-400">{g.years} {lang === 'es' ? 'años' : 'yrs'}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => togglePublish(g)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${PUBLISH_CLS(g.published)}`}
                        >
                          {g.published ? (lang === 'es' ? 'Activo' : 'Active') : (lang === 'es' ? 'Inactivo' : 'Inactive')}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => openEdit(g)}
                            className="text-gray-400 dark:text-zinc-600 hover:text-[#E5A547] dark:hover:text-[#E5A547] transition-colors"
                            title={lang === 'es' ? 'Editar' : 'Edit'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteGuide(g)}
                            className="text-gray-400 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm"
                            title={lang === 'es' ? 'Eliminar' : 'Delete'}
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

      <SlideOver open={editOpen} onClose={() => { setEditOpen(false); setEditOk(''); setEditErr('') }} title={lang === 'es' ? 'Editar guía' : 'Edit guide'}>
        <Feedback ok={editOk} err={editErr} />
        <form onSubmit={submitEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Nombre *' : 'Name *'}>
              <input required value={ef.name} onChange={updE('name')} placeholder="Mariela Flores" className={inp} />
            </Field>
            <Field label={lang === 'es' ? 'Años de exp. *' : 'Years of exp. *'}>
              <input required type="number" min={0} value={ef.years} onChange={updE('years')} placeholder="10" className={inp} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Base (ES)' : 'Location (ES)'}>
              <input value={ef.baseEs} onChange={updE('baseEs')} placeholder="Puerto Maldonado · Tambopata" className={inp} />
            </Field>
            <Field label={lang === 'es' ? 'Base (EN)' : 'Location (EN)'}>
              <input value={ef.baseEn} onChange={updE('baseEn')} placeholder="Puerto Maldonado · Tambopata" className={inp} />
            </Field>
          </div>
          <Field label={lang === 'es' ? 'Idiomas (separados por coma)' : 'Languages (comma-separated)'}>
            <input value={ef.langs} onChange={updE('langs')} placeholder="ES, EN, QU" className={inp} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Especialidad (ES)' : 'Specialty (ES)'}>
              <input value={ef.specEs} onChange={updE('specEs')} placeholder="Aves · Caminatas de selva" className={inp} />
            </Field>
            <Field label={lang === 'es' ? 'Especialidad (EN)' : 'Specialty (EN)'}>
              <input value={ef.specEn} onChange={updE('specEn')} placeholder="Birding · Jungle walks" className={inp} />
            </Field>
          </div>
          <Field label={lang === 'es' ? 'Biografía corta (ES)' : 'Short bio (ES)'}>
            <textarea rows={2} value={ef.bioEs} onChange={updE('bioEs')} placeholder={lang === 'es' ? 'Breve descripción…' : 'Short description…'} className={`${inp} resize-none`} />
          </Field>
          <Field label={lang === 'es' ? 'Biografía corta (EN)' : 'Short bio (EN)'}>
            <textarea rows={2} value={ef.bioEn} onChange={updE('bioEn')} placeholder="Short description…" className={`${inp} resize-none`} />
          </Field>
          <Field label={lang === 'es' ? 'Foto' : 'Photo'}>
            <ImageUpload value={ef.img} onChange={url => setEf(p => ({ ...p, img: url }))} lang={lang} />
          </Field>
          <div className="pt-2">
            <SubmitBtn loading={editSaving} label={lang === 'es' ? 'Guardar cambios' : 'Save changes'} />
          </div>
        </form>
      </SlideOver>

      <SlideOver open={open} onClose={() => { setOpen(false); setOk(''); setErr('') }} title={lang === 'es' ? 'Nuevo guía' : 'New guide'}>
        <Feedback ok={ok} err={err} />
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Nombre *' : 'Name *'}>
              <input required value={f.name} onChange={upd('name')} placeholder="Mariela Flores" className={inp} />
            </Field>
            <Field label={lang === 'es' ? 'Años de exp. *' : 'Years of exp. *'}>
              <input required type="number" min={0} value={f.years} onChange={upd('years')} placeholder="10" className={inp} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Base (ES)' : 'Location (ES)'}>
              <input value={f.baseEs} onChange={upd('baseEs')} placeholder="Puerto Maldonado · Tambopata" className={inp} />
            </Field>
            <Field label={lang === 'es' ? 'Base (EN)' : 'Location (EN)'}>
              <input value={f.baseEn} onChange={upd('baseEn')} placeholder="Puerto Maldonado · Tambopata" className={inp} />
            </Field>
          </div>
          <Field label={lang === 'es' ? 'Idiomas (separados por coma)' : 'Languages (comma-separated)'}>
            <input value={f.langs} onChange={upd('langs')} placeholder="ES, EN, QU" className={inp} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Especialidad (ES)' : 'Specialty (ES)'}>
              <input value={f.specEs} onChange={upd('specEs')} placeholder="Aves · Caminatas de selva" className={inp} />
            </Field>
            <Field label={lang === 'es' ? 'Especialidad (EN)' : 'Specialty (EN)'}>
              <input value={f.specEn} onChange={upd('specEn')} placeholder="Birding · Jungle walks" className={inp} />
            </Field>
          </div>
          <Field label={lang === 'es' ? 'Biografía corta (ES)' : 'Short bio (ES)'}>
            <textarea rows={2} value={f.bioEs} onChange={upd('bioEs')} placeholder={lang === 'es' ? 'Breve descripción…' : 'Short description…'} className={`${inp} resize-none`} />
          </Field>
          <Field label={lang === 'es' ? 'Biografía corta (EN)' : 'Short bio (EN)'}>
            <textarea rows={2} value={f.bioEn} onChange={upd('bioEn')} placeholder="Short description…" className={`${inp} resize-none`} />
          </Field>
          <Field label={lang === 'es' ? 'Foto' : 'Photo'}>
            <ImageUpload
              value={f.img}
              onChange={url => setF(p => ({ ...p, img: url }))}
              lang={lang}
            />
          </Field>
          <div className="pt-2">
            <SubmitBtn loading={saving} label={lang === 'es' ? 'Crear guía' : 'Create guide'} />
          </div>
        </form>
      </SlideOver>
    </>
  )
}
