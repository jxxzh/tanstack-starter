import * as lark from '@larksuiteoapi/node-sdk'
import { createFileRoute } from '@tanstack/react-router'
import {
  clearSession,
  getSession,
  type SessionConfig,
  updateSession,
} from '@tanstack/react-start/server'
import { z } from 'zod'
import { getServerEnv } from '@/shared/config/env.server'

const feishuSessionDataSchema = z.object({
  openId: z.string().optional(),
  userId: z.string().optional(),
  unionId: z.string().optional(),
  name: z.string().optional(),
  enName: z.string().optional(),
  avatarUrl: z.url().optional(),
  email: z.email().optional(),
  source: z.literal('feishu').optional(),
  loggedInAt: z.number().optional(),
})

type FeishuSessionData = z.infer<typeof feishuSessionDataSchema>

const codePayloadSchema = z.object({
  code: z.string().trim().min(1),
})

type FeishuTokenResponse = {
  code?: number
  msg?: string
  access_token?: string
  data?: {
    access_token?: string
  }
}

type FeishuUserResponse = {
  code?: number
  msg?: string
  data?: {
    open_id?: string
    user_id?: string
    union_id?: string
    name?: string
    en_name?: string
    avatar_url?: string
    email?: string
  }
}

let feishuClient: lark.Client | null = null

function getSessionConfig() {
  const serverEnv = getServerEnv()
  const secret = serverEnv.SESSION_SECRET
  if (!secret) {
    return null
  }

  const config: SessionConfig = {
    name: 'feishu-session',
    password: secret,
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: getServerEnv().VITE_APP_ENV === 'production',
    },
  }

  return config
}

function getFeishuCredentials() {
  const serverEnv = getServerEnv()
  const appId = serverEnv.VITE_FEISHU_APP_ID
  const appSecret = serverEnv.FEISHU_APP_SECRET

  if (!appId || !appSecret) {
    return null
  }

  return { appId, appSecret }
}

function getFeishuClient() {
  const credentials = getFeishuCredentials()
  if (!credentials) {
    return null
  }

  if (feishuClient) {
    return feishuClient
  }

  feishuClient = new lark.Client({
    appId: credentials.appId,
    appSecret: credentials.appSecret,
    appType: lark.AppType.SelfBuild,
    domain: lark.Domain.Feishu,
  })

  return feishuClient
}

async function exchangeCodeForAccessToken(code: string) {
  const client = getFeishuClient()
  if (!client) {
    return null
  }

  const payload = (await client.authen.v1.accessToken.create({
    data: {
      grant_type: 'authorization_code',
      code,
    },
  })) as FeishuTokenResponse | null

  if (!payload || payload.code !== 0) {
    return null
  }

  const accessToken = payload.access_token ?? payload.data?.access_token
  if (!accessToken) {
    return null
  }

  return accessToken
}

async function fetchFeishuUser(accessToken: string) {
  const client = getFeishuClient()
  if (!client) {
    return null
  }

  const payload = (await client.authen.v1.userInfo.get(
    {},
    lark.withUserAccessToken(accessToken),
  )) as FeishuUserResponse | null

  if (!payload || payload.code !== 0 || !payload.data) {
    return null
  }

  const validated = feishuSessionDataSchema.safeParse({
    openId: payload.data.open_id,
    userId: payload.data.user_id,
    unionId: payload.data.union_id,
    name: payload.data.name,
    enName: payload.data.en_name,
    avatarUrl: payload.data.avatar_url,
    email: payload.data.email,
    source: 'feishu',
    loggedInAt: Date.now(),
  })

  if (!validated.success) {
    return null
  }

  return validated.data
}

export const Route = createFileRoute('/api/auth/feishu/session')({
  server: {
    handlers: {
      GET: async () => {
        const sessionConfig = getSessionConfig()

        if (!sessionConfig) {
          return Response.json(
            {
              authenticated: false,
              message: 'Missing SESSION_SECRET in production',
            },
            { status: 500 },
          )
        }

        const session = await getSession<FeishuSessionData>(sessionConfig)
        const hasSession = Boolean(session.data.userId || session.data.openId)

        return Response.json({
          authenticated: hasSession,
          user: hasSession ? session.data : null,
        })
      },
      POST: async ({ request }) => {
        const credentials = getFeishuCredentials()
        if (!credentials) {
          return Response.json(
            {
              message:
                'Missing FEISHU_APP_ID (or VITE_FEISHU_APP_ID) or FEISHU_APP_SECRET',
            },
            { status: 500 },
          )
        }

        const sessionConfig = getSessionConfig()
        if (!sessionConfig) {
          return Response.json(
            { message: 'Missing SESSION_SECRET in production' },
            { status: 500 },
          )
        }

        const body = (await request.json().catch(() => null)) as unknown
        const parsed = codePayloadSchema.safeParse(body)

        if (!parsed.success) {
          return Response.json(
            { message: 'Invalid request payload' },
            { status: 400 },
          )
        }

        const accessToken = await exchangeCodeForAccessToken(parsed.data.code)
        if (!accessToken) {
          return Response.json(
            { message: 'Failed to exchange code' },
            { status: 401 },
          )
        }

        const userData = await fetchFeishuUser(accessToken)
        if (!userData) {
          return Response.json(
            { message: 'Failed to fetch Feishu user' },
            { status: 401 },
          )
        }

        const session = await updateSession<FeishuSessionData>(
          sessionConfig,
          userData,
        )

        return Response.json({ authenticated: true, user: session.data })
      },
      DELETE: async () => {
        const sessionConfig = getSessionConfig()

        if (!sessionConfig) {
          return Response.json(
            { message: 'Missing SESSION_SECRET in production' },
            { status: 500 },
          )
        }

        await clearSession(sessionConfig)

        return Response.json({ authenticated: false })
      },
    },
  },
})
