import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

// Import the generated route tree
import { routeTree } from '@/routeTree.gen'
import { queryClient } from '@/shared/api/query-client'
import { Spinner } from '@/shared/components/ui/spinner'

// Create a new router instance
export const getRouter = () => {
  const router = createTanstackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      )
    },
    defaultNotFoundComponent: () => <p>Not Found</p>,
    defaultPendingComponent: () => (
      <div className="flex h-dvh w-dvw items-center justify-center">
        <Spinner className="size-12" />
      </div>
    ),
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}
