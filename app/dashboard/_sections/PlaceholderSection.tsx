export function PlaceholderSection({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#131516] border border-slate-200 dark:border-white/[0.06] flex items-center justify-center text-2xl mb-4">
        🚧
      </div>
      <p
        className="text-gray-900 dark:text-white text-base font-medium"
        style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.05em' }}
      >
        {label}
      </p>
      <p className="text-gray-400 dark:text-zinc-500 text-sm mt-1">Próximamente disponible</p>
    </div>
  )
}
