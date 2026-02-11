import { atomWithStorage } from 'jotai/utils'
import type { Sidebar } from '@/shared/components/ui/sidebar'
import { createCookieStorage } from '@/shared/lib/jotai-utils'

type SidebarProps = Parameters<typeof Sidebar>[0]

export type LayoutAtomState = Required<
  Pick<SidebarProps, 'collapsible' | 'variant'>
>

export const defaultLayoutAtomState: LayoutAtomState = {
  collapsible: 'icon',
  variant: 'inset',
}

export const layoutAtom = atomWithStorage<LayoutAtomState>(
  'layout',
  defaultLayoutAtomState,
  createCookieStorage<LayoutAtomState>(),
  {
    getOnInit: true,
  },
)

export const sidebarOpenAtom = atomWithStorage<boolean>(
  'sidebar_open',
  true,
  createCookieStorage<boolean>(),
  {
    getOnInit: true,
  },
)
