# Project Context


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
  - 当前项目已集成 React Compiler， 非必要不做额外优化，如 "useCallback", "useMemo" 等

### Architecture Patterns

```
├── src/
│   ├── app/              # 应用层：应用入口和配置
│   ├── routes/           # 路由层：tanstack start router + server routes
│   ├── widgets/          # 挂件层：大型自包含的 UI 模块
│   ├── features/         # 业务层：用户关心的交互
│   ├── entities/         # 实体层：真实世界的概念
│   └── shared/           # 共享层：基础可复用代码
```


- 前端端按影响范围分层：shared → entities → features → widgets → routes → app
- 按Slice（业务域）+ Segment（ui/api/model/lib/config）组织代码，避免跨层耦合；底层共享逻辑放在 `src/shared/`


## Important Constraints

- '/src/shared/components/ui'文件夹存放的是Shadcn组件代码，如要调整样式，推荐通过"className"+"cn"的方式；如果确实要修改，请说明原因并获得允许

<!-- intent-skills:start -->
# Skill mappings — when working in these areas, load the linked skill file into context.
skills:
  - task: "做 TanStack DB / React DB 的集合、实时查询和数据同步"
    load: "/Users/huxichun/Documents/code/js/tanstack-start/node_modules/@tanstack/react-db/skills/react-db/SKILL.md"
  - task: "在 TanStack Start 路由里预加载 collection，处理 TanStack DB 的框架集成"
    load: "/Users/huxichun/Documents/code/js/tanstack-start/node_modules/.pnpm/@tanstack+react-db@0.1.76_react@19.2.4_typescript@5.9.3/node_modules/@tanstack/db/skills/meta-framework/SKILL.md"
  - task: "设计 TanStack DB 的 collection、adapter、查询模型和 optimistic mutation"
    load: "/Users/huxichun/Documents/code/js/tanstack-start/node_modules/.pnpm/@tanstack+react-db@0.1.76_react@19.2.4_typescript@5.9.3/node_modules/@tanstack/db/skills/db-core/SKILL.md"
  - task: "配置或排查 TanStack Devtools 和 Vite Devtools 插件"
    load: "/Users/huxichun/Documents/code/js/tanstack-start/node_modules/@tanstack/devtools-vite/skills/devtools-vite-plugin/SKILL.md"
  - task: "写 TanStack Start 的服务端接口、Nitro 服务逻辑和部署相关代码"
    load: "/Users/huxichun/Documents/code/js/tanstack-start/node_modules/nitro/skills/nitro/SKILL.md"
<!-- intent-skills:end -->
