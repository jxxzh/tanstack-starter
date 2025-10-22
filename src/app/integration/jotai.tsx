import { Provider } from 'jotai'
import { Suspense, lazy } from 'react'

// 动态导入 JotaiDevtools，只在开发环境加载
const Devtools = lazy(async () => {
  if (import.meta.env.DEV) {
    const { DevTools } = await import('jotai-devtools')
    await import('jotai-devtools/styles.css')
    return { default: DevTools }
  }
  // 生产环境返回空组件
  return { default: () => null }
})

export function JotaiProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <Suspense fallback={null}>
        <Devtools position='bottom-right'/>
      </Suspense>
      {children}
    </Provider>
  )
}
