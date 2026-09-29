export function Badge({ children, cls }: { children: React.ReactNode; cls?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${cls ?? 'bg-slate-100 dark:bg-white/[0.07] text-gray-600 dark:text-zinc-300'}`}>
      {children}
    </span>
  )
}
