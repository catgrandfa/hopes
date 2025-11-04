import { notFound } from 'next/navigation'
import Link from 'next/link'

import { PostCard } from '@/components/blog/post-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'
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
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t('latestPosts')}</h1>
          <Link href={`/${locale}/blog/create`}>
            <Button size="lg" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              创建博客
            </Button>
          </Link>
        </div>

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
        <div className="grid gap-8 md:grid-cols-3">
          {posts.length ? (
            posts.map(post => (
              <PostCard
                key={`${post.slug}-${post.locale}`}
                post={post}
                locale={locale}
                readMoreLabel={tCommon('readMore')}
                readingTimeLabel={t('minutes')}
              />
            ))
          ) : (
            <p className="text-muted-foreground col-span-full border border-dashed p-12 text-center">
              {t('noResults')}
            </p>
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
