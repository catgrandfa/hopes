# Hopes 私人博客

## 项目概述
一个基于 Next.js 15 和现代化技术栈的全栈个人博客系统，采用最新的 React 19、Tailwind CSS 4、Supabase 和 Drizzle ORM 构建，支持多语言、响应式设计和丰富的 Markdown 博客功能。

## 核心技术栈

### 前端框架
- **Next.js 15** - 最新版本，支持异步 APIs（cookies、headers、params）
- **React 19** - 最新用户界面库，支持新的 hooks（useActionState）
- **TypeScript** - 严格类型检查，提供完整的类型安全

### 样式与UI系统
- **Tailwind CSS 4** - 下一代原子化CSS框架，支持原生CSS变量
- **shadcn/ui** - 现代化React组件库，基于Radix UI构建
- **Proxima Nova** - 专业字体系统

### 数据层
- **Supabase PostgreSQL** - 现代化云端PostgreSQL数据库
- **Drizzle ORM** - 轻量级、类型安全的现代ORM
- **Supabase Auth** - 内置身份认证与RLS安全策略

### 国际化
- **next-intl** - Next.js 15 兼容的国际化解决方案
- **支持语言**: 中文（简体）、英文

### 内容管理系统
- **@next/mdx** - Next.js 15 官方 MDX 支持
- **Markdown 处理链**:
  - `remark-gfm` - GitHub 风格 Markdown 扩展
  - `rehype-highlight` - 语法高亮渲染
  - `rehype-slug` - 自动标题锚点生成
  - `remark-toc` - 智能目录生成

### 用户体验增强
- **Framer Motion** - 高性能动画系统
  - React 19 兼容的页面转场
  - 组件状态动画
  - 手势识别与响应
- **Embla Carousel** - 现代轮播组件
  - 触摸友好的滑动体验
  - 自动播放与循环
  - 响应式断点支持

### 状态管理
- **Zustand** - 轻量级状态管理（~13KB）
  - 零配置设置
  - TypeScript 原生支持
  - 持久化存储集成
  - React 19 并发特性兼容

### 数据获取
- **SWR** - 智能数据获取库
  - 自动缓存与重新验证
  - 内置错误重试机制
  - 实时数据同步
  - Next.js 15 Server Components 集成

### 云服务
- **Vercel** - 现代化部署平台
- **Supabase Cloud** - 全托管PostgreSQL服务

## 功能特性

### 核心功能
- [x] 博客文章展示（Markdown 支持）
- [x] 响应式设计（H5 + PC 适配）
- [x] 多语言支持（中文/英文）
- [x] 深色/浅色主题切换
- [x] 自定义主题色一键替换

### 内容功能
- [ ] 文章分类管理
- [ ] 标签系统
- [ ] 文章搜索
- [ ] 文章归档
- [ ] RSS 订阅
- [ ] 阅读统计

### 用户体验
- [ ] 页面加载动画
- [ ] 图片懒加载
- [ ] 代码块复制功能
- [ ] 文章目录导航
- [ ] 返回顶部按钮
- [ ] 阅读进度条

### 管理功能
- [ ] 文章管理后台
- [ ] 留言审核系统
- [ ] 访问统计
- [ ] SEO 优化
- [ ] 站点地图生成

## 开发规范

### 编码风格
- **函数式编程** - 纯函数式编程范式
- **TypeScript 严格模式** - 启用所有类型检查
- **ESLint + Prettier** - 代码格式化和规范检查

### 项目结构
```
hopes/
├── app/                    # Next.js 15 App Router
│   ├── [locale]/          # 国际化路由
│   ├── api/              # API Routes
│   ├── globals.css       # Tailwind CSS 4 样式
│   └── layout.tsx        # 根布局组件
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件库
│   ├── blog/             # 博客相关组件
│   └── layout/           # 布局组件
├── lib/                   # 工具函数库
│   ├── utils.ts          # 通用工具
│   ├── validations.ts    # 数据验证
│   └── constants.ts      # 常量定义
├── db/                    # 数据库层
│   ├── schema.ts         # Drizzle ORM 模式
│   ├── migrations/       # 数据库迁移
│   └── seed.ts          # 数据种子
├── content/               # 内容管理
│   ├── posts/            # Markdown 博客文章
│   └── pages/            # 静态页面内容
├── utils/                 # Next.js 工具
│   └── supabase/         # Supabase 客户端配置
└── public/               # 静态资源
    ├── images/           # 图片资源
    └── icons/            # 图标文件
```

## 最佳实践与配置

### Next.js 15 配置建议
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 启用实验性功能
  experimental: {
    // 开启增量式部分预渲染
    ppr: 'incremental',
    // 启用 React 19 新特性
    reactCompiler: true
  },
  // TypeScript 严格模式
  typescript: {
    tsconfigPath: './tsconfig.json',
  }
}

export default nextConfig
```

### Supabase 集成最佳实践
```typescript
// utils/supabase/server.ts - Next.js 15 异步 cookies API
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies() // Next.js 15 需要 await

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component 中调用时可以忽略
          }
        },
      },
    }
  )
}
```

### Drizzle ORM PostgreSQL 配置
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: true // Supabase 需要 SSL
  },
  verbose: true,
  strict: true,
})
```

### Tailwind CSS 4 迁移指南
```css
/* app/globals.css - 使用新的 @import 语法 */
@import "tailwindcss";

/* 自定义工具类 - 使用新的 @utility 语法 */
@utility content-auto {
  content-visibility: auto;
}

/* 主题变量定义 */
@theme {
  --font-display: "Proxima Nova", "sans-serif";
  --breakpoint-3xl: 120rem;
  --color-brand-500: oklch(0.7 0.2 200);
}
```

### shadcn/ui 组件安装
```bash
# 初始化配置
npx shadcn@latest init

# 安装常用组件
npx shadcn@latest add button card input label textarea
npx shadcn@latest add select tabs dialog sheet
```

### 环境要求
- **Node.js** >= 20.0.0 (Next.js 15 推荐)
- **pnpm** >= 8.0.0 (推荐包管理器)
- **TypeScript** >= 5.0.0
- **PostgreSQL** >= 15 (Supabase 版本)

### 开发工作流
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 数据库迁移
pnpm db:push
pnpm db:generate

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
```

### 部署注意事项
- ✅ **Vercel** - 原生支持 Next.js 15
- ✅ **环境变量** - 确保 Supabase 密钥正确配置
- ✅ **构建检查** - 部署前运行 `pnpm build` 验证
- ✅ **数据库** - 生产环境使用 Supabase 连接池
