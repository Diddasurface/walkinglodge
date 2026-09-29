import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const IMG = {
  river: '/uploads/1778347444962-3lozdulfu64.jpg',
  routeBoat1: '/uploads/rutabote1.jpg',
  routeBoat2: '/uploads/rutabote2.jpg',
  lodgeDay: '/uploads/lodgedia.jpg',
  lodgeNight: '/uploads/lodgenoche.jpg',
  canopy: 'https://mistertravel.news/wp-content/uploads/2025/01/Canopy-ou-zipline-Paradise-Ecolodge-Madre-de-Dios.-Luis-Francisco-Gonzales-%C2%A9PROMPERU.jpg',
  macaws: 'https://www.ytuqueplanes.com/imagenes/fotos/novedades/interna-Madre-de-Dios2.jpg',
  walkway: 'https://assets.howlanders.com/en/tours-peru/puerto-maldonado/puerto-maldonado-tambopata-national-reserve-4-days/timeline/canopy-walk-way.jpg',
  nightWalk: 'https://cdn.getyourguide.com/image/format%3Dauto%2Cfit%3Dcrop%2Cgravity%3Dauto%2Cquality%3D60%2Cwidth%3D900%2Cheight%3D900%2Cdpr%3D1/tour_img/50e5a5d1de70d6ad548619d0118af26869bdba4c15640f6bffa917019be51216.jpg',
  jungle: 'https://images.unsplash.com/photo-1518182170546-07661fd94144?w=1920&q=80&auto=format&fit=crop',
}

const destinationsData = [
  {
    slug: 'lodge-madre-de-dios',
    regionEs: 'Madre de Dios · Rio abajo',
    regionEn: 'Madre de Dios · Downriver',
    nameEs: 'LODGE\nAMAZONICO',
    nameEn: 'AMAZON\nLODGE',
    shortEs: 'LODGE AMAZONICO',
    shortEn: 'AMAZON LODGE',
    subEs: 'A 2 horas de Puerto Maldonado',
    subEn: '2 hours from Puerto Maldonado',
    descEs: 'Un refugio de selva junto al rio Madre de Dios. Llegas en bote, bajas el ritmo y despiertas con aves, humedad verde y el sonido vivo del bosque.',
    descEn: 'A rainforest refuge on the Madre de Dios River. Arrive by boat, slow down, and wake to birds, deep green humidity, and the living sound of the forest.',
    coverImg: IMG.river,
    tag: 'rio',
    sortOrder: 1,
  },
  {
    slug: 'puente-canopy',
    regionEs: 'Bosque alto · Canopy',
    regionEn: 'High forest · Canopy',
    nameEs: 'PUENTES\nCOLGANTES',
    nameEn: 'CANOPY\nBRIDGES',
    shortEs: 'PUENTES COLGANTES',
    shortEn: 'CANOPY BRIDGES',
    subEs: 'Observacion sobre los arboles',
    subEn: 'Observation above the trees',
    descEs: 'Camina entre copas de arboles para buscar aves, monos y vistas abiertas del bosque. Es la imagen perfecta para presentar el lodge.',
    descEn: 'Walk among the treetops looking for birds, monkeys, and open rainforest views. This is the ideal visual for presenting the lodge.',
    coverImg: IMG.canopy,
    tag: 'bosque',
    sortOrder: 2,
  },
  {
    slug: 'collpa-guacamayos',
    regionEs: 'Amanecer · Vida silvestre',
    regionEn: 'Sunrise · Wildlife',
    nameEs: 'COLLPA DE\nGUACAMAYOS',
    nameEn: 'MACAW\nCLAY LICK',
    shortEs: 'COLLPA DE GUACAMAYOS',
    shortEn: 'MACAW CLAY LICK',
    subEs: 'Salida temprana en bote',
    subEn: 'Early boat departure',
    descEs: 'Una salida al alba para observar guacamayos y loros en barrancos de arcilla. Color, ruido y paciencia de selva en una sola escena.',
    descEn: 'A dawn outing to watch macaws and parrots gather on clay banks. Color, sound, and rainforest patience in one scene.',
    coverImg: IMG.macaws,
    tag: 'fauna',
    sortOrder: 3,
  },
  {
    slug: 'lago-sandoval',
    regionEs: 'Tambopata · Lago Sandoval',
    regionEn: 'Tambopata · Lake Sandoval',
    nameEs: 'LAGO\nSANDOVAL',
    nameEn: 'LAKE\nSANDOVAL',
    shortEs: 'LAGO SANDOVAL',
    shortEn: 'LAKE SANDOVAL',
    subEs: 'Canoa, palmeras y fauna',
    subEn: 'Canoe, palms, and wildlife',
    descEs: 'Excursion en bote y caminata hacia uno de los espejos de agua mas bellos de Madre de Dios, con opcion de ver aves, caimanes y lobos de rio.',
    descEn: 'A boat-and-trail excursion to one of Madre de Dios’ most beautiful lakes, with chances to see birds, caimans, and giant river otters.',
    coverImg: IMG.river,
    tag: 'fauna',
    sortOrder: 4,
  },
  {
    slug: 'caminata-nocturna',
    regionEs: 'Senderos · Noche amazonica',
    regionEn: 'Trails · Amazon night',
    nameEs: 'CAMINATA\nNOCTURNA',
    nameEn: 'NIGHT\nWALK',
    shortEs: 'CAMINATA NOCTURNA',
    shortEn: 'NIGHT WALK',
    subEs: 'Sonidos, insectos y anfibios',
    subEn: 'Sounds, insects, and amphibians',
    descEs: 'Cuando baja el sol cambia el bosque: aparecen anfibios, insectos, aranas, hongos y sonidos que no existen durante el dia.',
    descEn: 'When the sun sets, the forest changes: amphibians, insects, spiders, fungi, and sounds that do not exist by day begin to appear.',
    coverImg: IMG.nightWalk,
    tag: 'bosque',
    sortOrder: 5,
  },
  {
    slug: 'navegacion-madre-de-dios',
    regionEs: 'Rio Madre de Dios · Atardecer',
    regionEn: 'Madre de Dios River · Sunset',
    nameEs: 'RUTA\nEN BOTE',
    nameEn: 'RIVER\nROUTE',
    shortEs: 'RUTA EN BOTE',
    shortEn: 'RIVER ROUTE',
    subEs: 'Traslado escenico al lodge',
    subEn: 'Scenic transfer to the lodge',
    descEs: 'El viaje al lodge es parte de la experiencia: dos horas rio abajo desde Puerto Maldonado entre orillas vivas, aves y cielo abierto.',
    descEn: 'The trip to the lodge is part of the experience: two hours downriver from Puerto Maldonado between living riverbanks, birds, and open sky.',
    coverImg: IMG.routeBoat2,
    tag: 'rio',
    sortOrder: 6,
  },
]

