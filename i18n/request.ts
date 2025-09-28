import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

import { isLocale, loadMessages } from '../lib/i18n'

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolvedLocale = locale ?? (await requestLocale)

  if (!isLocale(resolvedLocale)) {
    notFound()
  }

  return {
    locale: resolvedLocale,
    messages: await loadMessages(resolvedLocale),
  }
})
