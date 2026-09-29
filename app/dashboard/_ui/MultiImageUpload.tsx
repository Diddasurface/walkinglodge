'use client'

import { useRef, useState } from 'react'

interface UploadItem {
  id: string
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
}

interface MultiImageUploadProps {
  onUploadEach: (url: string) => Promise<void>
  lang?: string
}

const MAX_BYTES = 5 * 1024 * 1024

export function MultiImageUpload({ onUploadEach, lang = 'es' }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<UploadItem[]>([])
  const [drag, setDrag] = useState(false)

  const setStatus = (id: string, status: UploadItem['status'], error?: string) =>
    setItems(p => p.map(i => i.id === id ? { ...i, status, error } : i))

  const uploadFile = async (item: UploadItem) => {
    setStatus(item.id, 'uploading')
    const fd = new FormData()
    fd.append('file', item.file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setStatus(item.id, 'error', d.error ?? 'Error')
        return
      }
      const { url } = await res.json()
      await onUploadEach(url)
      setStatus(item.id, 'done')
    } catch {
      setStatus(item.id, 'error', lang === 'es' ? 'Error de red' : 'Network error')
    }
  }

  const enqueue = (files: FileList | null) => {
    if (!files) return
    const valid: UploadItem[] = []
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return
      if (file.size > MAX_BYTES) return
      valid.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
      })
    })
    if (!valid.length) return
    setItems(p => [...p, ...valid])
    // start uploading all immediately
    valid.forEach(uploadFile)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    enqueue(e.dataTransfer.files)
  }

  const done  = items.filter(i => i.status === 'done').length
  const total = items.length
  const busy  = items.some(i => i.status === 'uploading' || i.status === 'pending')

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && !busy && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
          drag
            ? 'border-[#E5A547] bg-[#E5A547]/5'
            : 'border-slate-200 dark:border-white/10 hover:border-[#E5A547]/50'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-2 py-7 px-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-400 dark:text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              {lang === 'es' ? 'Arrastra varias fotos aquí o ' : 'Drag photos here or '}
              <span className="text-[#E5A547] font-medium">
                {lang === 'es' ? 'selecciona archivos' : 'browse files'}
              </span>
            </p>
            <p className="text-[10px] text-gray-400 dark:text-zinc-600 mt-0.5">
              JPG, PNG, WEBP · {lang === 'es' ? 'múltiples a la vez · máx. 5 MB c/u' : 'multiple at once · max 5 MB each'}
            </p>
          </div>
        </div>
      </div>

      {/* Queue preview */}
      {items.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest">
            <span>{lang === 'es' ? 'Cola de subida' : 'Upload queue'}</span>
            <span>{done}/{total}</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {items.map(item => (
              <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-black/20">
                <img src={item.preview} alt="" className="w-full h-full object-cover" />
                {/* Status overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                  item.status === 'done' ? 'bg-black/20' : 'bg-black/50'
                }`}>
                  {item.status === 'uploading' && (
                    <div className="w-5 h-5 border-2 border-[#E5A547]/30 border-t-[#E5A547] rounded-full animate-spin" />
                  )}
                  {item.status === 'done' && (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  )}
                  {item.status === 'error' && (
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold">!</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {busy && (
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#E5A547] transition-all duration-300"
                style={{ width: `${(done / total) * 100}%` }}
              />
            </div>
          )}

          {/* Clear done button */}
          {!busy && done > 0 && (
            <button
              type="button"
              onClick={() => setItems([])}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {lang === 'es' ? 'Limpiar lista' : 'Clear list'}
            </button>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => { enqueue(e.target.files); e.target.value = '' }}
      />
    </div>
  )
}
