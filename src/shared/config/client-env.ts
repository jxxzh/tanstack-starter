import { z } from 'zod'

const clientEnvSchema = z.object({
  VITE_APP_ENV: z.enum(['development', 'production', 'test']),
  VITE_APP_NAME: z.string(),
  VITE_API_URL: z.url().optional(),
})

// Validate client environment
export const clientEnv = clientEnvSchema.parse(import.meta.env)
