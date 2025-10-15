import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, Clock, Tag } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { BlogContent } from '@/components/blog/blog-content'
import { getAllPosts, getPostBySlug } from '@/lib/content'
import { isLocale, locales, type Locale } from '@/lib/i18n'
import { formatDate } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async locale => {
      const posts = await getAllPosts(locale as Locale)
      return posts.map(post => ({ locale, slug: post.slug }))
    })
  )

  return params.flat()
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params

  if (!isLocale(localeParam)) {
    return {}
  }

  const post = await getPostBySlug(localeParam, slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `/${localeParam}/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: localeParam, slug } = await params

  if (!isLocale(localeParam)) {
    notFound()
  }

  const locale = localeParam as Locale
  const [post, allPosts, t] = await Promise.all([
    getPostBySlug(locale, slug),
    getAllPosts(locale),
    getTranslations({ locale, namespace: 'blog' }),
  ])

  if (!post) {
    notFound()
  }

  const relatedPosts = allPosts
    .filter(item => item.slug !== post.slug)
    .filter(
      item =>
        item.tags?.some(tag => post.tags?.includes(tag)) ||
        item.categories?.some(category => post.categories?.includes(category))
    )
    .slice(0, 3)

  return (
    <div className="container py-16">
      <BlogContent locale={locale}>
        <div className="space-y-16">
          {/* 文章头部信息 */}
          <section className="space-y-8">
            <div className="space-y-6 text-center">
              <h1 className="text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
              {post.excerpt ? (
                <p className="text-muted-foreground mx-auto max-w-2xl text-lg">{post.excerpt}</p>
              ) : null}
              <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt, locale)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} {t('minutes')}
                </span>
                {post.tags?.length ? (
                  <span className="inline-flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {post.tags.join(', ')}
                  </span>
                ) : null}
              </div>
            </div>

            {post.coverImage ? (
              <div className="bg-muted relative mx-auto max-w-4xl overflow-hidden rounded-lg border shadow-sm">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={1200}
                  height={630}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            ) : null}
          </section>

          {/* 文章内容 */}
          <article className="space-y-10">
            <div className="prose prose-lg text-foreground dark:prose-invert mx-auto w-full max-w-none">
              {post.content}
            </div>

            {post.tags?.length ? (
              <div className="flex flex-wrap gap-2 border-t pt-6">
                {post.tags.map(tagName => (
                  <Badge key={tagName} variant="muted">
                    #{tagName}
                  </Badge>
                ))}
              </div>
            ) : null}
          </article>
        </div>
      </BlogContent>

      {relatedPosts.length ? (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">{t('relatedPosts')}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedPosts.map(related => (
              <Link
                key={`${related.slug}-${related.locale}`}
                href={`/${locale}/blog/${related.slug}`}
                className="group bg-card cursor-pointer border p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-muted-foreground text-sm">
                  {formatDate(related.publishedAt, locale)}
                </p>
                <h3 className="group-hover:text-primary mt-2 text-lg font-semibold">
                  {related.title}
                </h3>
                {related.excerpt ? (
                  <p className="text-muted-foreground mt-3 line-clamp-3 text-sm">
                    {related.excerpt}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* <section className=" border bg-muted/30 p-10 text-center">
    <h2 className="text-2xl font-semibold">{tCommon('subscribeTitle', { default: 'Stay in the loop' })}</h2>
    <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
     {tCommon('subscribeDescription', {
      default: 'Subscribe to receive fresh updates from Hopes Blog once new articles land.',
     })}
    </p>
    <Link
     href={`/${locale}/contact`}
     className="mt-6 inline-flex items-center bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
    >
     {tCommon('contactUs', { default: 'Contact us' })}
    </Link>
   </section> */}
    </div>
  )
}
