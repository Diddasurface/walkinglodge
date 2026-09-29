export function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-lg font-bold text-sm text-black disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
      style={{ background: '#E5A547', fontFamily: 'var(--font-oswald)', letterSpacing: '0.05em' }}
    >
      {loading ? '…' : label}
    </button>
  )
}
