export type Section =
  | 'overview' | 'tours' | 'guias' | 'destinos'
  | 'galeria' | 'marca' | 'hoteles' | 'reservas' | 'clientes' | 'reportes'

export interface Stats {
  tours: number; guides: number; destinations: number; hotels: number; bookings: number
}
export interface AdminTour {
  id: string; slug: string; type: string; titleEs: string; titleEn: string
  subEs: string | null; subEn: string | null
  durationDays: number; durationNights: number; levelEs: string; levelEn: string
  minPax: number; maxPax: number; basePrice: number | null
  coverImg: string; published: boolean; featured: boolean; createdAt: string
}
export interface AdminGuide {
  id: string; name: string; baseEs: string; baseEn: string; years: number
  langs: string; specEs: string; specEn: string
  bioEs: string; bioEn: string; img: string; published: boolean
}
export interface AdminDestination {
  id: string; slug: string; nameEs: string; nameEn: string; tag: string
  regionEs: string; regionEn: string; shortEs: string; shortEn: string
  subEs: string; subEn: string; descEs: string; descEn: string
  experienceEs: string | null; experienceEn: string | null
  coverImg: string; published: boolean
  altitudeM: number | null; durationDays: number | null
  mapAddress: string | null; contactEmail: string | null; contactWhatsapp: string | null
}

export interface AdminDestinationDay {
  id: string; destinationId: string; dayNumber: number
  titleEs: string; titleEn: string
  descEs: string | null; descEn: string | null
  mealsEs: string | null; mealsEn: string | null
}

export interface AdminDestinationWarning {
  id: string; destinationId: string
  textEs: string; textEn: string; severity: string; sortOrder: number
}
export interface AdminGalleryImage {
  id: string; url: string
  titleEs: string; titleEn: string
  captionEs: string | null; captionEn: string | null
  category: string; sortOrder: number; published: boolean; createdAt: string
}
export interface AdminSettings {
  logoUrl: string
}
export interface AdminHotel {
  id: string; slug: string; nameEs: string; nameEn: string
  stars: number; coverImg: string | null
  destinationId: string; destinationName: string
  address: string | null; phone: string | null; email: string | null
  published: boolean; roomCount: number; createdAt: string
}
export interface AdminBooking {
  id: string; reference: string
  clientName: string; clientEmail: string
  source: 'CONTACT' | 'DASHBOARD'
  status: string; totalAmount: number | null; currency: string
  pax: number; startDate: string | null; endDate: string | null
  contactPhone: string | null; nationality: string | null
  destinationInterest: string | null; requestedDates: string | null
  message: string | null; specialRequests: string | null
  createdAt: string; updatedAt: string
}
export interface AdminClient {
  id: string; name: string; email: string; phone: string | null
  isActive: boolean; bookingCount: number; createdAt: string
}
export interface ReportData {
  revenueTotal: number
  bookingsByStatus: Record<string, number>
  topTours: { tourId: string; titleEs: string; count: number; revenue: number }[]
  clientsTotal: number
  reviewsAvg: number | null
}
