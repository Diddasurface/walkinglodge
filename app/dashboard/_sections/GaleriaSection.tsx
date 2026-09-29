'use client'

import { useState } from 'react'
import { TableCard } from '../_ui/TableCard'
import { Spinner } from '../_ui/Spinner'
import { EmptyState } from '../_ui/EmptyState'
import { SlideOver } from '../_ui/SlideOver'
import { Field, inp } from '../_ui/Field'
import { Feedback } from '../_ui/Feedback'
import { SubmitBtn } from '../_ui/SubmitBtn'
import { ImageUpload } from '../_ui/ImageUpload'
import type { AdminGalleryImage } from '../_lib/types'

const PUBLISH_CLS = (on: boolean) =>
  on
    ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 hover:border-red-500/20'
    : 'bg-slate-100 dark:bg-zinc-700/30 text-gray-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-400 hover:border-green-500/20'

const EMPTY = {
  url: '',
  titleEs: '',
  titleEn: '',
  captionEs: '',
  captionEn: '',
  category: 'naturaleza',
  sortOrder: '',
}

export function GaleriaSection({ lang, images, loading, onRefresh }: {
  lang: string
  images: AdminGalleryImage[]
  loading: boolean
  onRefresh: () => void
}) {
  const [open, setOpen] = useState(false)
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)
  const [f, setF] = useState(EMPTY)

  const upd = (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true); setOk(''); setErr('')
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f),
    })
    setSaving(false)

    if (res.ok) {
      setOk(lang === 'es' ? 'Imagen agregada' : 'Image added')
      setF(EMPTY)
      onRefresh()
      setTimeout(() => { setOpen(false); setOk('') }, 900)
    } else {
      const body = await res.json().catch(() => ({}))
      setErr(body.error || (lang === 'es' ? 'No se pudo agregar' : 'Could not add image'))
    }
  }

  const togglePublish = async (img: AdminGalleryImage) => {
    await fetch(`/api/admin/gallery/${img.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !img.published }),
    })
    onRefresh()
  }

  const deleteImage = async (img: AdminGalleryImage) => {
    if (!confirm(lang === 'es' ? `¿Eliminar "${img.titleEs}"?` : `Delete "${img.titleEs}"?`)) return
    const res = await fetch(`/api/admin/gallery/${img.id}`, { method: 'DELETE' })
    if (res.ok) onRefresh()
  }

  return (
    <>
      <TableCard
        title={`${lang === 'es' ? 'Galeria de naturaleza' : 'Nature gallery'} (${images.length})`}
        action={
          <button
            onClick={() => { setF(EMPTY); setOpen(true); setOk(''); setErr('') }}
            className="flex items-center gap-1.5 bg-[#E5A547] text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#f0b050] transition-colors"
            style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.04em' }}
          >
            + {lang === 'es' ? 'Nueva foto' : 'New photo'}
          </button>
        }
      >
        {loading ? <Spinner /> : images.length === 0
          ? <EmptyState label={lang === 'es' ? 'Sin fotos' : 'No photos'} />
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {images.map(img => (
                <article key={img.id} className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#111315]">
                  <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${img.url})` }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{img.titleEs}</h3>
                        <p className="text-[11px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-1">{img.category}</p>
                      </div>
                      <button
                        onClick={() => togglePublish(img)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors shrink-0 ${PUBLISH_CLS(img.published)}`}
                      >
                        {img.published ? (lang === 'es' ? 'Publicado' : 'Published') : (lang === 'es' ? 'Oculto' : 'Hidden')}
                      </button>
                    </div>
                    {img.captionEs && <p className="text-xs text-gray-500 dark:text-zinc-400 mt-3 line-clamp-2">{img.captionEs}</p>}
                    <button
                      onClick={() => deleteImage(img)}
                      className="mt-4 text-xs text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      {lang === 'es' ? 'Eliminar' : 'Delete'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
      </TableCard>

      <SlideOver open={open} onClose={() => setOpen(false)} title={lang === 'es' ? 'Nueva foto' : 'New photo'}>
        <Feedback ok={ok} err={err} />
        <form onSubmit={submit} className="space-y-4">
          <Field label={lang === 'es' ? 'Imagen *' : 'Image *'}>
            <ImageUpload value={f.url} onChange={url => setF(p => ({ ...p, url }))} lang={lang} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Titulo (ES) *' : 'Title (ES) *'}>
              <input required value={f.titleEs} onChange={upd('titleEs')} className={inp} placeholder="Rio Madre de Dios" />
            </Field>
            <Field label={lang === 'es' ? 'Titulo (EN)' : 'Title (EN)'}>
              <input value={f.titleEn} onChange={upd('titleEn')} className={inp} placeholder="Madre de Dios River" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={lang === 'es' ? 'Categoria' : 'Category'}>
              <select value={f.category} onChange={upd('category')} className={inp}>
                <option value="naturaleza">naturaleza</option>
                <option value="rio">rio</option>
                <option value="fauna">fauna</option>
                <option value="bosque">bosque</option>
                <option value="lodge">lodge</option>
              </select>
            </Field>
            <Field label={lang === 'es' ? 'Orden' : 'Order'}>
              <input type="number" value={f.sortOrder} onChange={upd('sortOrder')} className={inp} placeholder="0" />
            </Field>
          </div>
          <Field label={lang === 'es' ? 'Descripcion (ES)' : 'Description (ES)'}>
            <textarea value={f.captionEs} onChange={upd('captionEs')} className={`${inp} min-h-24 resize-y`} />
          </Field>
          <Field label={lang === 'es' ? 'Descripcion (EN)' : 'Description (EN)'}>
            <textarea value={f.captionEn} onChange={upd('captionEn')} className={`${inp} min-h-24 resize-y`} />
          </Field>
          <SubmitBtn loading={saving} label={lang === 'es' ? 'Agregar foto' : 'Add photo'} />
        </form>
      </SlideOver>
    </>
  )
}
