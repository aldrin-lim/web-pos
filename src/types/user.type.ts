import { z } from 'zod'
import { Business, BusinessSchema } from './business.type'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  businesses: Array<Business>
}

export const UserSchema = z.object({
  id: z.string({
    required_error: 'ID is required',
  }),
  firstName: z.string({
    required_error: 'First name is required',
  }),
  lastName: z.string({
    required_error: 'Last name is required',
  }),
  email: z.string({
    required_error: 'Email is required',
  }),
  connection: z.string({
    required_error: 'Connection is required',
  }),
  role: z.array(z.string()).default(['admin']),
  businesses: z.array(BusinessSchema),
})
