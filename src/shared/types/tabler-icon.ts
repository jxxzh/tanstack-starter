import type { IconProps } from '@tabler/icons-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

export type TablerIconWithRef = ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>
