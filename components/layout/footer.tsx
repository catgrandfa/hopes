'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Mail } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export default function Footer() {
  const tFooter = useTranslations('footer')
  const tNav = useTranslations('nav')
  const params = useParams()
  const locale = (params.locale as string) ?? 'zh'
  const currentYear = new Date().getFullYear()

  const navigation = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}/blog`, label: tNav('blog') },
    { href: `/${locale}/about`, label: tNav('about') },
  ]

  return (
    <footer className="border-border/60 from-muted/40 via-background to-background relative border-t bg-gradient-to-b">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute bottom-[-240px] left-1/2 h-[420px] w-[720px] -translate-x-1/2 blur-3xl" />
        <div className="bg-accent/40 absolute top-[-120px] left-[18%] h-[260px] w-[260px] blur-3xl" />
      </div>
      <div className="relative container py-12">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                {tFooter('linksTitle')}
              </h3>
              <div className="mt-4 space-y-2 text-sm">
                {navigation.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground flex items-center justify-between px-3 py-1.5 transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                {tFooter('contact.title')}
              </h3>
              <p className="text-muted-foreground mt-3 text-sm">{tFooter('contact.description')}</p>
              <div className="mt-4">
                <a
                  href="mailto:catgrandfa9898@outlook.com"
                  className="text-primary inline-flex items-center gap-2 text-sm hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  catgrandfa9898@outlook.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mt-12" />
        <div className="text-muted-foreground flex flex-col gap-4 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} Hopes Blog. {tFooter('copyright')}.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span
              aria-hidden
              className={cn(
                'bg-primary inline-flex h-2 w-2 shadow-[0_0_0_4px_rgba(253,176,66,0.15)]'
              )}
            />
            <p className="font-medium">
              {tFooter('builtWith', { tech: 'Next.js · TypeScript · Tailwind CSS' })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
