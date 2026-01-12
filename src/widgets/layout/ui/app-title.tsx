import { Link } from '@tanstack/react-router'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/ui/sidebar'
import { clientEnv } from '@/shared/config/client-env'

export function AppTitle() {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="gap-0 py-0 hover:bg-transparent active:bg-transparent"
          render={(props) => (
            <div {...props}>
              <Link
                to="/"
                onClick={() => setOpenMobile(false)}
                className="grid flex-1 text-start text-sm leading-tight"
              >
                <span className="truncate font-bold">
                  {clientEnv.VITE_APP_NAME}
                </span>
              </Link>
            </div>
          )}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
