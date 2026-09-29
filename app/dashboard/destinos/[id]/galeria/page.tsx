'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { MultiImageUpload } from '@/app/dashboard/_ui/MultiImageUpload'
import { Field, inp } from '@/app/dashboard/_ui/Field'
import { parseVideoUrl } from '@/lib/media'

const ACCENT = '#E5A547'
const DF = 'var(--font-oswald), Oswald, sans-serif'

interface MediaItem {
  id: string
  type: string
  url: string
  provider: string | null
  thumbUrl: string | null
  captionEs: string | null
  captionEn: string | null
  sortOrder: number
}

interface DestInfo {
  id: string
  nameEs: string
  slug: string
  coverImg: string
}

// ─── Inline caption editor ────────────────────────────────────────────────────

function CaptionCell({
  value, placeholder, onSave,
}: { value: string | null; placeholder: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')

  const commit = () => { setEditing(false); if (draft !== (value ?? '')) onSave(draft) }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value ?? ''); setEditing(false) } }}
        className="w-full bg-transparent border-b border-[#E5A547]/60 text-xs text-white outline-none pb-0.5"
        placeholder={placeholder}
      />
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="text-left w-full text-xs text-zinc-500 hover:text-zinc-200 transition-colors truncate"
      title={value ?? placeholder}
    >
      {value || <span className="italic opacity-40">{placeholder}</span>}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GaleriaPage() {
  const { data: session, status } = useSession()
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const [dest, setDest]       = useState<DestInfo | null>(null)
  const [items, setItems]     = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [vidUrl, setVidUrl]   = useState('')
  const [vidThumb, setVidThumb] = useState('')
  const [vidCapEs, setVidCapEs] = useState('')
  const [vidCapEn, setVidCapEn] = useState('')
  const [addingVid, setAddingVid] = useState(false)
  const [vidErr, setVidErr]   = useState('')
  const [showVidForm, setShowVidForm] = useState(false)

  useEffect(() => { if (status === 'unauthenticated') router.push('/login') }, [status, router])

  const load = useCallback(async () => {
    if (!params?.id) return
    setLoading(true)
    const [destRes, mediaRes] = await Promise.all([
      fetch(`/api/admin/destinations/${params.id}`),
      fetch(`/api/admin/destinations/${params.id}/media`),
    ])
    if (destRes.ok) setDest(await destRes.json())
    if (mediaRes.ok) setItems(await mediaRes.json())
    setLoading(false)
  }, [params?.id])

  useEffect(() => { if (status === 'authenticated') load() }, [status, load])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handlePhotoUploaded = async (url: string) => {
    const res = await fetch(`/api/admin/destinations/${params.id}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'image', url }),
    })
    if (res.ok) { const item = await res.json(); setItems(p => [...p, item]) }
  }

  const handleAddVideo = async () => {
    if (!vidUrl) return
    setAddingVid(true); setVidErr('')
    const res = await fetch(`/api/admin/destinations/${params.id}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'video', url: vidUrl, thumbUrl: vidThumb || null, captionEs: vidCapEs || null, captionEn: vidCapEn || null }),
    })
    setAddingVid(false)
    if (res.ok) {
      const newItem = await res.json()
      setItems(p => [...p, newItem])
      setVidUrl(''); setVidThumb(''); setVidCapEs(''); setVidCapEn('')
      setShowVidForm(false)
    } else {
      const d = await res.json().catch(() => ({}))
      setVidErr(d.error || 'Error al agregar video')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este elemento de la galería?')) return
    await fetch(`/api/admin/destinations/${params?.id}/media/${id}`, { method: 'DELETE' })
    setItems(p => p.filter(m => m.id !== id))
  }

  const handleCaption = async (id: string, captionEs: string, captionEn: string) => {
    await fetch(`/api/admin/destinations/${params?.id}/media/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ captionEs, captionEn }),
    })
    setItems(p => p.map(m => m.id === id ? { ...m, captionEs, captionEn } : m))
  }

  const handleMove = async (idx: number, dir: -1 | 1) => {
    const next = idx + dir
    if (next < 0 || next >= items.length) return
    const newItems = [...items]
    ;[newItems[idx], newItems[next]] = [newItems[next], newItems[idx]]
    // update sortOrder for both
    const a = newItems[idx], b = newItems[next]
    setItems(newItems)
    await Promise.all([
      fetch(`/api/admin/destinations/${params?.id}/media/${a.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sortOrder: idx }) }),
      fetch(`/api/admin/destinations/${params?.id}/media/${b.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sortOrder: next }) }),
    ])
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  const thumbOf = (m: MediaItem) => m.type === 'video' ? (m.thumbUrl ?? '') : m.url

  // ── Render ────────────────────────────────────────────────────────────────

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#0b0c0d] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E5A547]/20 border-t-[#E5A547] rounded-full animate-spin" />
      </div>
    )
  }

  if (!session || !dest) return null

  const photos = items.filter(m => m.type === 'image')
  const videos = items.filter(m => m.type === 'video')

  return (
    <div className="min-h-screen bg-[#0b0c0d] text-white">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-20 bg-[#0b0c0d]/95 backdrop-blur border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors text-sm"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Dashboard
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-zinc-400 text-sm">Destinos</span>
          <span className="text-white/20">/</span>

          <div className="flex items-center gap-2.5 min-w-0">
            {dest.coverImg && (
              <img src={dest.coverImg} alt="" className="w-7 h-7 rounded-md object-cover shrink-0 opacity-80" />
            )}
            <span className="text-sm font-medium text-white truncate">{dest.nameEs.replace(/\n/g, ' ')}</span>
          </div>

          <span
            className="ml-auto text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border"
            style={{ color: ACCENT, borderColor: `${ACCENT}40`, background: `${ACCENT}12`, fontFamily: DF }}
          >
            Galería
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* ── Stats bar ── */}
        <div className="flex items-center gap-6 text-xs text-zinc-500">
          <span><strong className="text-white text-base font-semibold" style={{ fontFamily: DF }}>{items.length}</strong> elementos</span>
          <span className="text-white/10">·</span>
          <span>{photos.length} foto{photos.length !== 1 ? 's' : ''}</span>
          <span className="text-white/10">·</span>
          <span>{videos.length} video{videos.length !== 1 ? 's' : ''}</span>
          {items.length > 0 && (
            <>
              <span className="text-white/10">·</span>
              <span className="text-zinc-600">El orden se refleja en la vista pública</span>
            </>
          )}
        </div>

        {/* ── Upload zone ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Agregar contenido</h2>
            <button
              onClick={() => setShowVidForm(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                showVidForm
                  ? 'bg-[#E5A547]/10 border-[#E5A547]/30 text-[#E5A547]'
                  : 'border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
              }`}
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              {showVidForm ? 'Ocultar form de video' : 'Agregar video'}
            </button>
          </div>

          <div className={`grid gap-4 ${showVidForm ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Photos */}
            <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-5">
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">📷 Fotos — arrastra o selecciona múltiples</p>
              <MultiImageUpload onUploadEach={handlePhotoUploaded} lang="es" />
            </div>

            {/* Video */}
            {showVidForm && (
              <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-5 space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">▶ Video — YouTube, Vimeo o .mp4</p>
                <Field label="URL del video *">
                  <input
                    value={vidUrl}
                    onChange={e => {
                      const url = e.target.value
                      const parsed = parseVideoUrl(url)
                      setVidUrl(url)
                      if (parsed?.autoThumb && !vidThumb) setVidThumb(parsed.autoThumb)
                    }}
                    placeholder="https://youtube.com/watch?v=..."
                    className={inp}
                  />
                </Field>
                {vidUrl && (() => {
                  const p = parseVideoUrl(vidUrl)
                  return p ? (
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                      <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[9px]">✓</span>
                      Detectado: <strong className="text-zinc-300">{p.provider}</strong>
                    </div>
                  ) : (
                    <p className="text-[11px] text-amber-400">URL no reconocida — se guardará tal cual</p>
                  )
                })()}
                {vidThumb && (
                  <div className="flex items-center gap-3">
                    <img src={vidThumb} alt="" className="w-20 h-12 object-cover rounded-md border border-white/10" />
                    <div className="flex-1">
                      <p className="text-[10px] text-zinc-600 mb-1">Miniatura automática</p>
                      <button onClick={() => setVidThumb('')} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Quitar</button>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Pie de video (ES)">
                    <input value={vidCapEs} onChange={e => setVidCapEs(e.target.value)} placeholder="Sobrevuelo del cañón…" className={inp} />
                  </Field>
                  <Field label="Caption (EN)">
                    <input value={vidCapEn} onChange={e => setVidCapEn(e.target.value)} placeholder="Canyon flyover…" className={inp} />
                  </Field>
                </div>
                {vidErr && <p className="text-xs text-red-400">{vidErr}</p>}
                <button
                  onClick={handleAddVideo}
                  disabled={addingVid || !vidUrl}
                  className="w-full py-2 rounded-lg text-sm font-semibold bg-[#E5A547] text-black hover:bg-[#f0b050] disabled:opacity-40 transition-colors"
                  style={{ fontFamily: DF }}
                >
                  {addingVid ? 'Agregando…' : 'Agregar video'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── Gallery grid ── */}
        {items.length > 0 ? (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-4">
              Elementos · <span className="text-zinc-600 normal-case font-normal">haz clic en el pie de foto para editar</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((m, idx) => {
                const t = thumbOf(m)
                return (
                  <div key={m.id} className="group bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden flex flex-col hover:border-white/[0.12] transition-colors">

                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-black/30">
                      {t
                        ? <img src={t} alt="" className="w-full h-full object-cover" loading="lazy" />
                        : <div className="w-full h-full flex items-center justify-center text-zinc-700">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
                            </svg>
                          </div>
                      }

                      {/* Type badge */}
                      <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        m.type === 'video'
                          ? 'bg-[#E5A547]/90 text-black'
                          : 'bg-black/60 text-white/70 border border-white/20'
                      }`}>
                        {m.type === 'video' ? '▶ video' : '📷 foto'}
                      </span>

                      {/* Position badge */}
                      <span className="absolute top-2 right-2 text-[9px] text-zinc-600 bg-black/60 px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Caption editors */}
                    <div className="px-3 py-2.5 flex-1 space-y-1.5 border-t border-white/[0.05]">
                      <CaptionCell
                        value={m.captionEs}
                        placeholder="Pie de foto (ES)…"
                        onSave={v => handleCaption(m.id, v, m.captionEn ?? '')}
                      />
                      <CaptionCell
                        value={m.captionEn}
                        placeholder="Caption (EN)…"
                        onSave={v => handleCaption(m.id, m.captionEs ?? '', v)}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 px-3 py-2 border-t border-white/[0.05]">
                      <button
                        onClick={() => handleMove(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded text-zinc-600 hover:text-zinc-300 disabled:opacity-20 transition-colors"
                        title="Mover arriba"
                      >
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <button
                        onClick={() => handleMove(idx, 1)}
                        disabled={idx === items.length - 1}
                        className="p-1 rounded text-zinc-600 hover:text-zinc-300 disabled:opacity-20 transition-colors"
                        title="Mover abajo"
                      >
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7" /></svg>
                      </button>

                      <span className="flex-1" />

                      {/* Preview link */}
                      {dest?.slug && (
                        <a
                          href={`/destinos/${dest.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-zinc-600 hover:text-zinc-300 transition-colors"
                          title="Ver en el sitio"
                        >
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      )}

                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1 rounded text-zinc-700 hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-700">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">Sin elementos en la galería</p>
            <p className="text-zinc-700 text-xs">Sube fotos o agrega un video para comenzar</p>
          </div>
        )}
      </main>
    </div>
  )
}
