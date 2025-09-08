'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold mb-4 block">
              Hopes
            </Link>
            <p className="text-muted-foreground mb-4">
              基于 Next.js 15 和现代化技术栈构建的个人博客系统，专注于分享技术和生活感悟。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">快速链接</h3>
            <div className="space-y-2">
              <Link href="/blog" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.blog')}
              </Link>
              <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.about')}
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.contact')}
              </Link>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="font-semibold mb-4">技术栈</h3>
            <div className="space-y-2 text-muted-foreground">
              <div>Next.js 15</div>
              <div>React 19</div>
              <div>Tailwind CSS 4</div>
              <div>TypeScript</div>
              <div>Supabase</div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground">
            © {currentYear} Hopes Blog. {t('footer.copyright')}.
          </p>
          <p className="text-muted-foreground mt-2 md:mt-0">
            {t('footer.builtWith', { tech: 'Next.js + TypeScript + Tailwind CSS' })}
          </p>
        </div>
      </div>
    </footer>
  )
}