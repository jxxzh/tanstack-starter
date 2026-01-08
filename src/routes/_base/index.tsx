import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ThemeSwitch } from '@/features/theme/theme-switch'
import { ThemeToggle } from '@/features/theme/theme-toggle'
import { Button } from '@/shared/components/ui/button'
import { ConfigDrawer } from '@/widgets/layout/ui/config-drawer'
import { Header } from '@/widgets/layout/ui/header'
import { Main } from '@/widgets/layout/ui/main'
import { AlertDialogQuickOpen } from './-ui/alert-dialog-quick-open'
import { Counter } from './-ui/counter'
import { AppleHelloEnglishEffect } from './-ui/hello'

export const Route = createFileRoute('/_base/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <Header>
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
        </div>
      </Header>
      <Main fixed className="items-center justify-center gap-2">
        <ThemeToggle />
        Hello World
        <Counter />
        <div className="flex flex-col gap-4">
          <AppleHelloEnglishEffect />
        </div>
        <Button
          onClick={() =>
            toast('Hello', {
              description: 'This is a toast',
            })
          }
        >
          show toast
        </Button>
        <AlertDialogQuickOpen />
      </Main>
    </>
  )
}
