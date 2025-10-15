'use client'

import React, { useState, useEffect } from 'react'
import { TableOfContents, ReadingProgress } from './table-of-contents'
import { Button } from '@/components/ui/button'
import { Scroll } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface BlogContentProps {
  children: React.ReactNode
  className?: string
  locale?: string
}

export function BlogContent({ children, className, locale = 'zh' }: BlogContentProps) {
  const [showTOC, setShowTOC] = useState(false)
  const [mobileTOCOpen, setMobileTOCOpen] = useState(false)

  useEffect(() => {
    // 检查是否有标题
    const headingElements = document.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]')
    setShowTOC(headingElements.length > 0)
  }, [children])

  if (!showTOC) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className="relative">
      {/* 移动端 TOC 触发按钮 */}
      <div className="fixed right-4 bottom-4 z-40 lg:hidden">
        <Sheet open={mobileTOCOpen} onOpenChange={setMobileTOCOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="shadow-lg">
              <Scroll className="mr-2 h-4 w-4" />
              {locale === 'en' ? 'Contents' : '目录'}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>{locale === 'en' ? 'Table of Contents' : '文章目录'}</SheetTitle>
              <SheetDescription>
                {locale === 'en'
                  ? 'Click on headings to quickly jump to corresponding content'
                  : '点击标题快速跳转到对应内容'}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <ReadingProgress locale={locale} />
              <TableOfContents />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* 桌面端布局 */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* 主要内容 */}
        <div className="lg:col-span-3">
          <div className={className}>{children}</div>
        </div>

        {/* 侧边栏 TOC - 仅在桌面端显示 */}
        <aside className="hidden lg:sticky lg:top-24 lg:col-span-1 lg:block lg:h-fit">
          <div className="space-y-6">
            <ReadingProgress locale={locale} />
            <TableOfContents />
          </div>
        </aside>
      </div>
    </div>
  )
}
