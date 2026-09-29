const DISPLAY_FONT = 'var(--font-oswald), Oswald, sans-serif'

interface PageHeroProps {
  eyebrow: string
  title: string
  lead: string
  accent: string
  bg: string
}

export default function PageHero({ eyebrow, title, lead, accent, bg }: PageHeroProps) {
  return (
    <div className="page-hero">
      <div className="page-hero-bg" style={{ backgroundImage: `url(${bg})` }} />
      <div className="page-hero-shade" />
      <div className="page-hero-inner">
        <span className="section-eyebrow light">
          <span className="section-eyebrow-bar" style={{ background: accent }} />
          {eyebrow}
        </span>
        <h1 className="page-hero-title" style={{ fontFamily: DISPLAY_FONT }}>
          {title}
        </h1>
        <p className="page-hero-lead">{lead}</p>
      </div>
    </div>
  )
}
