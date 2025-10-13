# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development & Build
- `pnpm dev` - Start development server (localhost:3000)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks
- `pnpm typecheck` - Run TypeScript type checking

### Database Operations
- `pnpm db:generate` - Generate Drizzle migration files
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio (database GUI)
- `pnpm db:seed` - Seed database with initial data

## Project Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Database**: Supabase PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **Internationalization**: next-intl (supports zh/en)
- **Content**: MDX support with remark/rehype processing
- **State Management**: Zustand
- **Data Fetching**: SWR
- **Animations**: Framer Motion
- **Package Manager**: pnpm (required)

### Key Architectural Patterns

#### Next.js 15 App Router Structure
```
app/
├── [locale]/          # Internationalized routes (zh/en)
│   ├── page.tsx      # Home page
│   ├── blog/         # Blog routes
│   └── ...           # Other pages
├── globals.css       # Tailwind CSS 4 styles
└── layout.tsx        # Root layout
```

#### Database Schema (db/schema.ts)
- **posts**: Blog articles with multilingual support
- **categories**: Post categories with locale support
- **tags**: Post tags (shared across locales)
- **postCategories/postTags**: Many-to-many relationships
- **comments**: User comments with approval workflow

#### Supabase Client Configuration
Two separate client configurations for Next.js 15:
- `utils/supabase/server.ts` - Server-side client with async cookies API
- `utils/supabase/client.ts` - Client-side client for browser usage

#### Middleware Chain (middleware.ts)
1. Supabase session management
2. Internationalization routing (next-intl)
- Supports zh (default) and en locales
- Always uses locale prefix (/zh/*, /en/*)

#### Component Architecture
```
components/
├── ui/               # shadcn/ui components
├── blog/             # Blog-specific components
├── layout/           # Layout components
└── mdx/              # MDX rendering components
```

### Internationalization Setup
- **Messages**: Located in `messages/` directory (zh.json, en.json)
- **Configuration**: `i18n/config.ts` defines supported locales
- **Middleware**: Handles locale detection and routing
- **Default Locale**: Chinese (zh)

### MDX Content Processing
- Uses `@next/mdx` for Next.js 15 compatibility
- Processing chain: remark-gfm → rehype-highlight → rehype-slug → remark-toc
- Content stored in `content/posts/` as markdown files

### Environment Configuration
Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `DATABASE_URL` (for Drizzle migrations)
- `NEXT_PUBLIC_APP_URL` (for metadata generation)

### Database Development Workflow
1. Modify schema in `db/schema.ts`
2. Run `pnpm db:generate` to create migration
3. Run `pnpm db:push` to apply changes to Supabase
4. Use `pnpm db:studio` to inspect database

### Code Style & Standards
- **ESLint**: TypeScript strict mode with Next.js rules
- **Prettier**: Configured for consistent formatting
- **Components**: shadcn/ui with "new-york" style
- **Icons**: Lucide React (mandatory - no emoji or character icons allowed)
- **Type Safety**: Zod schemas generated from Drizzle models

### Important Implementation Details

#### Next.js 15 Specifics
- Uses async cookies API: `await cookies()` in server components
- Server Actions for form handling
- React 19 compatibility with new hooks

#### Supabase Integration
- Row Level Security (RLS) policies for data protection
- Real-time subscriptions support
- File storage for blog images/attachments

#### Tailwind CSS 4 Configuration
- Uses new `@import "tailwindcss"` syntax
- Custom utilities in `app/globals.css`
- CSS variables for theming support

## Development Guidelines

### When Working with Database
- Always use Drizzle ORM for type safety
- Generate Zod schemas from Drizzle models
- Test migrations locally before applying to production
- Use the database studio for debugging

### When Adding New Features
- Follow the existing component structure
- Use TypeScript strict mode throughout
- Implement proper error handling with user feedback
- Consider internationalization from the start

### Component Development Guidelines
- **Mandatory shadcn/ui Usage**: All UI components MUST use shadcn/ui components as the foundation
- **Component Creation Process**:
  1. First check if the required shadcn/ui component already exists in `components/ui/`
  2. If not available, create it using the official shadcn/ui CLI command: `npx shadcn@latest add [component-name]`
  3. Never manually create shadcn/ui components - always use the CLI to ensure consistency and proper configuration
  4. Customize existing shadcn/ui components as needed, but start with the official implementation
- **Available Components**: Check `components/ui/` directory first before requesting new components
- **Style Consistency**: All components should follow the shadcn/ui "new-york" style

### When Modifying Styles
- Extend existing Tailwind utilities when possible
- Use shadcn/ui components as building blocks
- Maintain the neutral base color scheme
- Test both light and dark themes

### When Working with Content
- Store blog posts as MDX files in `content/posts/`
- Use the existing markdown processing pipeline
- Follow the established frontmatter structure
- Consider SEO when creating new pages

### Blog Image Handling
- **Placeholder Images**: When no cover image is provided, blog cards automatically display a gradient placeholder with a Sparkles icon from lucide-react
- The placeholder uses a `bg-gradient-to-br from-primary/10 via-secondary/40 to-accent/30` background
- Images are stored in Supabase storage and served via Next.js Image component
- Cover images are optional - the system gracefully handles missing images

### Icon Usage Guidelines
- **Icon Library**: All icons must use lucide-react library only
- **No Emoji or Character Icons**: Absolutely no emoji (🎨🚀💡) or character icons (✨★♦) are allowed in any components
- **Consistent Usage**: All UI icons should come from lucide-react to maintain visual consistency
- **Import Pattern**: Always import icons at the top of components: `import { IconName } from 'lucide-react'`
- **Sizing**: Use consistent sizing classes like `h-4 w-4`, `h-6 w-6`, etc.
- **Content Icons**: For MDX content, use text alternatives instead of icons to avoid React component complexity
- **Examples**:
  - ✅ Correct: `<Sparkles className="h-12 w-12 text-foreground/60" />`
  - ❌ Wrong: `✨` or emoji characters
  - ✅ Correct: `<Zap className="h-6 w-6" />` for features
  - ❌ Wrong: Using emoji in section headers or UI elements