export function Feedback({ ok, err }: { ok: string; err: string }) {
  if (!ok && !err) return null
  return (
    <div className={`px-4 py-2.5 rounded-lg text-sm mb-4 ${
      ok
        ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20'
        : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
    }`}>
      {ok || err}
    </div>
  )
}
