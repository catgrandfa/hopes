import './globals.css'
import type { ReactNode } from 'react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'

import { ThemeProvider } from '@/lib/theme'

// Inter 作为主要正文字体 - 清晰易读
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

// Space Grotesk 作为标题字体 - 现代感强，设计感好
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

// JetBrains Mono 作为代码字体 - 专业清晰
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// 根布局不设置 metadata，全部在 locale layout 中处理

interface RootLayoutProps {
 children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  // 由于这个布局是根布局，无法直接获取路由参数
  // lang 属性将由浏览器和中间件自动处理
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
