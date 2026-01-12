import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const enableReactCompiler =
    env.VITE_REACT_COMPILER === 'true' || env.VITE_REACT_COMPILER === '1'

  return {
    plugins: [
      devtools(),
      nitro(),
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      tanstackStart({
        server: {
          entry: 'app/entrypoint/server.ts',
        },
        client: {
          entry: 'app/entrypoint/client.tsx',
        },
        router: {
          entry: 'app/router/index.tsx',
        },
      }),
      viteReact({
        babel: {
          plugins: enableReactCompiler
            ? [
                [
                  'babel-plugin-react-compiler',
                  {
                    target: '19',
                  },
                ],
              ]
            : [],
        },
      }),
    ],
  }
})