const toursData = [
  {
    slug: 'escapada-amazonica-3d2n',
    type: 'NAT',
    titleEs: 'Escapada Amazonica',
    titleEn: 'Amazon Escape',
    subEs: 'Lodge, rio, senderos y caminata nocturna',
    subEn: 'Lodge, river, trails, and night walk',
    descEs: 'Programa ideal para una primera visita a Madre de Dios.',
    descEn: 'The ideal program for a first visit to Madre de Dios.',
    durationDays: 3,
    durationNights: 2,
    levelEs: 'Suave',
    levelEn: 'Easy',
    coverImg: IMG.river,
    featured: true,
    priceHigh: 320,
    priceLow: 280,
  },
  {
    slug: 'canopy-y-fauna-4d3n',
    type: 'ADV',
    titleEs: 'Canopy y Fauna',
    titleEn: 'Canopy and Wildlife',
    subEs: 'Puentes colgantes, collpa y exploracion del bosque',
    subEn: 'Hanging bridges, clay lick, and forest exploration',
    descEs: 'Una experiencia activa para viajeros que quieren ver la selva desde arriba y desde el rio.',
    descEn: 'An active experience for travelers who want to see the rainforest from above and from the river.',
    durationDays: 4,
    durationNights: 3,
    levelEs: 'Moderado',
    levelEn: 'Moderate',
    coverImg: IMG.canopy,
    featured: true,
    priceHigh: 480,
    priceLow: 420,
  },
  {
    slug: 'lago-sandoval-full-day',
    type: 'NAT',
    titleEs: 'Lago Sandoval',
    titleEn: 'Lake Sandoval',
    subEs: 'Canoa, caminata y observacion de fauna',
    subEn: 'Canoe, trail, and wildlife watching',
    descEs: 'Una salida enfocada en fotografia, aves y vida alrededor del agua.',
    descEn: 'An outing focused on photography, birds, and life around the water.',
    durationDays: 1,
    durationNights: 0,
    levelEs: 'Moderado',
    levelEn: 'Moderate',
    coverImg: IMG.routeBoat1,
    featured: true,
    priceHigh: 95,
    priceLow: 85,
  },
  {
    slug: 'collpa-guacamayos-amanecer',
    type: 'NAT',
    titleEs: 'Guacamayos al amanecer',
    titleEn: 'Macaws at Dawn',
    subEs: 'Salida temprana hacia collpa de loros y guacamayos',
    subEn: 'Early outing to a parrot and macaw clay lick',
    descEs: 'Para quienes buscan una de las escenas mas intensas de color de la Amazonia.',
    descEn: 'For travelers looking for one of the Amazon’s most colorful wildlife scenes.',
    durationDays: 1,
    durationNights: 0,
    levelEs: 'Suave',
    levelEn: 'Easy',
    coverImg: IMG.macaws,
    featured: false,
    priceHigh: 110,
    priceLow: 95,
  },
  {
    slug: 'selva-nocturna',
    type: 'ADV',
    titleEs: 'Selva Nocturna',
    titleEn: 'Night Rainforest',
    subEs: 'Anfibios, insectos, sonidos y linternas',
    subEn: 'Amphibians, insects, sounds, and flashlights',
    descEs: 'Una caminata corta para entender que el bosque tiene otro ritmo despues del atardecer.',
    descEn: 'A short walk to understand how the forest changes after sunset.',
    durationDays: 1,
    durationNights: 0,
    levelEs: 'Suave',
    levelEn: 'Easy',
    coverImg: IMG.nightWalk,
    featured: false,
    priceHigh: 45,
    priceLow: 40,
  },
]

