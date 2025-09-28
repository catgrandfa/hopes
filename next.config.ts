import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // 启用实验性功能
  // experimental: {
  //   // 开启增量式部分预渲染
  //   ppr: 'incremental',
  // },
  // MDX 支持
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // 图片优化
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // TypeScript 严格模式
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
}

export default withNextIntl(nextConfig)