'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Scroll, ChevronRight } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 获取所有标题
  const updateHeadings = useCallback(() => {
    const headingElements = Array.from(
      document.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]')
    ).map(element => ({
      id: element.id,
      text: element.textContent || '',
      level: parseInt(element.tagName.substring(1)),
    }))

    setHeadings(headingElements)

    // 如果没有 activeId，设置第一个标题为 active
    setActiveId(prev => {
      if (!prev && headingElements.length > 0) {
        return headingElements[0].id
      }
      return prev
    })
  }, [])

  useEffect(() => {
    // 初始化时获取标题
    updateHeadings()

    // 监听 DOM 变化，适用于动态加载的内容
    const mutationObserver = new MutationObserver(() => {
      updateHeadings()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // 设置 Intersection Observer 来跟踪当前可见的标题
    observerRef.current = new IntersectionObserver(
      entries => {
        // 找到所有正在相交的元素
        const intersectingEntries = entries.filter(entry => entry.isIntersecting)

        if (intersectingEntries.length > 0) {
          // 找到最顶部的相交元素
          const topEntry = intersectingEntries.reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
          )
          setActiveId(topEntry.target.id)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-20% 0px -70% 0px',
      }
    )

    // 观察所有标题元素
    const observeHeadings = () => {
      const headingElements = document.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]')

      // 清除之前的观察
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      // 观察新的标题元素
      headingElements.forEach(element => {
        observerRef.current?.observe(element)
      })
    }

    observeHeadings()

    // 监听滚动事件，作为 Intersection Observer 的补充
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      // 找到当前滚动位置对应的标题
      const headingElements = Array.from(
        document.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]')
      )

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i]
        const elementTop = element.getBoundingClientRect().top + window.scrollY

        if (elementTop <= scrollPosition) {
          setActiveId(element.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // 定期更新标题（防止内容动态变化）
    const intervalId = setInterval(updateHeadings, 1000)

    return () => {
      mutationObserver.disconnect()
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      window.removeEventListener('scroll', handleScroll)
      clearInterval(intervalId)
    }
  }, [updateHeadings])

  // 点击标题滚动到对应位置
  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // 立即设置 activeId 以提供即时反馈
      setActiveId(id)

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
        <Scroll className="h-4 w-4" />
        目录
      </div>

      <nav className="max-h-[60vh] space-y-1 overflow-y-auto">
        {headings.map(heading => {
          const isActive = activeId === heading.id
          const paddingLeft = (heading.level - 2) * 16

          return (
            <button
              key={heading.id}
              onClick={() => handleHeadingClick(heading.id)}
              className={cn(
                'hover:text-foreground w-full text-left text-sm transition-colors',
                'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1',
                'focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none',
                isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'
              )}
              style={{ paddingLeft: `${paddingLeft + 8}px` }}
            >
              <ChevronRight
                className={cn(
                  'h-3 w-3 flex-shrink-0 transition-transform',
                  isActive ? 'rotate-90' : 'rotate-0'
                )}
              />
              <span className="truncate" title={heading.text}>
                {heading.text}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

interface ReadingProgressProps {
  className?: string
  locale?: string
}

export function ReadingProgress({ className, locale = 'zh' }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY

      // 防止除零错误
      if (documentHeight <= 0) {
        setProgress(0)
        return
      }

      const progressPercentage = (scrolled / documentHeight) * 100

      setProgress(Math.min(100, Math.max(0, progressPercentage)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始化时调用一次

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 国际化文本
  const texts =
    locale === 'en'
      ? {
          title: 'Reading Progress',
          completed: 'completed',
        }
      : {
          title: '阅读进度',
          completed: '已完成',
        }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="text-foreground text-sm font-semibold">{texts.title}</div>
      <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-muted-foreground text-xs">
        {Math.round(progress)}% {texts.completed}
      </div>
    </div>
  )
}
