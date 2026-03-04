import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // 默认开启 React Compiler，除非显式设置 VITE_REACT_COMPILER=false 或 0
  const enableReactCompiler =
    !env.VITE_REACT_COMPILER ||
    (env.VITE_REACT_COMPILER !== 'false' && env.VITE_REACT_COMPILER !== '0')

  return {
    plugins: [
      devtools(),
      nitro({
        rollupConfig: {
          onwarn(warning, warn) {
            const isClientDirectiveFromDependencies =
              warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
              warning.id?.includes('node_modules')

            if (isClientDirectiveFromDependencies) {
              return
            }

            warn(warning)
          },
        },
      }),
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
