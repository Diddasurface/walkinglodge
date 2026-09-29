export type Lang = 'es' | 'en'

export interface BilingualString {
  es: string
  en: string
}

export interface Destination {
  id: string
  region: BilingualString
  name: BilingualString
  short: BilingualString
  sub: BilingualString
  desc: BilingualString
  img: string
  imgLight?: string
  imgDark?: string
  altitudeM?: number | null
}

export interface Tour {
  id: number
  type: 'adv' | 'nat' | 'cul' | 'lux'
  title: BilingualString
  sub: BilingualString
  days: BilingualString
  price: string
  level: BilingualString
  img: string
}

export interface Guide {
  name: string
  base: BilingualString
  years: number
  langs: string[]
  spec: BilingualString
  bio: BilingualString
  img: string
}
