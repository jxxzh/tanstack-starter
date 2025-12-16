# Project Context

## Purpose
基于 TanStack Start 的全栈 React 模板工程，提供开箱可用的路由、数据获取、UI 组件与 FSD 分层约定，帮助快速搭建可维护、可扩展的前后端同构应用。

## Tech Stack
- 基础：TypeScript（strict）+ React 19 + Vite 7
- 全栈框架：Tanstack Start
- 数据与网络：TanStack Query/TanStack DB、ofetch
- UI：Tailwind CSS v4，Shadcn UI（基于 Base UI）、tabler-icons、class-variance-authority、motion
- 状态与数据：Jotai、Zod、ofetch
- 工具链：pnpm、Biome（format/lint）

## Project Conventions

### Code Style
- 统一使用 Biome（`pnpm check` / `biome check --write`）格式化与 lint
- 函数式优先，组合优先，避免 prop drilling；组件/函数保持小而功能单一
- TypeScript strict 开启，禁止未使用变量/参数；路径统一使用别名 `@/*`
- UI 组件优先选择 Shadcn UI 组件，class-variance-authority 定义变体  
- 自定义UI组件时注意业务逻辑与样式分离，遵循 shadcn 组件开发最佳实践
- 优先局部状态（hooks/Jotai）与无副作用的纯函数

### Architecture Patterns
- 采用 FSD 分层：shared → entities → features → widgets → routes → app，单向依赖仅指向更底层
- 按Slice（业务域）+ Segment（ui/api/model/lib/config）组织代码，避免跨层耦合；底层共享逻辑放在 `src/shared/`
- 路由与页面使用 TanStack Router/Start，根据需要选择SSR、CSR、SSG等模式
- 样式以 Tailwind v4 为主，基础样式位于 `src/app/styles/`

### Testing Strategy
本项目暂不进行单元测试，后续根据需要逐步引入。

### Git Workflow
- 建议 feature 分支自 `main` 创建，提交遵循 Conventional Commits（如 feat/fix/chore）
- 变更说明保持与 FSD 分层一致，引用相关文件路径或 capability
- 手动合并 PR，避免自动合并

## Domain Context
当前为通用 TanStack Start + Shadcn UI 的前端/同构模板项目，尚无特定业务域；新增业务请按 FSD 切片落位并补充对应 specs。

## Important Constraints
- 包管理器固定使用 pnpm；新依赖需审慎评估（体积/维护度/兼容性）
- 遵守 FSD 单向依赖；禁止上行引用或跨切片耦合
- 代码需通过 Biome 校验；保留 TypeScript strict 设置
- 优先使用现有 Shadcn UI 组件与 Tailwind v4；避免引入与之冲突的样式方案
- SSR/同构场景下注意仅在客户端使用的 API（如 window）需保护或封装

## External Dependencies

