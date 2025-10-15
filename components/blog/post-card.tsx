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

export function PostCard({ post, locale, readMoreLabel, readingTimeLabel }: PostCardProps) {
  return (
    <Card className="group relative flex max-h-72 flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="relative h-28 w-full overflow-hidden p-0">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
          />
        ) : (
          <div className="from-primary/10 via-secondary/40 to-accent/30 flex h-full w-full items-center justify-center bg-gradient-to-br">
            <Sparkles className="text-foreground/60 h-6 w-6" />
          </div>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-2 p-3">
        <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
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
          <h3 className="text-foreground line-clamp-2 text-base font-semibold tracking-tight">
            <Link href={`/${locale}/blog/${post.slug}`} className="cursor-pointer hover:underline">
              {post.title}
            </Link>
          </h3>
          {post.excerpt ? (
            <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">{post.excerpt}</p>
          ) : null}
        </div>

        {post.tags?.length ? (
          <div className="flex flex-wrap gap-1">
            {post.tags.map(tag => (
              <Badge key={tag} variant="muted" className="px-1.5 py-0.5 text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="mt-auto px-3 pt-0 pb-3">
        <Link
          href={`/${locale}/blog/${post.slug}`}
          className="text-primary cursor-pointer text-xs font-medium underline-offset-4 hover:underline"
        >
          {readMoreLabel}
        </Link>
      </CardFooter>
    </Card>
  )
}
