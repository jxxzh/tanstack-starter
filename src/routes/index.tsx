import { Button } from '@/shared/components/ui/button'
import { toastManager } from '@/shared/components/ui/toast'
import { createFileRoute } from '@tanstack/react-router'
import { Counter } from './-ui/counter'
import { AppleHelloEnglishEffect } from './-ui/hello'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="text-center">
      <main className="min-h-screen flex flex-col items-center justify-center gap-5">
        Hello World
        <Counter />
        <div className="flex flex-col gap-4">
          <AppleHelloEnglishEffect />
        </div>
        <Button
          onClick={() =>
            toastManager.add({
              title: 'Hello',
              description: 'This is a toast',
            })
          }
        >
          show toast
        </Button>
      </main>
    </div>
  )
}
