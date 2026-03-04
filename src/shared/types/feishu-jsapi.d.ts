interface FeishuAuthSuccessResult {
  code: string
}

interface FeishuAuthErrorResult {
  errno?: number
  errMsg?: string
  errString?: string
}

interface FeishuRequestAccessOptions {
  appID: string
  appId?: string
  scopeList: string[]
  state?: string
  success: (result: FeishuAuthSuccessResult) => void
  fail: (error: FeishuAuthErrorResult) => void
}

interface FeishuRequestAuthCodeOptions {
  appId: string
  success: (result: FeishuAuthSuccessResult) => void
  fail: (error: FeishuAuthErrorResult) => void
}

interface FeishuJsSdk {
  requestAccess?: (options: FeishuRequestAccessOptions) => void
  requestAuthCode?: (options: FeishuRequestAuthCodeOptions) => void
}

interface FeishuH5Sdk {
  ready: (callback: () => void) => void
}

declare global {
  interface Window {
    tt?: FeishuJsSdk
    h5sdk?: FeishuH5Sdk
  }
}

export {}
