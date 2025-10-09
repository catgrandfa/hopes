import type { ReactNode } from 'react'

import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { isLocale, locales } from '@/lib/i18n'

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
