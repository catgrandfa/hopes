import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          欢迎来到 Hopes 博客
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          基于 Next.js 15、React 19、Tailwind CSS 4 和现代化技术栈构建的个人博客系统
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href={`/${locale}/blog`}>
              {t('blog.title')}
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href={`/${locale}/about`}>
              {t('nav.about')}
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center mb-12">技术特性</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Next.js 15"
            description="最新版本的 Next.js，支持异步 API 和增量式部分预渲染"
            icon="⚡"
          />
          <FeatureCard
            title="React 19"
            description="使用最新的 React 特性，包括新的 hooks 和并发功能"
            icon="⚛️"
          />
          <FeatureCard
            title="Tailwind CSS 4"
            description="下一代 CSS 框架，支持原生 CSS 变量和更好的性能"
            icon="🎨"
          />
          <FeatureCard
            title="TypeScript"
            description="完整的类型安全，提供更好的开发体验"
            icon="📝"
          />
          <FeatureCard
            title="Supabase"
            description="现代化的后端即服务，提供数据库和身份验证"
            icon="🗄️"
          />
          <FeatureCard
            title="国际化"
            description="支持多语言，轻松切换中英文界面"
            icon="🌍"
          />
        </div>
      </section>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}