import { useAtomValue } from 'jotai'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/shared/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { sidebarConfig } from '../config'
import { layoutAtom } from '../store'
import { AppTitle } from './app-title'
import { NavGroup } from './nav-group'

export function AppSidebar() {
  const { collapsible, variant } = useAtomValue(layoutAtom)
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        {sidebarConfig.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={sidebarConfig.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
