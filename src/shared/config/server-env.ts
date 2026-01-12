import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
})

// Validate server environment
export const serverEnv = envSchema.parse(process.env)
