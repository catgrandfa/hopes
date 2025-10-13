'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Languages } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export default function Header() {
 const tNav = useTranslations('nav')
 const params = useParams()
 const pathname = usePathname()
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
  { href: `/${locale}/about`, label: tNav('about') },
 ]

 const isActive = (href: string) => {
  if (!pathname) return false
  if (href === `/${locale}`) {
   return pathname === href
  }
  return pathname.startsWith(href)
 }

 return (
  <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
   <div className="container flex h-16 items-center justify-between gap-4">
    <Link
     href={`/${locale}`}
     className="relative inline-flex items-center gap-2   bg-background/90 px-4 py-1.5 text-lg font-semibold tracking-tight transition  hover:text-primary"
    >
     <span className="inline-flex h-2 w-2 bg-primary" />
     Hopes
    </Link>

    <nav className="hidden md:flex items-center gap-2 border border-border/80 bg-background/80 px-1.5 py-1 shadow-sm">
     {navigation.map((item) => (
      <Link
       key={item.href}
       href={item.href}
       className={cn(
        ' px-4 py-1.5 text-sm font-medium transition-colors',
        isActive(item.href)
         ? 'bg-primary text-primary-foreground shadow'
         : 'text-muted-foreground hover:text-foreground'
       )}
      >
       {item.label}
      </Link>
     ))}
    </nav>

    <div className="flex items-center gap-3">
     <div className="hidden md:block">
      <DropdownMenu>
       <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
         <Languages className="h-4 w-4" />
         {locale === 'zh' ? '中文' : 'EN'}
        </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
         <Link href={`/zh${pathAfterLocale}`} className="w-full cursor-pointer">
          中文
         </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
         <Link href={`/en${pathAfterLocale}`} className="w-full cursor-pointer">
          EN
         </Link>
        </DropdownMenuItem>
       </DropdownMenuContent>
      </DropdownMenu>
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
    <div className="border-t border-border/60 bg-background/95 shadow-lg md:hidden">
     <div className="container space-y-6 py-6">
      <nav className="flex flex-col gap-2">
       {navigation.map((item) => (
        <Link
         key={item.href}
         href={item.href}
         className={cn(
          ' px-4 py-2 text-base font-medium transition-colors',
          isActive(item.href)
           ? 'bg-primary/10 text-foreground'
           : 'text-muted-foreground hover:text-foreground'
         )}
         onClick={() => setIsMenuOpen(false)}
        >
         {item.label}
        </Link>
       ))}
      </nav>

      <div className="md:hidden">
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
         <Button variant="outline" size="sm" className="w-full justify-start gap-2">
          <Languages className="h-4 w-4" />
          {locale === 'zh' ? '中文' : 'EN'}
         </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-full">
         <DropdownMenuItem asChild>
          <Link href={`/zh${pathAfterLocale}`} className="w-full cursor-pointer" onClick={() => setIsMenuOpen(false)}>
           中文
          </Link>
         </DropdownMenuItem>
         <DropdownMenuItem asChild>
          <Link href={`/en${pathAfterLocale}`} className="w-full cursor-pointer" onClick={() => setIsMenuOpen(false)}>
           EN
          </Link>
         </DropdownMenuItem>
        </DropdownMenuContent>
       </DropdownMenu>
      </div>

      <div className="flex items-center justify-between">
       <span className="text-sm font-medium text-muted-foreground">
        {tNav('theme')}
       </span>
       <ThemeToggle />
      </div>
     </div>
    </div>
   ) : null}
  </header>
 )
}
