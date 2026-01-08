import {
  IconDeviceDesktop,
  IconMoon,
  IconRotate2,
  IconSettings,
  IconSun,
} from '@tabler/icons-react'
import { useAtom } from 'jotai'
import { type Theme, useTheme } from '@/features/theme/provider'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'
import { useSidebar } from '@/shared/components/ui/sidebar'
import { cn } from '@/shared/lib/utils'
import type { TablerIconWithRef } from '@/shared/types/tabler-icon'
import {
  defaultLayoutAtomState,
  type LayoutAtomState,
  layoutAtom,
} from '../store'

export function ConfigDrawer() {
  const { setOpen } = useSidebar()
  const { setTheme } = useTheme()

  const handleReset = () => {
    setOpen(true)
    setTheme('system')
  }

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            size="icon"
            variant="ghost"
            aria-label="Open theme settings"
            aria-describedby="config-drawer-description"
            className="rounded-full"
          />
        }
      >
        <IconSettings aria-hidden="true" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="pb-0 text-start">
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription id="config-drawer-description">
            Adjust the appearance and layout to suit your preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 overflow-y-auto px-4">
          <ThemeConfig />
          <SidebarConfig />
          <LayoutConfig />
        </div>
        <SheetFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={handleReset}
            aria-label="Reset all settings to default values"
          >
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function SectionTitle({
  title,
  showReset = false,
  onReset,
  className,
}: {
  title: string
  showReset?: boolean
  onReset?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-2 flex items-center gap-2 font-semibold text-muted-foreground text-sm',
        className,
      )}
    >
      {title}
      {showReset && onReset && (
        <Button
          size="icon"
          variant="secondary"
          className="size-4 rounded-full"
          onClick={onReset}
        >
          <IconRotate2 className="size-3" />
        </Button>
      )}
    </div>
  )
}

const themeOptions: { value: Theme; label: string; icon: TablerIconWithRef }[] =
  [
    {
      value: 'system',
      label: 'System',
      icon: IconDeviceDesktop,
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: IconMoon,
    },
    {
      value: 'light',
      label: 'Light',
      icon: IconSun,
    },
  ]

function ThemeConfig() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <SectionTitle
        title="Theme"
        showReset={theme !== 'system'}
        onReset={() => setTheme('system')}
      />
      <RadioGroup
        value={theme}
        onValueChange={(value) => setTheme(value as Theme)}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select theme preference"
        aria-describedby="theme-description"
      >
        {themeOptions.map((item) => (
          <div key={item.value} className="flex items-center gap-2">
            <RadioGroupItem id={item.value} value={item.value} />
            <Label htmlFor={item.value}>{item.label}</Label>
            <item.icon className="size-4" />
          </div>
        ))}
      </RadioGroup>
      <div id="theme-description" className="sr-only">
        Choose between system preference, light mode, or dark mode
      </div>
    </div>
  )
}

const sidebarOptions: { value: LayoutAtomState['variant']; label: string }[] = [
  {
    value: 'inset',
    label: 'Inset',
  },
  {
    value: 'floating',
    label: 'Floating',
  },
  {
    value: 'sidebar',
    label: 'Sidebar',
  },
]

function SidebarConfig() {
  const [layoutUI, setLayoutUI] = useAtom(layoutAtom)
  return (
    <div className="max-md:hidden">
      <SectionTitle
        title="Sidebar"
        showReset={defaultLayoutAtomState.variant !== layoutUI.variant}
        onReset={() =>
          setLayoutUI((prev) => ({
            ...prev,
            variant: defaultLayoutAtomState.variant,
          }))
        }
      />
      <RadioGroup
        value={layoutUI.variant}
        onValueChange={(value) =>
          setLayoutUI((prev) => ({
            ...prev,
            variant: value as LayoutAtomState['variant'],
          }))
        }
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select sidebar style"
        aria-describedby="sidebar-description"
      >
        {sidebarOptions.map((item) => (
          <div key={item.value} className="flex items-center gap-2">
            <RadioGroupItem id={item.value} value={item.value} />
            <Label htmlFor={item.value}>{item.label}</Label>
          </div>
        ))}
      </RadioGroup>
      <div id="sidebar-description" className="sr-only">
        Choose between inset, floating, or standard sidebar layout
      </div>
    </div>
  )
}

const layoutOptions: {
  value: LayoutAtomState['collapsible']
  label: string
}[] = [
  {
    value: 'icon',
    label: 'Compact',
  },
  {
    value: 'offExamples',
    label: 'Full layout',
  },
]

function LayoutConfig() {
  const { setOpen } = useSidebar()
  const [layoutUI, setLayoutUI] = useAtom(layoutAtom)

  return (
    <div className="max-md:hidden">
      <SectionTitle title="Layout" />
      <RadioGroup
        value={layoutUI.collapsible}
        onValueChange={(value) => {
          setOpen(false)
          setLayoutUI((prev) => ({
            ...prev,
            collapsible: value as LayoutAtomState['collapsible'],
          }))
        }}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select layout style"
        aria-describedby="layout-description"
      >
        {layoutOptions.map((item) => (
          <div key={item.value} className="flex items-center gap-2">
            <RadioGroupItem id={item.value} value={item.value} />
            <Label htmlFor={item.value}>{item.label}</Label>
          </div>
        ))}
      </RadioGroup>
      <div id="layout-description" className="sr-only">
        Choose between default expanded, compact icon-only, or full layout mode
      </div>
    </div>
  )
}
