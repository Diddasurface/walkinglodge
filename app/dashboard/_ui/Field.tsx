export const inp =
  'w-full bg-white dark:bg-[#1c1f21] border border-slate-200 dark:border-white/[0.08] ' +
  'rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white ' +
  'placeholder-gray-400 dark:placeholder-zinc-600 outline-none ' +
  'focus:border-[#E5A547]/50 transition-colors'

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-gray-500 dark:text-zinc-400 text-xs mb-1.5">{label}</label>
      {children}
    </div>
  )
}
