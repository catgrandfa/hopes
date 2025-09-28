import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { isLocale, type Locale } from '@/lib/i18n'
import { getTranslations } from 'next-intl/server'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

const CONTACT_EMAIL = 'hey@hopes.blog'

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale = localeParam as Locale
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <div className="container space-y-16 py-16">
      <section className="mx-auto max-w-3xl space-y-6 text-center">
        <span className="inline-flex items-center rounded-full bg-secondary px-4 py-1 text-sm font-semibold uppercase tracking-wide text-secondary-foreground">
          {t('title')}
        </span>
        <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
      </section>

      <section className="grid gap-12 lg:grid-cols-[1fr_320px]">
        <div className="rounded-4xl border bg-card/80 p-10 shadow-sm">
          <form
            className="space-y-6"
            method="post"
            action={`mailto:${CONTACT_EMAIL}`}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-left text-sm font-medium text-foreground">
                {t('form.name')}
                <Input name="name" placeholder="Jane Doe" required />
              </label>
              <label className="space-y-2 text-left text-sm font-medium text-foreground">
                {t('form.email')}
                <Input
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  required
                />
              </label>
            </div>

            <label className="space-y-2 text-left text-sm font-medium text-foreground">
              {t('form.message')}
              <Textarea
                name="message"
                placeholder="Share your idea, feedback, or collaboration proposal..."
                required
              />
            </label>

            <Button type="submit" size="lg" className="w-full md:w-auto">
              {t('form.submit')}
            </Button>
          </form>
        </div>

        <aside className="space-y-6 rounded-4xl border bg-muted/40 p-8">
          <h2 className="text-lg font-semibold">{t('channelsTitle')}</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground">{t('email')}</h3>
              <Link
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-1 inline-flex items-center text-primary underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </Link>
            </div>
            <div>
              <h3 className="font-medium text-foreground">{t('newsletter')}</h3>
              <p className="mt-1 text-muted-foreground">{t('newsletterDescription')}</p>
              <Link
                href={`/${locale}/blog`}
                className="mt-2 inline-flex items-center text-primary underline-offset-4 hover:underline"
              >
                {t('form.submit')}
              </Link>
            </div>
            <div>
              <h3 className="font-medium text-foreground">{t('community')}</h3>
              <p className="mt-1 text-muted-foreground">{t('communityDescription')}</p>
              <Link
                href="https://github.com/hopes-blog"
                className="mt-2 inline-flex items-center text-primary underline-offset-4 hover:underline"
              >
                github.com/hopes-blog
              </Link>
            </div>
          </div>

          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {t('availability')}
          </p>
        </aside>
      </section>
    </div>
  )
}
