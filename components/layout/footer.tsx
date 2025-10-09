'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const TECH_STACK = ['Next.js 15', 'React 19', 'Tailwind CSS 4', 'TypeScript', 'Supabase']

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
  { href: `/${locale}/contact`, label: tNav('contact') },
 ]

 return (
  <footer className="relative border-t border-border/60 bg-gradient-to-b from-muted/40 via-background to-background">
   <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute bottom-[-240px] left-1/2 h-[420px] w-[720px] -translate-x-1/2 bg-primary/10 blur-3xl" />
    <div className="absolute left-[18%] top-[-120px] h-[260px] w-[260px] bg-accent/40 blur-3xl" />
   </div>
   <div className="container relative py-12">
    <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
     <div className="space-y-6">
      <Link
       href={`/${locale}`}
       className="inline-flex items-center gap-3 border border-border/60 bg-background/80 px-4 py-2 text-xl font-semibold tracking-tight shadow-sm transition hover:border-primary/50 hover:text-primary"
      >
       <span className="inline-flex h-2.5 w-2.5 bg-primary" aria-hidden />
       Hopes Blog
      </Link>

      <p className="max-w-xl text-sm leading-6 text-muted-foreground">
       {tFooter('tagline')}
      </p>

      <div className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground/90">
       {TECH_STACK.map((item) => (
        <span
         key={item}
         className=" border border-border/80 bg-background/70 px-3 py-1 shadow-sm"
        >
         {item}
        </span>
       ))}
      </div>
     </div>

     <div className="grid gap-10 sm:grid-cols-2">
      <div>
       <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {tFooter('linksTitle')}
       </h3>
       <div className="mt-4 space-y-2 text-sm">
        {navigation.map((item) => (
         <Link
          key={item.href}
          href={item.href}
          className="flex items-center justify-between px-3 py-1.5 text-muted-foreground transition hover:text-foreground"
         >
          {item.label}
          <span aria-hidden className="text-xs">↗</span>
         </Link>
        ))}
       </div>
      </div>

      <div>
       <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {tFooter('newsletterTitle')}
       </h3>
       <p className="mt-3 text-sm text-muted-foreground">
        {tFooter('newsletterDescription')}
       </p>
       <form className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Input
         type="email"
         name="email"
         placeholder={tFooter('newsletterPlaceholder')}
         aria-label={tFooter('newsletterPlaceholder')}
         className="sm:flex-1"
        />
        <Button type="submit" className="sm:w-auto">
         {tFooter('newsletterCta')}
        </Button>
       </form>
       <p className="mt-2 text-xs text-muted-foreground/80">
        {tFooter('newsletterHint')}
       </p>
      </div>
     </div>
    </div>

    <div className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
     <p>
      © {currentYear} Hopes Blog. {tFooter('copyright')}.
     </p>
     <div className="flex flex-wrap items-center gap-3">
      <span
       aria-hidden
       className={cn(
        'inline-flex h-2 w-2 bg-primary shadow-[0_0_0_4px_rgba(253,176,66,0.15)]'
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
