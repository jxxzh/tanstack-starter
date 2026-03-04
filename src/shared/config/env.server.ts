import { z } from 'zod'

const serverEnvSchema = z.object({
  VITE_APP_ENV: z.enum(['development', 'production', 'test']),
  VITE_FEISHU_APP_ID: z.string(),
  SESSION_SECRET: z.string(),
  FEISHU_APP_SECRET: z.string(),
})

type ServerEnv = z.infer<typeof serverEnvSchema>

let cachedServerEnv: ServerEnv | undefined

export const getServerEnv = () => {
  if (!cachedServerEnv) {
    cachedServerEnv = serverEnvSchema.parse(process.env)
  }

  return cachedServerEnv
}
