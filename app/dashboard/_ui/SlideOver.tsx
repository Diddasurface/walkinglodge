'use client'

export function SlideOver({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#131516] border-l border-slate-200 dark:border-white/[0.08] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/[0.06] shrink-0">
          <h2
            className="text-gray-900 dark:text-white font-semibold"
            style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.04em' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
