# Project Context

## 目标
基于 TanStack Start 的全栈 React 模板工程，提供开箱可用的路由、数据获取、UI 组件与 FSD 分层约定，帮助快速搭建可维护、可扩展的前后端同构应用。

## Tech Stack
- 语言：TypeScript（strict）
- 包管理器：pnpm
- 代码格式：Biome
- 打包工具：Vite 7
- UI框架： React 19
- 全栈框架：TanStack Start
- UI
  - CSS style: Tailwind CSS v4
  - 基础组件：Shadcn UI（基于 Base UI）
  - 图标：tabler-icons
  - 样式组合：class-variance-authority, clsx
  - 动画：motion
- 格式验证：Zod
- 数据同步：TanStack Query，TanStack DB
- 数据请求：ofetch
- 客户端状态管理：Jotai
- 日志：consola

## Project Conventions

### 代码风格
- 统一使用 Biome（`pnpm check` / `biome check --write`）格式化与 lint
- 函数式优先，组合优先，避免 prop drilling
- 组件/函数保持小而功能单一
- UI 组件开发
  - 优先组合胜过继承：构建可组合和嵌套的组件来创建更复杂的 UI，而不是依赖深层的类层次结构。
  - 优先使用 shadcn 的已有组件，非必需不重复构建基础组件

### Architecture Patterns

```
├── src/
│   ├── app/              # app entrypoint & config
│   ├── routes/           # tanstack start router + server routes
│   ├── widgets/          # large self-sufficient blocks of UI
│   ├── features/         # interacting that users care to do
│   ├── entities/         # concepts from the real world
│   └── shared/           # foundation code for the project
```


- 前端端按影响范围分层：shared → entities → features → widgets → routes → app
- 按Slice（业务域）+ Segment（ui/api/model/lib/config）组织代码，避免跨层耦合；底层共享逻辑放在 `src/shared/`
