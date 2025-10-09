import fs from 'node:fs/promises'
import path from 'node:path'
import type { ReactNode } from 'react'

import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import { z } from 'zod'

import { mdxComponents } from '@/components/mdx/mdx-components'
import { type Locale, locales } from './i18n'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

const FrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional().default(''),
  coverImage: z.string().optional(),
  publishedAt: z.string(),
  locale: z.string().refine((value) => locales.includes(value as Locale), {
    message: 'Unsupported locale',
  }),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
})

type Frontmatter = z.infer<typeof FrontmatterSchema>

export interface PostSummary extends Omit<Frontmatter, 'publishedAt' | 'locale'> {
  locale: Locale
  publishedAt: Date
  readingTime: number
  filePath: string
}

export interface Post extends PostSummary {
  content: ReactNode
}

interface RawPost extends PostSummary {
  body: string
}

const cache = new Map<string, RawPost[]>()

const countReadingMinutes = (text: string) =>
  Math.max(1, Math.round(text.trim().split(/\s+/).length / 230))

async function loadPosts(): Promise<RawPost[]> {
  const cacheKey = 'all'
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!
  }

  const files = await fs.readdir(postsDirectory)
  const posts = await Promise.all(
    files
      .filter((filename) => filename.endsWith('.md') || filename.endsWith('.mdx'))
      .map(async (filename) => {
        const filePath = path.join(postsDirectory, filename)
        const fileContent = await fs.readFile(filePath, 'utf-8')
        const { data, content } = matter(fileContent)
        const parsed = FrontmatterSchema.safeParse(data)

        if (!parsed.success) {
          const message = parsed.error.issues
            .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
            .join(', ')

          throw new Error(`Invalid frontmatter in ${filename}: ${message}`)
        }

        const frontmatter = parsed.data
        const publishedAt = new Date(frontmatter.publishedAt)

        if (Number.isNaN(publishedAt.getTime())) {
          throw new Error(`Invalid publishedAt date in ${filename}`)
        }

        return {
          ...frontmatter,
          locale: frontmatter.locale as Locale,
          publishedAt,
          readingTime: countReadingMinutes(content),
          body: content,
          filePath,
        }
      }),
  )

  cache.set(cacheKey, posts)
  return posts
}

export async function getAllPosts(locale: Locale): Promise<PostSummary[]> {
  const posts = await loadPosts()
  return posts
    .filter((post) => post.locale === locale)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

export async function getPostBySlug(locale: Locale, slug: string): Promise<Post | null> {
  const posts = await loadPosts()
  const matched = posts.find((post) => post.locale === locale && post.slug === slug)

  if (!matched) {
    return null
  }

  const { content } = await compileMDX<{ [key: string]: unknown }>({
    source: matched.body,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, [remarkToc, { heading: 'h2' }]],
        rehypePlugins: [rehypeSlug, rehypeHighlight],
      },
      parseFrontmatter: false,
    },
    components: mdxComponents,
  })

  return {
    ...matched,
    content,
  }
}

export async function getLatestPosts(locale: Locale, limit = 3) {
  const posts = await getAllPosts(locale)
  return posts.slice(0, limit)
}

export async function getCategories(locale: Locale) {
  const posts = await getAllPosts(locale)
  const categories = new Map<string, number>()

  posts.forEach((post) => {
    post.categories?.forEach((category) => {
      categories.set(category, (categories.get(category) ?? 0) + 1)
    })
  })

  return Array.from(categories.entries()).map(([name, count]) => ({ name, count }))
}

export async function getTags(locale: Locale) {
  const posts = await getAllPosts(locale)
  const tags = new Map<string, number>()

  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tags.set(tag, (tags.get(tag) ?? 0) + 1)
    })
  })
Ï
  return Array.from(tags.entries()).map(([name, count]) => ({ name, count }))
}

export async function searchPosts(locale: Locale, query: string) {
  if (!query.trim()) return []

  const lower = query.trim().toLowerCase()
  const posts = await getAllPosts(locale)

  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lower) ||
      post.excerpt?.toLowerCase().includes(lower) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(lower)) ||
      post.categories?.some((category) => category.toLowerCase().includes(lower)),
  )
}

export function clearContentCache() {
  cache.clear()
}
