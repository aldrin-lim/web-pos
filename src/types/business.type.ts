import { z } from 'zod'

export const BusinessSchema = z.object({
  id: z
    .string({
      required_error: 'ID is required',
    })
    .min(1),
  name: z.string({
    required_error: 'Name is required',
  }),
  description: z
    .string({
      required_error: 'Description is required',
    })
    .default(''),
  address: z.string().optional(),
  contactNumber: z.string().optional(),
  openingTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid 24-hour format time'),
  closingTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid 24-hour format time'),
  voidPin: z
    .string({
      required_error: 'PIN is required',
    })
    .length(6, 'PIN must be 6 characters long'),
  tax: z
    .object({
      amount: z
        .number({
          coerce: true,
          required_error: 'Tax amount is required',
          invalid_type_error: 'Tax amount must be greater than 0',
        })
        .positive('Tax amount must be greater than 0'),
      type: z.enum(['inclusive', 'exclusive'], {
        required_error: 'Tax type is required',
      }),
    })
    .nullable()
    .optional(),
})

export const UpdateUserBusinessSchema = BusinessSchema.pick({
  id: true,
  name: true,
  description: true,
  address: true,
  contactNumber: true,
  openingTime: true,
  closingTime: true,
  voidPin: true,
  tax: true,
})

export type UpdateUserBusinessSchema = z.infer<typeof UpdateUserBusinessSchema>

export type Business = z.infer<typeof BusinessSchema>
