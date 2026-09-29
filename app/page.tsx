'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import DestinationsGrid from '@/components/DestinationsGrid'
import Experiences from '@/components/Experiences'
import CTA from '@/components/CTA'
import { useLang } from '@/components/LangProvider'
import type { Destination, Tour } from '@/lib/types'

export default function HomePage() {
  const { lang } = useLang()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [tours, setTours]               = useState<Tour[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/destinations').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/tours').then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([d, t]) => {
      setDestinations(d)
      setTours(t)
      setLoading(false)
    })
  }, [])

  return (
    <main>
      <Hero lang={lang} destinations={destinations} loading={loading} />
      <DestinationsGrid lang={lang} destinations={destinations} loading={loading} />
      <Experiences lang={lang} tours={tours} loading={loading} />
      <CTA lang={lang} />
    </main>
  )
}
