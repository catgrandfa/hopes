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

  const title = t('title')
  const description = t('description')
  const keywords = t.raw('keywords') as string[]
  const siteName = t('siteName')

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
    keywords,
    authors: [{ name: 'Hopes' }],
    creator: 'Hopes',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    alternates: {
      canonical: locale === 'zh' ? '/' : `/${locale}`,
      languages: {
        'zh-CN': '/zh',
        'en-US': '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh' ? 'en_US' : 'zh_CN',
      title,
      description,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
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
  }
}

interface LocaleLayoutProps {
 children: ReactNode
 params: Promise<{ locale: string }>
}

export function generateStaticParams() {
 return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
 children,
 params,
}: LocaleLayoutProps) {
 const { locale } = await params

 if (!isLocale(locale)) {
  notFound()
 }

 setRequestLocale(locale)

 const messages = await getMessages()

 return (
  <NextIntlClientProvider messages={messages}>
   <div className="relative flex min-h-screen flex-col bg-background text-foreground">
    <div
     aria-hidden
     className="pointer-events-none absolute inset-0 overflow-hidden"
    >
     <div className="absolute left-1/2 top-[-220px] h-[420px] w-[760px] -translate-x-1/2 bg-primary/20 blur-3xl" />
     <div className="absolute bottom-[-260px] left-1/2 h-[460px] w-[820px] -translate-x-1/2 bg-secondary/25 blur-[140px]" />
     <div className="absolute inset-x-0 top-[180px] h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />
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
