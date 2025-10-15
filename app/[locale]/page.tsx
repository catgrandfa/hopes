import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PostCard } from '@/components/blog/post-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getLatestPosts } from '@/lib/content'
import { isLocale, type Locale } from '@/lib/i18n'
import { getTranslations } from 'next-intl/server'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale = localeParam as Locale

  const [tHome, tBlog, tCommon, latestPosts] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'blog' }),
    getTranslations({ locale, namespace: 'common' }),
    getLatestPosts(locale, 3),
  ])

  return (
    <div className="container py-16">
      {/* Hero Section */}
      <section className="mb-16 space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold md:text-6xl">{tHome('hero.title')}</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
            {tHome('hero.subtitle')}
          </p>
        </div>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href={`/${locale}/blog`}>{tHome('hero.ctaReadLatest')}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`/${locale}/about`}>{tHome('hero.ctaAbout')}</Link>
          </Button>
        </div>
      </section>

      {/* Section Cards */}
      <section className="mb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <CardTitle>{tHome('sections.tech.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{tHome('sections.tech.description')}</CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle>{tHome('sections.lab.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{tHome('sections.lab.description')}</CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle>{tHome('sections.notes.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{tHome('sections.notes.description')}</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold">{tHome('latestTitle')}</h2>
            <p className="text-muted-foreground">{tBlog('latestPosts')}</p>
          </div>
          <Button asChild variant="ghost">
            <Link href={`/${locale}/blog`}>{tHome('ctaPrimary')}</Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {latestPosts.map(post => (
            <PostCard
              key={`${post.slug}-${post.locale}`}
              post={post}
              locale={locale}
              readMoreLabel={tCommon('readMore')}
              readingTimeLabel={tBlog('minutes')}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
