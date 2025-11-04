import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // CSS 优化暂时禁用，需要额外依赖
    // optimizeCss: true,
  },

  // 服务器外部包配置
  serverExternalPackages: ['@supabase/realtime-js'],

  // MDX support
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  // Image optimization with performance focus
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'blog.71e5550f3a047eebbac59773db55c5a5.r2.cloudflarestorage.com',
        port: '',
        pathname: '**',
      },
    ],
    unoptimized: false, // Enable built-in optimization
    formats: ['image/webp', 'image/avif'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon and thumbnail sizes
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache for images
    dangerouslyAllowSVG: true, // Allow SVG for better performance on icons
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // TypeScript strict mode
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Bundle analyzer for monitoring
  webpack: (config, { dev }) => {
    // Optimize bundle size
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // Don't bundle fs for client
      path: false, // Don't bundle path for client
    }

    // Reduce bundle size by aliasing to production versions
    if (!dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-dom/server': 'react-dom/server.browser',
      }
    }

    // Add bundle analyzer in development
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      )
    }

    return config
  },

  // HTTP headers for performance
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/zh/blog',
        permanent: true,
      },
    ]
  },

  // Compression middleware
  compress: true,

  // Powered by header removal for security
  poweredByHeader: false,
}

export default withNextIntl(nextConfig)
