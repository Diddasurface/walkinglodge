export type VideoProvider = 'youtube' | 'vimeo' | 'direct'

export interface ParsedVideo {
  provider: VideoProvider
  embedUrl: string
  autoThumb: string
}

export function parseVideoUrl(url: string): ParsedVideo | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch) {
    const id = ytMatch[1]
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      autoThumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    }
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return {
      provider: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0`,
      autoThumb: '',
    }
  }

  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(url)) {
    return {
      provider: 'direct',
      embedUrl: url,
      autoThumb: '',
    }
  }

  return null
}

export function getVideoEmbed(url: string): string {
  return parseVideoUrl(url)?.embedUrl ?? url
}
