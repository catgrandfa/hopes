# 🚀 Hopes 博客项目启动指南

## 📋 环境要求

- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0 (推荐包管理器)
- **PostgreSQL** >= 15 (通过 Supabase 提供)

## 🛠️ 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 环境配置

复制环境变量示例文件：

```bash
cp .env.example .env.local
```

配置以下环境变量：

```bash
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (从 Supabase 仪表板获取)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Database (Supabase 数据库连接字符串)
DATABASE_URL=your-supabase-database-url
```

### 3. 设置 Supabase

1. 访问 [Supabase](https://supabase.com) 创建新项目
2. 获取项目 URL 和 API Key
3. 配置数据库连接

### 4. 初始化数据库

生成数据库迁移：

```bash
pnpm db:generate
```

推送数据库模式：

```bash
pnpm db:push
```

### 5. 启动开发服务器

```bash
pnpm dev
```

项目将在 http://localhost:3000 启动

## 📁 项目结构

```
hopes/
├── app/                    # Next.js 15 App Router
│   ├── [locale]/          # 国际化路由
│   ├── api/              # API Routes
│   └── globals.css       # 全局样式
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件库
│   ├── blog/             # 博客相关组件
│   └── layout/           # 布局组件
├── content/               # 内容管理
│   └── posts/            # Markdown 博客文章
├── db/                    # 数据库层
│   ├── schema.ts         # Drizzle ORM 模式
│   └── index.ts          # 数据库连接
├── lib/                   # 工具函数库
├── utils/                 # Next.js 工具
│   └── supabase/         # Supabase 客户端
├── messages/              # 国际化翻译
└── public/               # 静态资源
```

## 🧪 开发命令

```bash
# 开发服务器
pnpm dev

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 构建项目
pnpm build

# 启动生产服务器
pnpm start

# 数据库相关
pnpm db:generate     # 生成迁移文件
pnpm db:push         # 推送模式到数据库
pnpm db:studio       # 打开 Drizzle Studio
```

## 🎨 添加新组件

使用 shadcn/ui CLI 添加组件：

```bash
# 添加单个组件
npx shadcn@latest add button

# 添加多个组件
npx shadcn@latest add card dialog input label
```

## 📝 创建博客文章

在 `content/posts/` 目录下创建 `.md` 文件：

```markdown
---
title: "文章标题"
excerpt: "文章摘要"
publishedAt: "2024-01-01"
locale: "zh"
tags: ["标签1", "标签2"]
categories: ["分类"]
---

# 文章内容

使用 Markdown 编写文章内容...
```

## 🌐 国际化

- 中文翻译：`messages/zh.json`
- 英文翻译：`messages/en.json`

## 🚀 部署

### Vercel 部署 (推荐)

1. 将代码推送到 GitHub
2. 连接 Vercel 账户
3. 导入项目并配置环境变量
4. 部署完成

### 环境变量配置

确保在部署平台配置所有必要的环境变量：

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`

## 🔧 常见问题

### 1. 依赖安装失败

```bash
# 清理缓存
pnpm store prune

# 重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 2. 数据库连接失败

检查 Supabase 配置和网络连接，确保数据库 URL 正确。

### 3. 类型错误

运行类型检查：

```bash
pnpm typecheck
```

## 📚 技术文档

- [Next.js 15 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Drizzle ORM 文档](https://orm.drizzle.team)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！