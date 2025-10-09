import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { getAllPosts, getLatestPosts } from '@/lib/content'
import { isLocale, type Locale } from '@/lib/i18n'
import { formatDate } from '@/lib/utils'
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
 const [t, tBlog, latestPosts, allPosts] = await Promise.all([
  getTranslations({ locale, namespace: 'about' }),
  getTranslations({ locale, namespace: 'blog' }),
  getLatestPosts(locale, 3),
  getAllPosts(locale),
 ])

 const timeline = [
  {
   date: '2024.01',
   title: t('timeline.launch'),
   description: t('timelineDescription.launch'),
  },
  {
   date: '2024.02',
   title: t('timeline.mdxPipeline'),
   description: t('timelineDescription.mdxPipeline'),
  },
  {
   date: '2024.03',
   title: t('timeline.designSystem'),
   description: t('timelineDescription.designSystem'),
  },
  {
   date: '2024.05',
   title: t('timeline.openSource'),
   description: t('timelineDescription.openSource'),
  },
 ]

 const values = [
  {
   title: t('values.quality'),
   description: t('valuesDescription.quality'),
  },
  {
   title: t('values.craft'),
   description: t('valuesDescription.craft'),
  },
  {
   title: t('values.sharing'),
   description: t('valuesDescription.sharing'),
  },
 ]

 const stats = [
  { value: `${String(allPosts.length).padStart(2, '0')}+`, label: t('stats.posts') },
  { value: '1200+', label: t('stats.readers') },
  { value: '08', label: t('stats.contributors') },
 ]

 return (
  <div className="container space-y-16 py-16">
   <section className="grid gap-12 border bg-gradient-to-br from-muted/60 via-card to-card/90 p-12 md:grid-cols-[1.1fr_0.9fr]">
    <div className="space-y-6">
     <span className="inline-flex items-center bg-secondary px-4 py-1 text-sm font-semibold uppercase tracking-wide text-secondary-foreground">
      {t('subtitle')}
     </span>
     <h1 className="text-4xl font-bold leading-tight md:text-5xl">{t('title')}</h1>
     <p className="text-lg text-muted-foreground">{t('description')}</p>

     <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((item) => (
       <div
        key={item.label}
        className=" border bg-background/80 px-6 py-5 text-center shadow-sm"
       >
        <div className="text-3xl font-semibold text-primary">{item.value}</div>
        <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
         {item.label}
        </div>
       </div>
      ))}
     </div>

     <Button asChild size="lg">
      <Link href={`/${locale}/blog`}>{t('cta')}</Link>
     </Button>
    </div>

    <div className="space-y-4 border bg-background/70 p-8 shadow-md">
     <h2 className="text-lg font-semibold">{t('latestHighlights')}</h2>
     <ul className="space-y-4 text-sm">
      {latestPosts.map((post) => (
       <li key={`${post.slug}-${post.locale}`} className="space-y-1">
        <Link
         href={`/${locale}/blog/${post.slug}`}
         className="font-medium text-foreground transition hover:text-primary"
        >
         {post.title}
        </Link>
        <div className="text-xs text-muted-foreground">
         {formatDate(post.publishedAt, locale)} · {post.readingTime} {tBlog('minutes')}
        </div>
       </li>
      ))}
     </ul>
    </div>
   </section>

   <section className="grid gap-10 md:grid-cols-[320px_1fr]">
    <div className="space-y-4">
     <h2 className="text-2xl font-semibold">{t('timelineTitle')}</h2>
     <p className="text-muted-foreground">{t('timelineDescription')}</p>
    </div>
    <div className="space-y-8">
     {timeline.map((item) => (
      <div key={item.title} className="relative border-l pl-8">
       <span className="absolute -left-[9px] top-1 h-4 w-4 border-2 border-primary bg-background" />
       <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {item.date}
       </p>
       <h3 className="text-xl font-semibold">{item.title}</h3>
       <p className="mt-2 text-muted-foreground">{item.description}</p>
      </div>
     ))}
    </div>
   </section>

   <section className="space-y-8 border bg-card/80 p-12 shadow-sm">
    <h2 className="text-2xl font-semibold">{t('valuesTitle')}</h2>
    <p className="max-w-2xl text-muted-foreground">{t('valuesSubtitle')}</p>
    <div className="grid gap-6 md:grid-cols-3">
     {values.map((value) => (
      <div key={value.title} className=" border bg-background/80 p-6">
       <h3 className="text-lg font-semibold">{value.title}</h3>
       <p className="mt-3 text-sm text-muted-foreground">{value.description}</p>
      </div>
     ))}
    </div>
   </section>
  </div>
 )
}
