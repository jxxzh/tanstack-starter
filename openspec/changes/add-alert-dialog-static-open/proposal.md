# Change: Add static helper to quick open AlertDialog

## Why
组合 AlertDialog 需要多个原子组件，即便是一次性的确认弹窗也有较多样板。提供静态便捷入口可快速弹出临时对话框，减少使用成本。

## What Changes
- 新增静态 helper（如 `AlertDialog.quickOpen`），放置在共享 UI 以外的合适单独文件，直接生成一次性 AlertDialog。
- 支持标题、描述（可选）、确认/取消按钮文案（取消可选）、按钮变体（含默认值）、确认按钮 async 回调与 loading 态。
- helper 负责创建/销毁临时容器，返回可关闭句柄，确保关闭后清理节点与监听。
- 补充示例/文档，指明用法与限制。

## Impact
- Affected specs: ui-alert-dialog
- Affected code: 新增独立 helper 文件（位于共享 UI 目录外，如 `src/shared/lib/alert-dialog-helper.tsx`）及相关示例/文档，复用现有 AlertDialog 组件但不改动 `src/shared/components/ui`

