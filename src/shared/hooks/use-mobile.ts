import { useBreakpointInfo } from './use-breakpoint'

export function useIsMobile(): boolean {
  const { info } = useBreakpointInfo()
  return !info.md
}
