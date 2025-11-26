import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Sparkles } from 'lucide-react'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { getAllPosts, getCategories, getTags, type PostSummary } from '@/lib/content'
import { isLocale, type Locale } from '@/lib/i18n'
import { getTranslations } from 'next-intl/server'

interface BlogPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>
}

const filterPosts = (
  posts: PostSummary[],
  { query, category, tag }: { query?: string; category?: string; tag?: string }
) => {
  let result = [...posts]

  if (query) {
    const lower = query.toLowerCase()
    result = result.filter(
      post =>
        post.title.toLowerCase().includes(lower) ||
        post.excerpt?.toLowerCase().includes(lower) ||
        post.tags?.some(item => item.toLowerCase().includes(lower)) ||
        post.categories?.some(item => item.toLowerCase().includes(lower))
    )
  }

  if (category) {
    result = result.filter(post => post.categories?.includes(category))
  }

  if (tag) {
    result = result.filter(post => post.tags?.includes(tag))
  }

  return result
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale: localeParam } = await params
  const { q, category, tag } = await searchParams

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale = localeParam as Locale
  const [t, tCommon, allPosts, categories, tags] = await Promise.all([
    getTranslations({ locale, namespace: 'blog' }),
    getTranslations({ locale, namespace: 'common' }),
    getAllPosts(locale),
    getCategories(locale),
    getTags(locale),
  ])

  const query = typeof q === 'string' ? q.trim() : ''

  const posts = filterPosts(allPosts, {
    query: query || undefined,
    category,
    tag,
  })

  return (
    <div className="container space-y-16 py-16">
      <section className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t('latestPosts')}</h1>

        <form className="mx-auto flex max-w-xl items-center gap-4" method="get">
          <Input
            name="q"
            defaultValue={query}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
          />
          <Button type="submit" size="lg">
            {tCommon('search')}
          </Button>
        </form>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {posts.length ? (
            posts.map(post => (
              <Card key={`${post.slug}-${post.locale}`} className="group transition-all duration-200 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                    {/* Image */}
                    <div className="relative h-32 w-full overflow-hidden rounded-lg md:h-24 md:w-32 md:flex-shrink-0">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(min-width: 768px) 128px, 100vw"
                          priority={false}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
                        />
                      ) : (
                        <div className="from-primary/10 via-secondary/40 to-accent/30 flex h-full w-full items-center justify-center bg-gradient-to-br">
                          <Sparkles className="text-foreground/60 h-6 w-6" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      {/* Meta information */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.publishedAt, locale)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {post.readingTime} {t('minutes')}
                        </span>
                      </div>

                      {/* Title and excerpt */}
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
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
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-muted-foreground border border-dashed p-12 text-center">
              {t('noResults')}
            </div>
          )}
        </div>

        <aside className="space-y-10">
          <div className="bg-card border p-6 shadow-md">
            <h2 className="text-lg font-semibold">{t('categories')}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map(({ name, count }) => {
                const active = category === name
                return (
                  <Link
                    key={name}
                    href={{
                      pathname: `/${locale}/blog`,
                      query: {
                        ...(query ? { q: query } : {}),
                        category: active ? undefined : name,
                        tag,
                      },
                    }}
                    className={
                      active
                        ? 'bg-primary text-primary-foreground ring-primary/20 ring-offset-background inline-flex items-center px-3 py-1 text-sm font-medium shadow-sm ring-2 ring-offset-2'
                        : 'border-border text-muted-foreground hover:border-primary hover:text-foreground inline-flex items-center border px-3 py-1 text-sm transition-all duration-200 hover:shadow-sm'
                    }
                  >
                    {name}
                    <span className="ml-2 text-xs">{count}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="bg-card border p-6 shadow-md">
            <h2 className="text-lg font-semibold">{t('tags')}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map(({ name, count }) => {
                const active = tag === name
                return (
                  <Link
                    key={name}
                    href={{
                      pathname: `/${locale}/blog`,
                      query: {
                        ...(query ? { q: query } : {}),
                        tag: active ? undefined : name,
                        category,
                      },
                    }}
                    className={
                      active
                        ? 'bg-secondary text-secondary-foreground ring-secondary/20 ring-offset-background inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wide uppercase shadow-sm ring-2 ring-offset-2'
                        : 'border-border text-muted-foreground hover:border-secondary hover:text-secondary-foreground inline-flex items-center border px-3 py-1 text-xs font-semibold tracking-wide uppercase transition-all duration-200 hover:shadow-sm'
                    }
                  >
                    #{name}
                    <span className="ml-2 text-[11px] opacity-70">{count}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {allPosts.length ? (
            <div className="bg-card border p-6 shadow-md">
              <h2 className="text-lg font-semibold">{t('latestPosts')}</h2>
              <ul className="mt-4 space-y-4 text-sm">
                {allPosts.slice(0, 5).map(post => (
                  <li key={`${post.slug}-${post.locale}`} className="space-y-1">
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="text-foreground hover:text-primary font-medium"
                    >
                      {post.title}
                    </Link>
                    <div className="text-muted-foreground text-xs">
                      {formatDate(post.publishedAt, locale)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  )
}
