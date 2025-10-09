import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
 ({ className, type = 'text', ...props }, ref) => {
  return (
   <input
    ref={ref}
    type={type}
    className={cn(
     'flex h-11 w-full border border-input bg-background px-4 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
     className,
    )}
    {...props}
   />
  )
 },
)

Input.displayName = 'Input'
