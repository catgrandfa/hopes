import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0B1220',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #111827 0%, #0B1220 50%)',
          color: '#E5E7EB',
          fontSize: 32,
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 64 64"
            style={{ marginBottom: '24px' }}
          >
            <rect
              x="4"
              y="4"
              width="56"
              height="56"
              rx="12"
              fill="none"
              stroke="hsl(23, 86%, 48%)"
              strokeWidth="4"
            />
            <path
              d="M22 18 L22 46"
              stroke="hsl(23, 86%, 48%)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M22 34 C30 28, 38 28, 46 34 S58 42, 58 42"
              fill="none"
              stroke="hsl(23, 86%, 48%)"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>
            hopes.icu
          </div>
          <div style={{ fontSize: '20px', opacity: 0.8, maxWidth: '600px' }}>
            让希望在实践中呼吸
          </div>
          <div style={{ fontSize: '16px', opacity: 0.6, marginTop: '8px' }}>
            前端实践、工程复盘与生活记录
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}