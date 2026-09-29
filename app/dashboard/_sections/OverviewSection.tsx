'use client'

import { StatCard } from '../_ui/StatCard'
import { TableCard } from '../_ui/TableCard'
import { Spinner } from '../_ui/Spinner'
import { EmptyState } from '../_ui/EmptyState'
import { Badge } from '../_ui/Badge'
import { TYPE_CFG } from '../_lib/constants'
import type { Section, Stats, AdminTour, AdminGuide } from '../_lib/types'

// ── Icons ──────────────────────────────────────────────────────────────────────

function IconMap() {
  return (
    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function IconCompass() {
  return (
    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function OverviewSection({ lang, stats, tours, guides, loading, setSection }: {
  lang: string
  stats: Stats | null
  tours: AdminTour[]
  guides: AdminGuide[]
  loading: boolean
  setSection: (s: Section) => void
}) {
  const locale = lang === 'es' ? 'es-PE' : 'en-US'
  const dateStr = new Date().toLocaleDateString(locale, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-gray-400 dark:text-zinc-600 text-xs uppercase tracking-wider capitalize">{dateStr}</p>
          <h2
            className="text-gray-900 dark:text-white text-xl mt-1"
            style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.02em' }}
          >
            {lang === 'es' ? 'Resumen general' : 'General overview'}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-zinc-600 bg-white dark:bg-[#131516] border border-slate-200 dark:border-white/6 rounded-lg px-3 py-1.5 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          {lang === 'es' ? 'Todo operativo' : 'All systems normal'}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label={lang === 'es' ? 'Destinos' : 'Destinations'}
          value={loading ? '—' : (stats?.destinations ?? 0)}
          icon={<IconMap />}
          accent="bg-orange-500/10"
          iconColor="text-orange-500"
          onClick={() => setSection('destinos')}
        />
        <StatCard
          label="Tours"
          value={loading ? '—' : (stats?.tours ?? 0)}
          icon={<IconCompass />}
          accent="bg-blue-500/10"
          iconColor="text-blue-500"
          onClick={() => setSection('tours')}
        />
        <StatCard
          label={lang === 'es' ? 'Guías' : 'Guides'}
          value={loading ? '—' : (stats?.guides ?? 0)}
          icon={<IconUser />}
          accent="bg-violet-500/10"
          iconColor="text-violet-500"
          onClick={() => setSection('guias')}
        />
        <StatCard
          label={lang === 'es' ? 'Reservas' : 'Bookings'}
          value={loading ? '—' : (stats?.bookings ?? 0)}
          icon={<IconCalendar />}
          accent="bg-emerald-500/10"
          iconColor="text-emerald-500"
          onClick={() => setSection('reservas')}
        />
      </div>

      {/* Recent tours */}
      <TableCard
        title={lang === 'es' ? 'Tours recientes' : 'Recent tours'}
        action={
          <button
            onClick={() => setSection('tours')}
            className="text-[11px] text-[#E5A547] hover:text-[#f0b050] font-medium transition-colors"
          >
            {lang === 'es' ? 'Ver todos →' : 'View all →'}
          </button>
        }
      >
        {loading ? <Spinner /> : tours.length === 0
          ? <EmptyState label={lang === 'es' ? 'Sin tours' : 'No tours'} />
          : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-120">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0f1012]">
                    {[lang === 'es' ? 'Tour' : 'Tour', lang === 'es' ? 'Tipo' : 'Type', lang === 'es' ? 'Duración' : 'Duration', 'Estado'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tours.slice(0, 6).map(t => {
                    const tc = TYPE_CFG[t.type] ?? TYPE_CFG.ADV
                    return (
                      <tr key={t.id} className="border-t border-slate-100 dark:border-white/4 hover:bg-slate-50 dark:hover:bg-white/1.5">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {t.coverImg
                              ? <img src={t.coverImg} alt={t.titleEs} className="w-8 h-8 rounded-md object-cover shrink-0" />
                              : <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-zinc-800 shrink-0" />
                            }
                            <div className="min-w-0">
                              <p className="text-sm text-gray-900 dark:text-white truncate">{t.titleEs}</p>
                              {t.featured && <p className="text-[10px] text-[#E5A547]">★ {lang === 'es' ? 'Destacado' : 'Featured'}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5"><Badge cls={tc.cls}>{lang === 'es' ? tc.es : tc.en}</Badge></td>
                        <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                          {t.durationDays ?? '—'} {lang === 'es' ? 'd.' : 'd.'}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge cls={t.published
                            ? 'bg-green-500/15 text-green-700 dark:text-green-400'
                            : 'bg-slate-100 dark:bg-zinc-700/50 text-gray-500 dark:text-zinc-400'}
                          >
                            {t.published ? (lang === 'es' ? 'Publicado' : 'Published') : (lang === 'es' ? 'Borrador' : 'Draft')}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
      </TableCard>

      {/* Recent guides */}
      <TableCard
        title={lang === 'es' ? 'Guías registrados' : 'Registered guides'}
        action={
          <button
            onClick={() => setSection('guias')}
            className="text-[11px] text-[#E5A547] hover:text-[#f0b050] font-medium transition-colors"
          >
            {lang === 'es' ? 'Ver todos →' : 'View all →'}
          </button>
        }
      >
        {loading ? <Spinner /> : guides.length === 0
          ? <EmptyState label={lang === 'es' ? 'Sin guías' : 'No guides'} />
          : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-105">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0f1012]">
                    {[lang === 'es' ? 'Guía' : 'Guide', lang === 'es' ? 'Base' : 'Location', lang === 'es' ? 'Idiomas' : 'Languages', lang === 'es' ? 'Exp.' : 'Exp.'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guides.slice(0, 5).map(g => (
                    <tr key={g.id} className="border-t border-slate-100 dark:border-white/4 hover:bg-slate-50 dark:hover:bg-white/1.5">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {g.img
                            ? <img src={g.img} alt={g.name} className="w-8 h-8 rounded-full object-cover shrink-0 opacity-90" />
                            : (
                              <div className="w-8 h-8 rounded-full bg-[#E5A547]/15 flex items-center justify-center shrink-0 text-[#E5A547] text-xs font-bold">
                                {g.name[0]?.toUpperCase()}
                              </div>
                            )
                          }
                          <span className="text-sm text-gray-900 dark:text-white">{g.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-zinc-400 whitespace-nowrap">{g.baseEs}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1 flex-wrap">
                          {(g.langs || '').split(',').map((l: string) => <Badge key={l}>{l.trim()}</Badge>)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                        {g.years} {lang === 'es' ? 'años' : 'yrs'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </TableCard>
    </div>
  )
}
