'use client'

import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/lib/theme'

export function ThemeToggle() {
  const t = useTranslations('common')
  const { resolvedTheme, setTheme } = useTheme()

  const handleToggle = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={handleToggle}
      className="relative flex items-center justify-center w-9 h-9 border border-border/60 bg-background hover:bg-muted transition-colors"
      aria-label={t('toggleTheme')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{t('toggleTheme')}</span>
    </button>
  )
}