export function StatCard({ label, value, icon, accent, iconColor, onClick }: {
  label: string
  value: number | string
  icon: React.ReactNode
  accent: string
  iconColor: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`group bg-white dark:bg-[#131516] rounded-xl p-5 border border-slate-200 dark:border-white/6 text-left w-full transition-all ${
        onClick
          ? 'hover:border-slate-300 dark:hover:border-white/14 hover:shadow-sm cursor-pointer'
          : 'cursor-default'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent} ${iconColor}`}>
          {icon}
        </div>
        {onClick && (
          <svg className="w-3.5 h-3.5 text-gray-300 dark:text-zinc-700 group-hover:text-[#E5A547] transition-colors mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </div>
      <p
        className="text-2xl font-bold text-gray-900 dark:text-white mt-3"
        style={{ fontFamily: 'var(--font-oswald)' }}
      >
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">{label}</p>
    </button>
  )
}