async function main() {
  const adminPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'admin1234', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@walkinglodge.com' },
    update: { name: 'Walking Lodge', role: 'ADMIN', isActive: true },
    create: {
      name: 'Walking Lodge',
      email: 'admin@walkinglodge.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const seasonHigh = await prisma.season.upsert({
    where: { id: 'season-high' },
    update: {
      nameEs: 'Temporada Seca',
      nameEn: 'Dry Season',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-10-31'),
      isActive: true,
    },
    create: {
      id: 'season-high',
      nameEs: 'Temporada Seca',
      nameEn: 'Dry Season',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-10-31'),
      isActive: true,
    },
  })

  const seasonLow = await prisma.season.upsert({
    where: { id: 'season-low' },
    update: {
      nameEs: 'Temporada Verde',
      nameEn: 'Green Season',
      startDate: new Date('2026-11-01'),
      endDate: new Date('2027-04-30'),
      isActive: true,
    },
    create: {
      id: 'season-low',
      nameEs: 'Temporada Verde',
      nameEn: 'Green Season',
      startDate: new Date('2026-11-01'),
      endDate: new Date('2027-04-30'),
      isActive: true,
    },
  })

  const destinationSlugs = destinationsData.map((d) => d.slug)
  await prisma.destination.updateMany({
    where: { slug: { notIn: destinationSlugs } },
    data: { published: false },
  })

  const destinations: Record<string, { id: string }> = {}
  for (const d of destinationsData) {
    destinations[d.slug] = await prisma.destination.upsert({
      where: { slug: d.slug },
      update: { ...d, published: true, createdById: admin.id },
      create: { ...d, published: true, createdById: admin.id },
    })
  }

  const lodge = await prisma.hotel.upsert({
    where: { slug: 'walking-lodge' },
    update: {
      nameEs: 'Walking Lodge',
      nameEn: 'Walking Lodge',
      descEs: 'Lodge remoto a dos horas rio abajo desde Puerto Maldonado, pensado para viajeros que buscan bosque, silencio y actividades guiadas.',
      descEn: 'Remote lodge two hours downriver from Puerto Maldonado, designed for travelers seeking forest, silence, and guided activities.',
      stars: 3,
      coverImg: IMG.river,
      address: 'Rio Madre de Dios, 2 horas rio abajo desde Puerto Maldonado',
      published: true,
      destinationId: destinations['lodge-madre-de-dios'].id,
      createdById: admin.id,
    },
    create: {
      slug: 'walking-lodge',
      nameEs: 'Walking Lodge',
      nameEn: 'Walking Lodge',
      descEs: 'Lodge remoto a dos horas rio abajo desde Puerto Maldonado, pensado para viajeros que buscan bosque, silencio y actividades guiadas.',
      descEn: 'Remote lodge two hours downriver from Puerto Maldonado, designed for travelers seeking forest, silence, and guided activities.',
      stars: 3,
      coverImg: IMG.river,
      address: 'Rio Madre de Dios, 2 horas rio abajo desde Puerto Maldonado',
      checkInTime: '13:00',
      checkOutTime: '10:00',
      published: true,
      destinationId: destinations['lodge-madre-de-dios'].id,
      createdById: admin.id,
    },
  })

  await prisma.room.upsert({
    where: { id: 'room-lodge-standard' },
    update: {
      hotelId: lodge.id,
      typeEs: 'Cabana doble',
      typeEn: 'Double cabin',
      descEs: 'Cabana con mosquitero, bano privado y terraza hacia el bosque.',
      descEn: 'Cabin with mosquito net, private bathroom, and a small forest-facing terrace.',
      capacity: 2,
      beds: 1,
      coverImg: IMG.river,
      published: true,
    },
    create: {
      id: 'room-lodge-standard',
      hotelId: lodge.id,
      typeEs: 'Cabana doble',
      typeEn: 'Double cabin',
      descEs: 'Cabana con mosquitero, bano privado y terraza hacia el bosque.',
      descEn: 'Cabin with mosquito net, private bathroom, and a small forest-facing terrace.',
      capacity: 2,
      beds: 1,
      coverImg: IMG.river,
      published: true,
    },
  })

  const tourSlugs = toursData.map((t) => t.slug)
  await prisma.tour.updateMany({
    where: { slug: { notIn: tourSlugs } },
    data: { published: false, featured: false },
  })

  for (const t of toursData) {
    const { priceHigh, priceLow, ...tourFields } = t
    const tour = await prisma.tour.upsert({
      where: { slug: t.slug },
      update: { ...tourFields, published: true, createdById: admin.id },
      create: { ...tourFields, published: true, createdById: admin.id },
    })

    await prisma.tourDestination.upsert({
      where: {
        tourId_destinationId: {
          tourId: tour.id,
          destinationId: destinations['lodge-madre-de-dios'].id,
        },
      },
      update: {},
      create: {
        tourId: tour.id,
        destinationId: destinations['lodge-madre-de-dios'].id,
      },
    })

    await prisma.tourPrice.upsert({
      where: { tourId_seasonId_paxMin: { tourId: tour.id, seasonId: seasonHigh.id, paxMin: 1 } },
      update: { price: priceHigh },
      create: { tourId: tour.id, seasonId: seasonHigh.id, paxMin: 1, price: priceHigh },
    })
    await prisma.tourPrice.upsert({
      where: { tourId_seasonId_paxMin: { tourId: tour.id, seasonId: seasonLow.id, paxMin: 1 } },
      update: { price: priceLow },
      create: { tourId: tour.id, seasonId: seasonLow.id, paxMin: 1, price: priceLow },
    })
  }

  await prisma.guide.upsert({
    where: { id: 'guide-mateo' },
    update: {
      name: 'Mateo Chavez',
      baseEs: 'Puerto Maldonado · Madre de Dios',
      baseEn: 'Puerto Maldonado · Madre de Dios',
      years: 11,
      langs: 'ES,EN',
      specEs: 'Aves · Caminatas de selva · Rio Madre de Dios',
      specEn: 'Birds · Rainforest walks · Madre de Dios River',
      bioEs: 'Guia local especializado en interpretacion de bosque, rastros de fauna y navegacion por el Madre de Dios.',
      bioEn: 'Local guide specialized in forest interpretation, wildlife tracks, and navigation on the Madre de Dios River.',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
      published: true,
      createdById: admin.id,
    },
    create: {
      id: 'guide-mateo',
      name: 'Mateo Chavez',
      baseEs: 'Puerto Maldonado · Madre de Dios',
      baseEn: 'Puerto Maldonado · Madre de Dios',
      years: 11,
      langs: 'ES,EN',
      specEs: 'Aves · Caminatas de selva · Rio Madre de Dios',
      specEn: 'Birds · Rainforest walks · Madre de Dios River',
      bioEs: 'Guia local especializado en interpretacion de bosque, rastros de fauna y navegacion por el Madre de Dios.',
      bioEn: 'Local guide specialized in forest interpretation, wildlife tracks, and navigation on the Madre de Dios River.',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
      published: true,
      createdById: admin.id,
    },
  })

  await prisma.guide.updateMany({
    where: { id: { not: 'guide-mateo' } },
    data: { published: false },
  })

  const galleryItems = [
    {
      url: IMG.lodgeDay,
      titleEs: 'Lodge amazonico de dia',
      titleEn: 'Amazon lodge by day',
      captionEs: 'Vista diurna del lodge rodeado por vegetacion amazonica.',
      captionEn: 'Daytime view of the lodge surrounded by Amazon vegetation.',
      category: 'lodge',
      sortOrder: 1,
    },
    {
      url: IMG.lodgeNight,
      titleEs: 'Lodge amazonico de noche',
      titleEn: 'Amazon lodge by night',
      captionEs: 'Ambiente nocturno del lodge, luces calidas y bosque alrededor.',
      captionEn: 'Night atmosphere at the lodge with warm lights and forest around it.',
      category: 'lodge',
      sortOrder: 2,
    },
    {
      url: IMG.routeBoat2,
      titleEs: 'Navegacion por el Madre de Dios',
      titleEn: 'Madre de Dios River Journey',
      captionEs: 'Traslado y exploracion fluvial desde Puerto Maldonado hacia el lodge.',
      captionEn: 'River transfer and exploration from Puerto Maldonado to the lodge.',
      category: 'rio',
      sortOrder: 3,
    },
    {
      url: IMG.routeBoat1,
      titleEs: 'Puente sobre el rio al atardecer',
      titleEn: 'Bridge over the river at sunset',
      captionEs: 'Salida desde Puerto Maldonado rumbo al lodge por el Madre de Dios.',
      captionEn: 'Departure from Puerto Maldonado toward the lodge on the Madre de Dios River.',
      category: 'rio',
      sortOrder: 4,
    },
    {
      url: IMG.river,
      titleEs: 'Lago Sandoval',
      titleEn: 'Lake Sandoval',
      captionEs: 'Canoa, palmeras y orillas vivas durante la excursion al lago.',
      captionEn: 'Canoe, palms, and living riverbanks during the lake outing.',
      category: 'fauna',
      sortOrder: 5,
    },
    {
      url: IMG.canopy,
      titleEs: 'Puentes colgantes del canopy',
      titleEn: 'Canopy hanging bridges',
      captionEs: 'Vista elevada del bosque para observar aves y copas de arboles.',
      captionEn: 'An elevated forest view for birds and treetop observation.',
      category: 'bosque',
      sortOrder: 6,
    },
    {
      url: IMG.macaws,
      titleEs: 'Collpa de guacamayos',
      titleEn: 'Macaw clay lick',
      captionEs: 'Guacamayos y loros alimentandose de arcilla al amanecer.',
      captionEn: 'Macaws and parrots feeding on clay at sunrise.',
      category: 'fauna',
      sortOrder: 7,
    },
    {
      url: IMG.nightWalk,
      titleEs: 'Caminata nocturna',
      titleEn: 'Night walk',
      captionEs: 'Senderos con linternas para buscar insectos, anfibios y sonidos nocturnos.',
      captionEn: 'Flashlight trails to look for insects, amphibians, and night sounds.',
      category: 'bosque',
      sortOrder: 8,
    },
  ]

  for (const item of galleryItems) {
    await prisma.galleryImage.upsert({
      where: { id: `gallery-${item.sortOrder}` },
      update: { ...item, published: true },
      create: { id: `gallery-${item.sortOrder}`, ...item, published: true },
    })
  }

  console.log('Seed lodge Madre de Dios completado')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
