import { createFileRoute } from '@tanstack/react-router'
import { Counter } from './-ui/counter'
import { AppleHelloEnglishEffect } from './-ui/hello'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="text-center">
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        Hello World
        <Counter />
        <div className="flex flex-col gap-4">
          <AppleHelloEnglishEffect />
        </div>
      </main>
    </div>
  )
}
