'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Languages } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

export default function Header() {
  const tNav = useTranslations('nav')
  const params = useParams()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const locale = (params.locale as string) ?? 'zh'
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const pathAfterLocale = (() => {
    if (!pathname) return ''
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length <= 1) return ''
    const [, ...rest] = segments
    return rest.length ? `/${rest.join('/')}` : ''
  })()

  const navigation = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}/blog`, label: tNav('blog') },
    { href: `/${locale}/blog?tag=lab`, label: tNav('lab') },
    { href: `/${locale}/blog?tag=notes`, label: tNav('notes') },
    { href: `/${locale}/about`, label: tNav('about') },
  ]

  const isActive = (href: string) => {
    if (!pathname) return false

    const url = new URL(href, `http://localhost`)
    const currentTag = searchParams.get('tag')
    const hrefTag = url.searchParams.get('tag')

    // Handle home page
    if (href === `/${locale}`) {
      return pathname === href && !currentTag
    }

    // Handle pages with query parameters (like blog?tag=lab)
    if (hrefTag) {
      return pathname === `/${locale}/blog` && currentTag === hrefTag
    }

    // Handle regular pages
    return pathname.startsWith(href.split('?')[0])
  }

  return (
    <header className="border-border/60 bg-background/80 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="bg-background/90 hover:text-primary relative inline-flex items-center gap-2 px-4 py-1.5 text-lg font-semibold tracking-tight transition"
        >
          {/* Hopes Logo Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 64 64"
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="4"
              y="4"
              width="56"
              height="56"
              rx="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path d="M22 18 L22 46" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path
              d="M22 34 C30 28, 38 28, 46 34 S58 42, 58 42"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-display">hopes.icu</span>
        </Link>

        <nav className="border-border/80 bg-background/80 hidden items-center gap-2 border px-1.5 py-1 shadow-sm md:flex">
          {navigation.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-4 py-1.5 text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link
                href={`/${locale === 'zh' ? 'en' : 'zh'}${pathAfterLocale}`}
                className="cursor-pointer"
              >
                <Languages className="h-4 w-4" />
                {locale === 'zh' ? 'EN' : '中文'}
              </Link>
            </Button>
          </div>

          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="border-border/60 bg-background/95 border-t shadow-lg md:hidden">
          <div className="container space-y-6 py-6">
            <nav className="flex flex-col gap-2">
              {navigation.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 text-base font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="md:hidden">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                <Link
                  href={`/${locale === 'zh' ? 'en' : 'zh'}${pathAfterLocale}`}
                  className="cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Languages className="h-4 w-4" />
                  {locale === 'zh' ? 'EN' : '中文'}
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">{tNav('theme')}</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
