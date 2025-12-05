## Context
- AlertDialog 目前在 `src/shared/components/ui/alert-dialog.tsx`，组合成本较高。
- 需求：提供一次性静态 helper，放在共享 UI 目录之外，复用现有组件且不侵入原文件。

## Goals / Non-Goals
- Goals: 简单 API（标题必填，描述/取消可选，按钮 variant 默认，确认支持 async+loading），自动创建/销毁临时容器并返回 `close()`。
- Non-Goals: 扩展 AlertDialog 组件本身或改动 UI 目录；不引入全局状态管理。

## Decisions
- 放置路径：`src/shared/lib/alert-dialog-quick-open.tsx`，以 shared lib 形式对外导出，避免污染 ui 目录。
- 渲染方式：使用 `createRoot` + 临时 DOM 节点，内部受控 open 状态，关闭后清理 root 与节点。
- Loading 策略：仅确认按钮进入 loading/disabled，async 成功后关闭，失败保留弹窗并清除 loading。
- 可选取消：若未提供取消文案则不渲染取消按钮。
- 变体：确认/取消按钮分别支持 variant，默认 `default` / `outline`。

## Risks / Trade-offs
- 若调用方未处理 onConfirm 异常，仅 console 记录；可后续扩展错误提示。
- SSR 场景下直接调用将 no-op 返回 handle；需在客户端调用。

## Migration Plan
- 新增 helper 文件与示例路由，不改动现有 UI 组件。
- 保持 API 独立，后续可在 features/widgets 中复用。

## Open Questions
- 默认文案是否需要 i18n/可配置（当前使用中文“确认/取消”与默认变体）。

