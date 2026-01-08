import { openAlertDialog } from '@/features/alert/alert-dialog-helper'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog'
import { Button } from '@/shared/components/ui/button'

export function AlertDialogQuickOpen() {
  const handleOpen = () => {
    openAlertDialog({
      title: '删除条目？',
      description: '此操作不可撤销，请确认是否继续。',
      confirmText: '删除',
      cancelText: '取消',
      confirmVariant: 'destructive',
      cancelVariant: 'outline',
      onCancel: async (close) => {
        await new Promise((resolve) => setTimeout(resolve, 1200))
        // 关闭弹窗
        close()
      },
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1200))
        // 不关闭弹窗
      },
    })
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="font-semibold text-xl">AlertDialog quickOpen 示例</h1>
      <p className="text-muted-foreground text-sm">
        通过静态 helper 快速打开一次性 AlertDialog，包含 async 确认与 loading。
      </p>
      <Button variant="outline" onClick={handleOpen}>
        openAlertDialog
      </Button>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="ghost" />}>
          Open Shadcn AlertDialog
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
