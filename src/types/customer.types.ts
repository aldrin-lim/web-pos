import { z } from 'zod'

export const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
  email: z.string().optional(),
  contact: z.string().optional(),
})

export type Customer = z.infer<typeof customerSchema>
