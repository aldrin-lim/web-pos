import { z } from 'zod'
import { BusinessSchema } from './business.type'
import { UserSchema } from './user.type'

export const ShiftSchema = z.object({
  id: z.string(),
  name: z.string(),
  notes: z.string(),
  image: z.string().optional(),
  openingPettyCash: z.number(),
  closingPettyCash: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.string(),
  business: BusinessSchema,
  openedBy: UserSchema.optional(),
  closedBy: UserSchema.optional(),
  deletedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Shift = z.infer<typeof ShiftSchema>
