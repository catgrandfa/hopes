import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, Clock, Tag } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { getAllPosts, getPostBySlug } from '@/lib/content'
import { isLocale, locales, type Locale } from '@/lib/i18n'
import { formatDate } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'

interface BlogPostPageProps {
 params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
 const params = await Promise.all(
  locales.map(async (locale) => {
   const posts = await getAllPosts(locale as Locale)
   return posts.map((post) => ({ locale, slug: post.slug }))
  }),
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
 const [post, allPosts, t, tCommon] = await Promise.all([
  getPostBySlug(locale, slug),
  getAllPosts(locale),
  getTranslations({ locale, namespace: 'blog' }),
  getTranslations({ locale, namespace: 'common' }),
 ])

 if (!post) {
  notFound()
 }

 const relatedPosts = allPosts
  .filter((item) => item.slug !== post.slug)
  .filter((item) =>
   item.tags?.some((tag) => post.tags?.includes(tag)) ||
   item.categories?.some((category) => post.categories?.includes(category)),
  )
  .slice(0, 3)

 return (
  <div className="container space-y-16 py-16">
   <section className="space-y-10">
    <div className="space-y-6 text-center">
     <span className="inline-flex items-center bg-secondary px-4 py-1 text-sm font-semibold uppercase tracking-wide text-secondary-foreground">
      {post.categories?.[0] ?? 'Blog'}
     </span>
     <h1 className="text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
     {post.excerpt ? (
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{post.excerpt}</p>
     ) : null}
     <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
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
     <div className="relative overflow-hidden border bg-muted">
      <Image
       src={post.coverImage}
       alt={post.title}
       width={1600}
       height={840}
       className="h-auto w-full object-cover"
       priority
      />
     </div>
    ) : null}
   </section>

   <article className="mx-auto max-w-3xl space-y-10">
    <div className="prose prose-lg mx-auto w-full text-foreground dark:prose-invert">
     {post.content}
    </div>

    {post.tags?.length ? (
     <div className="flex flex-wrap gap-2 border-t pt-6">
      {post.tags.map((tagName) => (
       <Badge key={tagName} variant="muted">
        #{tagName}
       </Badge>
      ))}
     </div>
    ) : null}
   </article>

   {relatedPosts.length ? (
    <section className="space-y-6">
     <h2 className="text-2xl font-semibold">{t('relatedPosts')}</h2>
     <div className="grid gap-6 md:grid-cols-3">
      {relatedPosts.map((related) => (
       <Link
        key={`${related.slug}-${related.locale}`}
        href={`/${locale}/blog/${related.slug}`}
        className="group border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
       >
        <p className="text-sm text-muted-foreground">
         {formatDate(related.publishedAt, locale)}
        </p>
        <h3 className="mt-2 text-lg font-semibold group-hover:text-primary">
         {related.title}
        </h3>
        {related.excerpt ? (
         <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{related.excerpt}</p>
        ) : null}
       </Link>
      ))}
     </div>
    </section>
   ) : null}

   <section className=" border bg-muted/30 p-10 text-center">
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
   </section>
  </div>
 )
}
