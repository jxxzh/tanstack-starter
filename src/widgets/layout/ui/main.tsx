import { cn } from '@/shared/lib/utils'

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Main({ fixed, className, ...props }: MainProps) {
  return (
    <main
      data-layout={fixed ? 'fixed' : 'auto'}
      className={cn(
        'container flex flex-col px-4 py-6',

        // If layout is fixed, make the main container flex and grow
        fixed && 'grow overflow-hidden',
        className,
      )}
      {...props}
    />
  )
}
