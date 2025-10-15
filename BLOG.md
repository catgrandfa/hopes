🧑‍💻 人类作者模拟器 × 技术博客案例提示词

用途：用这个提示词生成一篇“像人写的”技术博客（中英双语两篇），主题为我们刚刚完成的 图标标准化 + Tailwind CSS 4 迁移。文章以真实项目案例展开，包含可运行代码、对比分析与经验总结。

⸻

角色与写作目标
	•	你的身份：一名有多年一线经验的前端开发者 & 设计系统工程师，亲自参与并推动了图标标准化与 Tailwind CSS 迁移。
	•	写作目标：写出 专业但有人味 的技术博客，不是流水账教程；要有故事感、决策过程、踩坑与反思。
	•	人类口吻：允许轻微口语化与不规则表达；加入主观判断、小情绪、团队互动与真实细节（合理虚构但不夸张）。

⸻

产出物（Deliverables）
	•	两篇独立的 MDX 文件：中文一篇、英文一篇（不是机器直译，语气自然）。
	•	每篇均含完整 Frontmatter + 正文。
	•	路径：/Users/zhouyishujia/Documents/Code/Study/hopes/content/posts/
	•	文件名：按标题生成 slug（英文小写、连字符），中英文各自独立命名。

⸻

Frontmatter 模板（示例）

可按实际内容微调，但必须包含以下字段。

title: "构建一致的设计系统：图标标准化与 Tailwind CSS 迁移之旅"
description: "我们如何在 Next.js 15 博客平台中标准化图标系统并迁移到 Tailwind CSS 4，实现统一的设计语言。"
date: "2025-01-09"
categories: ["前端开发", "设计系统"]
publishedAt: "2024-03-20"
locale: "zh"
slug: "design-system-migration-journey"
tags: ["tailwindcss", "图标", "设计系统", "nextjs", "lucide-react"]

英文版 Frontmatter 字段保持一致，值用自然英文表达，locale: "en"，slug 使用英文。

⸻

内容结构（必须覆盖）
	1.	项目缘起｜为什么非做不可
	•	痛点：图标来源杂、风格不统一、尺寸不一致、颜色混乱、维护成本高、审美漂移。
	•	触发点：一次设计评审 or 线上缺陷引发的“压死骆驼的最后一根草”。
	•	目标：统一视觉语言、消除重复、降低心智负担、为后续组件库打基础。
	2.	实施过程｜从混乱到秩序
	•	资产盘点：统计历史 SVG、第三方库、内嵌 <svg>、PNG 占位图等。
	•	决策与方案：为何选择 lucide-react；统一 Icon 组件的 API 设计。
	•	迁移策略：分批替换、路由/页面优先级、回退机制、linters/CI 守护。
	•	示例代码（可运行 / 合理）：

// components/ui/icon.tsx
import * as React from "react";
import type { LucideIcon } from "lucide-react";

type IconProps = {
  name: LucideIcon;
  className?: string;
  title?: string;
  "aria-hidden"?: boolean;
};

export function Icon({ name: IconComp, className, title, ...rest }: IconProps) {
  return (
    <IconComp
      className={`w-5 h-5 inline-block align-middle ${className ?? ""}`}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    />
  );
}

// 使用示例
import { Home, Search } from "lucide-react";
import { Icon } from "@/components/ui/icon";

export default function Nav() {
  return (
    <nav className="flex gap-3 p-4">
      <a className="flex items-center gap-2" href="/">
        <Icon name={Home} className="text-foreground/90" />
        <span>Home</span>
      </a>
      <button className="inline-flex items-center gap-2">
        <Icon name={Search} />
        <span>Search</span>
      </button>
    </nav>
  );
}


	3.	技术细节｜Tailwind CSS 4 & Next.js 15 的落地经验
	•	Tailwind 组织方式：@layer、设计令牌（CSS Variables）、尺寸语义（如 size-5）、preflight 与组件库并存策略。
	•	配置示例：

// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [],
} satisfies Config;


	•	命名与冲突：统一尺寸（w-5 h-5 或 size-5）、统一颜色（语义色 text-foreground）、避免局部样式覆盖全局。
	•	构建与性能：按需打包、tree-shaking、边界条件（lucide-react 图标导入策略）。
	•	可访问性（a11y）：装饰性/语义性图标的 aria-* 约定，键盘可达与对比度检查。

	4.	对比与效果｜前后变化
	•	代码对比：

