import type {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from 'react'

type HeadingProps = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
type ParagraphProps = DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
type ListProps = DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>
type OrderedListProps = DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>
type ListItemProps = DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>
type BlockquoteProps = DetailedHTMLProps<HTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>
type CodeProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
type AnchorProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
type PreProps = DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>
type TableProps = DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>
type ThProps = DetailedHTMLProps<ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>
type TdProps = DetailedHTMLProps<TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>

export const mdxComponents = {
  h1: (props: HeadingProps) => (
    <h1 className="mt-12 scroll-m-20 text-4xl font-bold tracking-tight first:mt-0" {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2
      className="border-border/80 mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
      {...props}
    />
  ),
  h3: (props: HeadingProps) => (
    <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight" {...props} />
  ),
  a: (props: AnchorProps) => (
    <a
      className="text-primary cursor-pointer font-medium underline-offset-4 transition hover:underline"
      {...props}
    />
  ),
  p: (props: ParagraphProps) => <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />,
  ul: (props: ListProps) => <ul className="my-6 ml-6 list-disc space-y-2" {...props} />,
  ol: (props: OrderedListProps) => <ol className="my-6 ml-6 list-decimal space-y-2" {...props} />,
  li: (props: ListItemProps) => <li className="leading-7" {...props} />,
  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="border-primary/60 text-muted-foreground mt-6 border-l-4 pl-6 italic"
      {...props}
    />
  ),
  code: (props: CodeProps) => (
    <code className="bg-muted relative px-[0.3rem] py-[0.2rem] font-mono text-sm" {...props} />
  ),
  pre: ({ children, ...props }: PreProps) => (
    <pre className="bg-muted mt-6 overflow-x-auto border px-4 py-5" {...props}>
      {children}
    </pre>
  ),
  table: (props: TableProps) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full border-collapse text-left" {...props} />
    </div>
  ),
  th: (props: ThProps) => (
    <th className="border-border border-b px-4 py-2 font-semibold" {...props} />
  ),
  td: (props: TdProps) => <td className="border-border border-b px-4 py-2" {...props} />,
}

export type MDXCustomComponents = typeof mdxComponents
