'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Mail } from 'lucide-react'

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
  <footer className="relative border-t border-border/60 bg-gradient-to-b from-muted/40 via-background to-background">
   <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute bottom-[-240px] left-1/2 h-[420px] w-[720px] -translate-x-1/2 bg-primary/10 blur-3xl" />
    <div className="absolute left-[18%] top-[-120px] h-[260px] w-[260px] bg-accent/40 blur-3xl" />
   </div>
   <div className="container relative py-12">
    <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
  

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
         </Link>
        ))}
       </div>
      </div>

      <div>
       <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        联系方式
       </h3>
       <p className="mt-3 text-sm text-muted-foreground">
        如有任何问题或建议，欢迎通过邮件与我联系
       </p>
       <div className="mt-4">
        <a
         href="mailto:catgrandfa9898@outlook.com"
         className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
         <Mail className="h-4 w-4" />
         catgrandfa9898@outlook.com
        </a>
       </div>
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
