import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getLatestPosts } from '@/lib/content'
import { isLocale, type Locale } from '@/lib/i18n'
import { getTranslations } from 'next-intl/server'
import { formatDate } from '@/lib/utils'

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

        <div className="space-y-6">
          {latestPosts.map(post => (
            <Card
              key={`${post.slug}-${post.locale}`}
              className="group transition-all duration-200 hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="space-y-3">
                  {/* Meta information */}
                  <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.publishedAt, locale)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {post.readingTime} {tBlog('minutes')}
                    </span>
                  </div>

                  {/* Title and excerpt */}
                  <div>
                    <h3 className="group-hover:text-primary text-xl font-semibold tracking-tight transition-colors">
                      <Link href={`/${locale}/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt ? (
                      <p className="text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                    ) : null}
                  </div>

                  {/* Tags and read more */}
                  <div className="flex items-center justify-between">
                    {post.tags?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="muted" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="muted" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div />
                    )}
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="text-primary text-sm font-medium underline-offset-4 hover:underline"
                    >
                      {tCommon('readMore')}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
