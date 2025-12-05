## 1. Implementation
- [x] 1.1 设计静态入口（如 `AlertDialog.quickOpen`）的 API：标题必填；描述可选；确认/取消文案（取消可选）；按钮变体含默认值；确认回调支持 async 并暴露 loading 态。
- [x] 1.2 在共享 UI 目录外单独文件实现 helper：创建临时容器、渲染 AlertDialog、返回 `close()`；确认/取消/编程关闭后卸载并清理监听。
- [x] 1.3 实现确认按钮 loading 管理：await 回调，处理中禁用交互，成功后关闭并清理，失败时保留弹窗（可用于错误提示拓展）。
- [x] 1.4 补充示例或文档（demo/Storybook/route 示例），说明用法、可选项、默认值与限制。
- [x] 1.4 运行 `pnpm check`。
- [x] 1.5 运行 `openspec validate add-alert-dialog-static-open --strict`。

