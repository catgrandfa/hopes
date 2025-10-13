import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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
  <Card className="group relative flex max-h-72  flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
   <CardHeader className="relative h-28 w-full overflow-hidden p-0">
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
      <Sparkles className="h-6 w-6 text-foreground/60" />
     </div>
    )}
   </CardHeader>

   <CardContent className="flex flex-1 flex-col space-y-2 p-3">
    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
     <span className="inline-flex items-center gap-0.5">
      <Calendar className="h-3 w-3" />
      {formatDate(post.publishedAt, locale)}
     </span>
     <span className="inline-flex items-center gap-0.5">
      <Clock className="h-3 w-3" />
      {post.readingTime} {readingTimeLabel}
     </span>
    </div>

    <div>
     <h3 className="text-base font-semibold tracking-tight text-foreground line-clamp-2">
      <Link href={`/${locale}/blog/${post.slug}`} className="hover:underline">
       {post.title}
      </Link>
     </h3>
     {post.excerpt ? (
      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{post.excerpt}</p>
     ) : null}
    </div>

    {post.tags?.length ? (
     <div className="flex flex-wrap gap-1">
      {post.tags.map((tag) => (
       <Badge key={tag} variant="muted" className="text-xs px-1.5 py-0.5">
        #{tag}
       </Badge>
      ))}
     </div>
    ) : null}
   </CardContent>

   <CardFooter className="mt-auto px-3 pb-3 pt-0">
     <Link
      href={`/${locale}/blog/${post.slug}`}
      className="text-xs font-medium text-primary underline-offset-4 hover:underline"
     >
      {readMoreLabel}
     </Link>
   </CardFooter>
  </Card>
 )
}
