import { IconHome } from '@tabler/icons-react'
import type { SidebarConfig } from './types'

export const sidebarConfig: SidebarConfig = {
  user: {
    name: 'jxxzh',
    email: 'jxxzh@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: '首页',
          url: '/',
          icon: IconHome,
        },
      ],
    },
  ],
}
