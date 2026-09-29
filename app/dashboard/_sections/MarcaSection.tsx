'use client'

import { useEffect, useState } from 'react'
import { TableCard } from '../_ui/TableCard'
import { Field, inp } from '../_ui/Field'
import { Feedback } from '../_ui/Feedback'
import { ImageUpload } from '../_ui/ImageUpload'
import { SubmitBtn } from '../_ui/SubmitBtn'
import type { AdminSettings } from '../_lib/types'

export function MarcaSection({ lang, settings, loading, onRefresh }: {
  lang: string
  settings: AdminSettings
  loading: boolean
  onRefresh: () => void
}) {
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    setLogoUrl(settings.logoUrl ?? '')
  }, [settings.logoUrl])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setOk('')
    setErr('')

    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logoUrl }),
    })

    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setErr(data.error ?? (lang === 'es' ? 'No se pudo guardar la marca' : 'Could not save brand settings'))
      return
    }

    setOk(lang === 'es' ? 'Logo guardado' : 'Logo saved')
    onRefresh()
    setTimeout(() => setOk(''), 2200)
  }

  return (
    <TableCard
      title={lang === 'es' ? 'Marca del sitio' : 'Site brand'}
    >
      <div className="px-5 pt-4">
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          {lang === 'es'
            ? 'Sube el logo que se mostrara en el encabezado publico.'
            : 'Upload the logo shown in the public header.'}
        </p>
      </div>
      <Feedback ok={ok} err={err} />
      <form onSubmit={submit} className="grid gap-6 p-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <Field label={lang === 'es' ? 'Logo' : 'Logo'}>
            <ImageUpload value={logoUrl} onChange={setLogoUrl} lang={lang} />
          </Field>
          <Field label={lang === 'es' ? 'URL del logo' : 'Logo URL'}>
            <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className={inp} placeholder="/uploads/logo.webp" />
          </Field>
          <p className="text-xs leading-relaxed text-gray-500 dark:text-zinc-400">
            {lang === 'es'
              ? 'Recomendado para logo: SVG si tienes vector, o PNG/WebP con fondo transparente. Para fotos del sitio usa WebP cuando sea posible.'
              : 'Recommended for logos: SVG if you have a vector file, or transparent PNG/WebP. For site photos, use WebP when possible.'}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <SubmitBtn loading={saving || loading} label={lang === 'es' ? 'Guardar marca' : 'Save brand'} />
            {logoUrl && (
              <button
                type="button"
                onClick={() => setLogoUrl('')}
                className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-sm text-gray-600 dark:text-zinc-300 hover:border-red-400/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {lang === 'es' ? 'Quitar logo' : 'Remove logo'}
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 mb-3">
            {lang === 'es' ? 'Vista previa' : 'Preview'}
          </p>
          <div className="h-28 rounded-lg bg-[#111315] flex items-center justify-center px-6">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="max-h-16 max-w-full object-contain" />
            ) : (
              <div className="flex items-center gap-3 text-white">
                <span className="w-9 h-9 rounded-full border border-white/80 flex items-center justify-center text-xs">AE</span>
                <span className="font-semibold tracking-[0.22em] text-sm">AMAZON</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </TableCard>
  )
}
