import type { HTMLAttributes } from 'react'

import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
 'inline-flex items-center border px-2.5 py-1 text-xs font-medium uppercase tracking-wide transition-colors',
 {
  variants: {
   variant: {
    default: 'border-transparent bg-secondary text-secondary-foreground',
    outline: 'border-border text-foreground',
    muted: 'border-transparent bg-muted text-muted-foreground',
   },
  },
  defaultVariants: {
   variant: 'default',
  },
 },
)

export interface BadgeProps
 extends HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
 return (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
 )
}
