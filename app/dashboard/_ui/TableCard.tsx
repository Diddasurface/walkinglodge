export function TableCard({ title, action, children }: {
  title: string; action?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-[#131516] rounded-xl border border-slate-200 dark:border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/[0.06]">
        <h3 className="text-gray-900 dark:text-white text-sm font-medium">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}
