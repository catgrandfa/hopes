import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PostCard } from '@/components/blog/post-card'
import { Button } from '@/components/ui/button'
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
   <section className="space-y-8">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
     <div>
      <h1 className="text-3xl font-semibold">{tHome('latestTitle')}</h1>
      <p className="text-muted-foreground">
       {tBlog('latestPosts')}
      </p>
     </div>
     <Button asChild variant="ghost">
      <Link href={`/${locale}/blog`}>{tHome('ctaPrimary')}</Link>
     </Button>
    </div>

    <div className="grid gap-8 md:grid-cols-3">
     {latestPosts.map((post) => (
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
