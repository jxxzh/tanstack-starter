import { z } from 'zod'

const serverEnvSchema = z.object({
})

type ServerEnv = z.infer<typeof serverEnvSchema>

let cachedServerEnv: ServerEnv | undefined

export const getServerEnv = () => {
  if (!cachedServerEnv) {
    cachedServerEnv = serverEnvSchema.parse(process.env)
  }

  return cachedServerEnv
}
