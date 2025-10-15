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
import { cache } from 'react'

import { mdxComponents } from '@/components/mdx/mdx-components'
import { type Locale, locales } from './i18n'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

const FrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().optional().default(''),
  coverImage: z.string().optional(),
  publishedAt: z.string(),
  locale: z.string().refine(value => locales.includes(value as Locale), {
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

interface ContentIndex {
  posts: RawPost[]
  byLocale: Record<Locale, RawPost[]>
  bySlug: Map<string, RawPost>
  categories: Record<Locale, Map<string, number>>
  tags: Record<Locale, Map<string, number>>
  lastModified: Date
}

// Memory cache with invalidation strategy
let contentIndex: ContentIndex | null = null
let indexPromise: Promise<ContentIndex> | null = null

const countReadingMinutes = (text: string) =>
  Math.max(1, Math.round(text.trim().split(/\s+/).length / 230))

// Check if content files have been modified
async function hasContentChanged(): Promise<boolean> {
  try {
    const stats = await fs.stat(postsDirectory)
    if (!contentIndex) return true
    return stats.mtime > contentIndex.lastModified
  } catch {
    return true
  }
}

// Build comprehensive content index
async function buildContentIndex(): Promise<ContentIndex> {
  console.log('🔄 Building content index...')
  const startTime = performance.now()

  const files = await fs.readdir(postsDirectory)
  const validFiles = files.filter(filename =>
    filename.endsWith('.md') || filename.endsWith('.mdx')
  )

  const posts: RawPost[] = []
  const byLocale: Record<Locale, RawPost[]> = { zh: [], en: [] }
  const bySlug = new Map<string, RawPost>()
  const categories: Record<Locale, Map<string, number>> = { zh: new Map(), en: new Map() }
  const tags: Record<Locale, Map<string, number>> = { zh: new Map(), en: new Map() }

  // Process files in parallel with controlled concurrency
  const batchSize = 5
  for (let i = 0; i < validFiles.length; i += batchSize) {
    const batch = validFiles.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(async filename => {
        const filePath = path.join(postsDirectory, filename)
        const fileContent = await fs.readFile(filePath, 'utf-8')
        const { data, content } = matter(fileContent)
        const parsed = FrontmatterSchema.safeParse(data)

        if (!parsed.success) {
          console.warn(`⚠️ Invalid frontmatter in ${filename}`)
          return null
        }

        const frontmatter = parsed.data
        const publishedAt = new Date(frontmatter.publishedAt)

        if (Number.isNaN(publishedAt.getTime())) {
          console.warn(`⚠️ Invalid date in ${filename}`)
          return null
        }

        const post: RawPost = {
          ...frontmatter,
          locale: frontmatter.locale as Locale,
          publishedAt,
          readingTime: countReadingMinutes(content),
          body: content,
          filePath,
        }

        // Build indexes
        byLocale[post.locale].push(post)
        bySlug.set(`${post.locale}:${post.slug}`, post)

        // Category indexing
        post.categories?.forEach(category => {
          const catMap = categories[post.locale]
          catMap.set(category, (catMap.get(category) || 0) + 1)
        })

        // Tag indexing
        post.tags?.forEach(tag => {
          const tagMap = tags[post.locale]
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
        })

        return post
      })
    )

    posts.push(...batchResults.filter(Boolean) as RawPost[])
  }

  // Sort posts by date
  Object.values(byLocale).forEach(localePosts => {
    localePosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
  })

  const stats = await fs.stat(postsDirectory)

  const index: ContentIndex = {
    posts,
    byLocale,
    bySlug,
    categories,
    tags,
    lastModified: stats.mtime,
  }

  const endTime = performance.now()
  console.log(`✅ Content index built in ${Math.round(endTime - startTime)}ms`)

  return index
}

// Get or build content index with caching
async function getContentIndex(): Promise<ContentIndex> {
  if (indexPromise) {
    return indexPromise
  }

  if (!contentIndex || await hasContentChanged()) {
    indexPromise = buildContentIndex()
    contentIndex = await indexPromise
    indexPromise = null
  }

  return contentIndex
}

// MDX compilation cache
const mdxCache = new Map<string, ReactNode>()

// Cached function to get posts by locale
export const getAllPosts = cache(async (locale: Locale): Promise<PostSummary[]> => {
  const index = await getContentIndex()
  return index.byLocale[locale] || []
})

// Cached function to get single post
export const getPostBySlug = cache(async (locale: Locale, slug: string): Promise<Post | null> => {
  const index = await getContentIndex()
  const rawPost = index.bySlug.get(`${locale}:${slug}`)

  if (!rawPost) {
    return null
  }

  // Check MDX cache first
  const cacheKey = `${locale}:${slug}`
  if (mdxCache.has(cacheKey)) {
    return {
      ...rawPost,
      content: mdxCache.get(cacheKey)!
    }
  }

  // Compile MDX with caching
  const { content } = await compileMDX<{ [key: string]: unknown }>({
    source: rawPost.body,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, [remarkToc, { heading: 'h2' }]],
        rehypePlugins: [rehypeSlug, rehypeHighlight],
      },
      parseFrontmatter: false,
    },
    components: mdxComponents,
  })

  // Cache MDX content
  mdxCache.set(cacheKey, content)

  return {
    ...rawPost,
    content,
  }
})

// Cached function to get latest posts
export const getLatestPosts = cache(async (locale: Locale, limit = 3): Promise<PostSummary[]> => {
  const posts = await getAllPosts(locale)
  return posts.slice(0, limit)
})

// Cached function to get categories
export const getCategories = cache(async (locale: Locale) => {
  const index = await getContentIndex()
  const catMap = index.categories[locale] || new Map()
  return Array.from(catMap.entries()).map(([name, count]) => ({ name, count }))
})

// Cached function to get tags
export const getTags = cache(async (locale: Locale) => {
  const index = await getContentIndex()
  const tagMap = index.tags[locale] || new Map()
  return Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }))
})

// Optimized search function
export const searchPosts = cache(async (locale: Locale, query: string) => {
  if (!query.trim()) return []

  const lower = query.trim().toLowerCase()
  const posts = await getAllPosts(locale)

  return posts.filter(
    post =>
      post.title.toLowerCase().includes(lower) ||
      post.excerpt?.toLowerCase().includes(lower) ||
      post.tags?.some(tag => tag.toLowerCase().includes(lower)) ||
      post.categories?.some(category => category.toLowerCase().includes(lower))
  )
})

// Cache management utilities
export function clearContentCache() {
  contentIndex = null
  indexPromise = null
  mdxCache.clear()
}

export function getCacheStats() {
  return {
    contentIndexCached: !!contentIndex,
    mdxCacheSize: mdxCache.size,
    contentIndexSize: contentIndex ? {
      totalPosts: contentIndex.posts.length,
      byLocale: Object.fromEntries(
        Object.entries(contentIndex.byLocale).map(([locale, posts]) => [locale, posts.length])
      )
    } : null
  }
}