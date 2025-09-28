import { notFound } from 'next/navigation'
import Link from 'next/link'

import { PostCard } from '@/components/blog/post-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import {
  getAllPosts,
  getCategories,
  getTags,
  type PostSummary,
} from '@/lib/content'
import { isLocale, type Locale } from '@/lib/i18n'
import { getTranslations } from 'next-intl/server'

interface BlogPageProps {
  params: { locale: string }
  searchParams: { q?: string; category?: string; tag?: string }
}

const filterPosts = (
  posts: PostSummary[],
  {
    query,
    category,
    tag,
  }: { query?: string; category?: string; tag?: string },
) => {
  let result = [...posts]

  if (query) {
    const lower = query.toLowerCase()
    result = result.filter(
      (post) =>
        post.title.toLowerCase().includes(lower) ||
        post.excerpt?.toLowerCase().includes(lower) ||
        post.tags?.some((item) => item.toLowerCase().includes(lower)) ||
        post.categories?.some((item) => item.toLowerCase().includes(lower)),
    )
  }

  if (category) {
    result = result.filter((post) => post.categories?.includes(category))
  }

  if (tag) {
    result = result.filter((post) => post.tags?.includes(tag))
  }

  return result
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const localeParam = params.locale

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

  const query = typeof searchParams.q === 'string' ? searchParams.q.trim() : ''
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const tag = typeof searchParams.tag === 'string' ? searchParams.tag : undefined

  const posts = filterPosts(allPosts, {
    query: query || undefined,
    category,
    tag,
  })

  return (
    <div className="container space-y-16 py-16">
      <section className="space-y-6 text-center">
        <span className="inline-flex items-center rounded-full border border-primary/40 px-4 py-1 text-sm font-medium text-primary">
          Hopes • {t('title')}
        </span>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          {t('latestPosts')}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {t('searchPlaceholder')}
        </p>

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
        <div className="grid gap-8 md:grid-cols-2">
          {posts.length ? (
            posts.map((post) => (
              <PostCard
                key={`${post.slug}-${post.locale}`}
                post={post}
                locale={locale}
                readMoreLabel={tCommon('readMore')}
                readingTimeLabel={t('minutes')}
              />
            ))
          ) : (
            <p className="col-span-full rounded-3xl border border-dashed p-12 text-center text-muted-foreground">
              {t('noResults')}
            </p>
          )}
        </div>

        <aside className="space-y-10">
          <div className="rounded-3xl border bg-card p-6 shadow-md">
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
                        ? 'inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground'
                        : 'inline-flex items-center rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground'
                    }
                  >
                    {name}
                    <span className="ml-2 text-xs">{count}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-md">
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
                        ? 'inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary-foreground'
                        : 'inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:border-primary hover:text-primary'
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
            <div className="rounded-3xl border bg-card p-6 shadow-md">
              <h2 className="text-lg font-semibold">{t('latestPosts')}</h2>
              <ul className="mt-4 space-y-4 text-sm">
                {allPosts.slice(0, 5).map((post) => (
                  <li key={`${post.slug}-${post.locale}`} className="space-y-1">
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">
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
