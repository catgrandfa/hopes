import './globals.css'
import type { ReactNode } from 'react'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
 title: {
  template: '%s | Hopes Blog',
  default: 'Hopes Blog',
 },
 description: '一个基于 Next.js 15 的现代化全栈个人博客系统',
 keywords: ['博客', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
 authors: [{ name: 'Hopes' }],
 creator: 'Hopes',
 metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
 alternates: {
  canonical: '/',
  languages: {
   'zh-CN': '/zh',
   'en-US': '/en',
  },
 },
 openGraph: {
  type: 'website',
  locale: 'zh_CN',
  alternateLocale: 'en_US',
  title: 'Hopes Blog',
  description: '一个基于 Next.js 15 的现代化全栈个人博客系统',
  siteName: 'Hopes Blog',
 },
 twitter: {
  card: 'summary_large_image',
  title: 'Hopes Blog',
  description: '一个基于 Next.js 15 的现代化全栈个人博客系统',
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

interface RootLayoutProps {
 children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
 return (
  <html lang="zh" suppressHydrationWarning>
   <body className={`${inter.variable} font-sans antialiased`}>
    {children}
   </body>
  </html>
 )
}
