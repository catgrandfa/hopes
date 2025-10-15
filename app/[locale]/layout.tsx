import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { isLocale, locales } from '@/lib/i18n'

// 生成多语言 metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  const description = t('description')
  const keywords = t.raw('keywords') as string[]
  const siteName = t('siteName')

  // 构建基础URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hopes.icu'
  const currentPath = locale === 'zh' ? '' : `/${locale}`
  const fullUrl = `${baseUrl}${currentPath}`

  return {
    title: {
      template: `%s · ${siteName}`,
      default: siteName,
    },
    description,
    keywords,
    authors: [{ name: 'Hopes' }],
    creator: 'Hopes',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: currentPath || '/',
      languages: {
        'zh-CN': '/zh',
        'en-US': '/en',
        'x-default': '/zh',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh' ? 'en_US' : 'zh_CN',
      title: siteName,
      description,
      siteName,
      url: fullUrl,
      images: [
        {
          url: '/api/og',
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
      images: ['/api/og'],
    },
    icons: {
      icon: [
        { url: '/icons/favicon.svg', type: 'image/svg+xml' },
        { url: '/icons/favicon.svg', sizes: '32x32', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/icons/favicon.svg', sizes: '192x192', type: 'image/svg+xml' }],
    },
    manifest: '/site.webmanifest',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // 可以添加搜索引擎验证码
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_SITE_VERIFICATION,
    },
  }
}

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="bg-background text-foreground relative flex min-h-screen flex-col">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary/20 absolute top-[-220px] left-1/2 h-[420px] w-[760px] -translate-x-1/2 blur-3xl" />
          <div className="bg-secondary/25 absolute bottom-[-260px] left-1/2 h-[460px] w-[820px] -translate-x-1/2 blur-[140px]" />
          <div className="via-border/70 absolute inset-x-0 top-[180px] h-px bg-gradient-to-r from-transparent to-transparent" />
        </div>
        <Header />
        <main className="relative isolate flex-1">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mix-blend-overlay" />
          <div className="relative z-10">{children}</div>
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  )
}
