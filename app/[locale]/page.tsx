import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Zap, FileText, Palette } from 'lucide-react'

import { PostCard } from '@/components/blog/post-card'
import { Button } from '@/components/ui/button'
import { getLatestPosts, getCategories } from '@/lib/content'
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

 const [tHome, tBlog, tCommon, latestPosts, categories] = await Promise.all([
  getTranslations({ locale, namespace: 'home' }),
  getTranslations({ locale, namespace: 'blog' }),
  getTranslations({ locale, namespace: 'common' }),
  getLatestPosts(locale, 3),
  getCategories(locale),
 ])

 const features = [
  {
   icon: <Zap className="h-6 w-6" />,
   title: tHome('features.stackTitle'),
   description: tHome('features.stackDescription'),
  },
  {
   icon: <FileText className="h-6 w-6" />,
   title: tHome('features.mdxTitle'),
   description: tHome('features.mdxDescription'),
  },
  {
   icon: <Palette className="h-6 w-6" />,
   title: tHome('features.designTitle'),
   description: tHome('features.designDescription'),
  },
 ]

 return (
  <div className="space-y-20 py-16">
   <section className="container grid items-center gap-12 border bg-gradient-to-br from-muted/60 via-card to-card/80 px-8 py-20 md:grid-cols-[1.05fr_0.95fr]">
    <div className="space-y-6 text-center md:text-left">
     <h1 className="text-4xl font-bold leading-tight md:text-5xl">
      {tHome('heroTitle')}
     </h1>
     <p className="text-lg text-muted-foreground">{tHome('heroSubtitle')}</p>
     <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
      <Button asChild size="lg" className="w-full md:w-auto">
       <Link href={`/${locale}/blog`}>{tHome('ctaPrimary')}</Link>
      </Button>
      <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
       <Link href={`/${locale}/about`}>{tHome('ctaSecondary')}</Link>
      </Button>
     </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">
     {features.map((feature) => (
      <div
       key={feature.title}
       className="flex flex-col gap-3 border bg-background/80 p-6 text-left shadow-sm"
      >
       {feature.icon}
       <h3 className="text-lg font-semibold">{feature.title}</h3>
       <p className="text-sm text-muted-foreground">{feature.description}</p>
      </div>
     ))}
    </div>
   </section>

   <section className="container space-y-8">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
     <div>
      <h2 className="text-3xl font-semibold">{tHome('latestTitle')}</h2>
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

   <section className="container space-y-8">
    <h2 className="text-3xl font-semibold">{tHome('categoriesTitle')}</h2>
    <div className="flex flex-wrap gap-3">
     {categories.slice(0, 6).map((category) => (
      <Link
       key={category.name}
       href={{ pathname: `/${locale}/blog`, query: { category: category.name } }}
       className="inline-flex items-center border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
      >
       {category.name}
       <span className="ml-2 text-xs opacity-70">{category.count}</span>
      </Link>
     ))}
    </div>
   </section>
  </div>
 )
}
