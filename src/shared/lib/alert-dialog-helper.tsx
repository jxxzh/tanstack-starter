'use client'

import { atom, useAtom } from 'jotai'
import { createStore } from 'jotai/vanilla'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'

import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { Button } from '@/shared/components/ui/button'
import { Spinner } from '@/shared/components/ui/spinner'
import { logger } from './logger'

type ButtonVariant = React.ComponentProps<typeof Button>['variant']

interface AlertDialogQuickOpenOptions {
  title: React.ReactNode
  description?: React.ReactNode
  confirmText?: React.ReactNode
  cancelText?: React.ReactNode
  confirmVariant?: ButtonVariant
  cancelVariant?: ButtonVariant
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
}

const store = createStore()

interface AlertDialogQuickOpenState {
  id: number
  options: AlertDialogQuickOpenOptions
}

const staticAlertDialogAtom = atom<AlertDialogQuickOpenState | null>(null)
let dialogId = 0

function StaticAlertDialog() {
  const [state, setState] = useAtom(staticAlertDialogAtom, { store })
  const current = state
  const options = current?.options

  const {
    title,
    description,
    confirmText = '确认',
    cancelText,
    confirmVariant = 'default',
    cancelVariant = 'outline',
    onConfirm,
    onCancel,
  } = options ?? {}

  const [isConfirmLoading, setIsConfirmLoading] = useState(false)
  const [isCancelLoading, setIsCancelLoading] = useState(false)

  const close = useCallback(() => {
    setState(null)
  }, [setState])

  const handleConfirm = useCallback(async () => {
    if (!onConfirm) {
      close()
      return
    }
    setIsConfirmLoading(true)
    try {
      await onConfirm()
      close()
    } finally {
      setIsConfirmLoading(false)
    }
  }, [close, onConfirm])

  const handleCancel = useCallback(async () => {
    setIsCancelLoading(true)
    try {
      if (onCancel) {
        await onCancel()
      }
      close()
    } finally {
      setIsCancelLoading(false)
    }
  }, [close, onCancel])

  const handleOpenChange = useCallback(
    (val: boolean) => {
      if (!val) {
        close()
      }
    },
    [close],
  )

  useEffect(() => {
    logger.info('StaticAlertDialog', { current })
  }, [current])

  const isLoading = isConfirmLoading || isCancelLoading

  return (
    <AlertDialog open={!!current} onOpenChange={handleOpenChange}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelText && (
            <Button
              variant={cancelVariant}
              disabled={isLoading}
              onClick={handleCancel}
            >
              {isCancelLoading && <Spinner className="size-4" />}
              {cancelText}
            </Button>
          )}
          <Button
            variant={confirmVariant}
            disabled={isLoading}
            onClick={handleConfirm}
          >
            {isConfirmLoading && <Spinner className="size-4" />}
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}

function openAlertDialog(options: AlertDialogQuickOpenOptions) {
  const id = ++dialogId
  store.set(staticAlertDialogAtom, { id, options })
}

function closeAlertDialog() {
  store.set(staticAlertDialogAtom, null)
}

export type { AlertDialogQuickOpenOptions }
export { StaticAlertDialog, openAlertDialog, closeAlertDialog }
