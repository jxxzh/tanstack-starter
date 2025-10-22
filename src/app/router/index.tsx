import { queryClient } from '@/shared/api/query-client'
import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

// Import the generated route tree
import { routeTree } from '@/routeTree.gen'
import { QueryClientProvider } from '@tanstack/react-query'

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
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}
