export function Icon({ d, cls = 'w-4 h-4' }: { d: string; cls?: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
      <path d={d} />
    </svg>
  )
}
