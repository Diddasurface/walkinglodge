import { ImageResponse } from 'next/og'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111513',
          color: '#e5a547',
          border: '4px solid #e5a547',
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        W
      </div>
    ),
    size,
  )
}
