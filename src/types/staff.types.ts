import { z } from 'zod'

export const StaffSchema = z.object({
  id: z.string(),
  firstName: z.string({
    required_error: 'First name is required',
  }),
  lastName: z.string({
    required_error: 'Last name is required',
  }),
  username: z.string({
    required_error: 'Username is required',
  }),
  position: z.string({
    required_error: 'Position is required',
  }),
  image: z.string().optional(),
  shiftStart: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/,
      'Invalid 24-hour format time',
    ),
  shiftEnd: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/,
      'Invalid 24-hour format time',
    ),
})

export type Staff = z.infer<typeof StaffSchema>
