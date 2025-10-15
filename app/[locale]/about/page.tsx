import { notFound } from 'next/navigation'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { isLocale, type Locale } from '@/lib/i18n'
import { getTranslations } from 'next-intl/server'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale = localeParam as Locale
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <div className="container space-y-16 py-16">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl leading-tight font-bold md:text-5xl">{t('title')}</h1>
        <p className="text-muted-foreground mt-6 text-lg">{t('subtitle')}</p>
      </section>

      {/* Introduction Section */}
      <section className="mx-auto max-w-4xl">
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">{t('intro.title')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('intro.paragraph1')}</p>
            <p className="text-muted-foreground mt-4 leading-relaxed">{t('intro.paragraph2')}</p>
          </div>

          {/* Vision Cards */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">{t('vision.title')}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('vision.tech.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t('vision.tech.description')}</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('vision.lab.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t('vision.lab.description')}</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('vision.notes.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t('vision.notes.description')}</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
