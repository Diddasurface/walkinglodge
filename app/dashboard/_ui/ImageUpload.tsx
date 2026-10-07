'use client'

import { useRef, useState } from 'react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  lang?: string
}

export function ImageUpload({ value, onChange, lang = 'es' }: ImageUploadProps) {
  const inputRef   = useRef<HTMLInputElement>(null)
  const [busy, setBusy]     = useState(false)
  const [drag, setDrag]     = useState(false)
  const [error, setError]   = useState('')

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(lang === 'es' ? 'Solo se permiten imágenes' : 'Only images are allowed')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setError(lang === 'es' ? 'Máximo 8 MB por imagen' : 'Max 8 MB per image')
      return
    }
    setError('')
    setBusy(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    setBusy(false)
    if (res.ok) {
      const { url } = await res.json()
      onChange(url)
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error ?? (lang === 'es' ? 'Error al subir la imagen' : 'Upload failed'))
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  return (
    <div className="space-y-2">
      {/* Drop zone / preview */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && !busy && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`relative rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${
          drag
            ? 'border-[#E5A547] bg-[#E5A547]/5'
            : 'border-slate-200 dark:border-white/10 hover:border-[#E5A547]/50'
        }`}
      >
        {value ? (
          /* Image preview */
          <div className="relative h-36 group">
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span className="text-white text-xs">{lang === 'es' ? 'Cambiar imagen' : 'Change image'}</span>
            </div>
            {busy && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#E5A547]/30 border-t-[#E5A547] rounded-full animate-spin" />
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-2.5 py-8 px-4 text-center">
            {busy ? (
              <div className="w-7 h-7 border-2 border-[#E5A547]/30 border-t-[#E5A547] rounded-full animate-spin" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400 dark:text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {lang === 'es' ? 'Arrastra una imagen aquí o' : 'Drag an image here or'}{' '}
                    <span className="text-[#E5A547] font-medium">
                      {lang === 'es' ? 'selecciona un archivo' : 'browse files'}
                    </span>
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-600 mt-0.5">
                    JPG, PNG, WEBP, GIF, SVG · {lang === 'es' ? 'máx. 8 MB' : 'max 8 MB'}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}

      {/* URL fallback */}
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 dark:text-zinc-600">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </span>
        <input
          type="text"
          value={value}
          onChange={e => { setError(''); onChange(e.target.value) }}
          placeholder={lang === 'es' ? 'https://… o sube una imagen arriba' : 'https://… or upload above'}
          className="w-full bg-white dark:bg-[#1c1f21] border border-slate-200 dark:border-white/8 rounded-lg pl-8 pr-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 outline-none focus:border-[#E5A547]/50 transition-colors"
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) { e.target.value = ''; upload(f) } }}
      />
    </div>
  )
}