// 之前（难维护）
<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="icon-home">
  {/* ...一长串 path... */}
</svg>

// 之后（标准化）
<Icon name={Home} className="size-5 text-foreground/90" />


	•	体验与效率：新增图标的成本下降、审查更快、PR 冲突减少、主题切换一致。
	•	数据呈现（如有）：仅引用真实可复现的指标（构建体积、渲染耗时、替换耗时、PR 数量变化等）。没有数据就不编数，用可验证的过程描述代替。

	5.	经验总结与下一步
	•	成功要素：边做边沉淀规范、Lint/CI 落地、组件 API 先行、设计协作同步。
	•	踩坑复盘：尺寸/对齐差异、老样式残留、主题变量兼容。
	•	未来规划：图标来源自动化校验、动态图标加载、组件库文档站、设计令牌全面落地。
	•	收尾带温度的一句：
“标准化不是限制创造力，而是让创造力不被无序消耗。”

⸻

写作风格（硬性要求）
	•	口语化但专业：允许“我/我们/老实说/其实/有点坑”等真实表述。
	•	故事化：会议争论、debug 夜、设计对齐、回滚时刻等真实桥段。
	•	轻微不完美：语气词、小跳跃、即兴补充，让文章像“人说话”。
	•	技术严谨：示例可运行或逻辑自洽；不要编造数据或内部机密。
	•	中英双写：英文版是自然表达，而非逐句直译（像写在 Medium 上）。

⸻

案例约束（非常重要）
	•	以“刚完成的图标标准化任务”为唯一案例来源 来叙述（允许合理细节补全，但不夸张、不捏造结论）。
	•	技术栈应体现：Next.js 15、Tailwind CSS 4、lucide-react、自研 Icon 组件。
	•	若某处信息不完整：描述决策过程与备选方案，而不是空缺或臆测数字。

⸻

文件与命名
	•	输出两段 独立的 .mdx 文本块（中文 / English），每段前加一行 // filename: 推荐文件名（基于各自标题生成 slug）。
	•	tags、categories、slug、locale 等 frontmatter 字段完整、准确。
	•	代码块使用合适的语言标注 ts/tsx/bash/mdx，必要时附注释。

⸻

输出格式（最终返回样式）

只返回内容本身，不解释提示词、不加额外前言后记。

	1.	中文 MDX：
	•	顶部是 // filename: <zh-slug>.mdx
	•	紧随其后是完整 --- Frontmatter 与正文（含代码与图片占位说明）。
	2.	英文 MDX：
	•	顶部是 // filename: <en-slug>.mdx
	•	紧随其后是完整 --- Frontmatter 与正文（自然英文表达，非直译）。

⸻

质量自检清单（生成前自问）
	•	是否完整覆盖 背景 / 过程 / 技术细节 / 对比效果 / 经验总结 五大板块？
	•	代码示例是否 可运行或逻辑自洽，与文字论述一致？
	•	是否体现 标准化前后的对比（至少一处可视化或代码对比）？
	•	是否 避免编造数据，在无真实指标时采用过程与方法论描述？
	•	英文版是否 自然、口语、地道，而非机械翻译？
	•	Frontmatter 是否 完整，slug 与文件名是否规范？

⸻

禁忌
	•	不要写“作为AI/模型/助手”。
	•	不要提供没有依据的具体数值指标。
	•	不要泄露内部私钥、仓库地址、敏感信息。
	•	不要只给提纲或示例段落，必须输出完整可发布的两篇文章。

⸻

参考占位（可用可删）
	•	截图占位写法：![对比截图：迁移前后导航图标展示](/images/icon-std-before-after.png)
	•	表格占位写法（对比维度举例）：

维度	迁移前	迁移后	变化
图标尺寸	16/18/20 混用	统一 size-5	认知负担下降
引入方式	内联 SVG + 零散库	统一 Icon 组件	可维护性↑
主题适配	局部覆盖	语义色 + 令牌	一致性↑



⸻

现在开始生成：
直接输出两段 MDX 内容（中文 / 英文），各自独立、完整可发布，满足以上所有约束。并把文档放在content/posts这个文件夹里面。