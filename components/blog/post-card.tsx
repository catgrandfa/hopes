import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import type { PostSummary } from '@/lib/content'
import type { Locale } from '@/lib/i18n'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
 post: PostSummary
 locale: Locale
 readMoreLabel: string
 readingTimeLabel: string
}

export function PostCard({
 post,
 locale,
 readMoreLabel,
 readingTimeLabel,
}: PostCardProps) {
 return (
  <article className="group relative flex h-full flex-col overflow-hidden border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
   <div className="relative h-56 w-full overflow-hidden bg-muted">
    {post.coverImage ? (
     <Image
      src={post.coverImage}
      alt={post.title}
      fill
      className="object-cover transition duration-500 group-hover:scale-105"
      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      priority={false}
     />
    ) : (
     <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/40 to-accent/30">
      <Sparkles className="h-12 w-12 text-foreground/60" />
     </div>
    )}
   </div>

   <div className="flex flex-1 flex-col space-y-4 p-6">
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
     <span className="inline-flex items-center gap-1">
      <Calendar className="h-4 w-4" />
      {formatDate(post.publishedAt, locale)}
     </span>
     <span className="inline-flex items-center gap-1">
      <Clock className="h-4 w-4" />
      {post.readingTime} {readingTimeLabel}
     </span>
    </div>

    <div>
     <h3 className="text-2xl font-semibold tracking-tight text-foreground">
      <Link href={`/${locale}/blog/${post.slug}`} className="hover:underline">
       {post.title}
      </Link>
     </h3>
     {post.excerpt ? (
      <p className="mt-3 line-clamp-3 text-muted-foreground">{post.excerpt}</p>
     ) : null}
    </div>

    {post.tags?.length ? (
     <div className="flex flex-wrap gap-2">
      {post.tags.map((tag) => (
       <Badge key={tag} variant="muted">
        #{tag}
       </Badge>
      ))}
     </div>
    ) : null}

    <div className="mt-auto pt-4">
     <Link
      href={`/${locale}/blog/${post.slug}`}
      className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
     >
      {readMoreLabel}
     </Link>
    </div>
   </div>
  </article>
 )
}
