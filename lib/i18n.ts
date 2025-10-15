// 支持的语言
export const locales = ['zh', 'en'] as const
export type Locale = (typeof locales)[number]

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && locales.includes(value as Locale)

export const loadMessages = async (locale: Locale): Promise<Record<string, unknown>> =>
  (await import(`../messages/${locale}.json`)).default
