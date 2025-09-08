import createMiddleware from 'next-intl/middleware'
import { updateSession } from '@/utils/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

// 创建国际化中间件
const intlMiddleware = createMiddleware({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'always',
})

export async function middleware(request: NextRequest) {
  // 首先处理 Supabase 会话更新
  const supabaseResponse = await updateSession(request)
  
  // 然后处理国际化
  const intlResponse = intlMiddleware(request)
  
  // 合并响应头
  if (intlResponse) {
    supabaseResponse.headers.forEach((value, key) => {
      intlResponse.headers.set(key, value)
    })
    return intlResponse
  }
  
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}