import { z } from 'zod'

export const paginationOptionsSchema = z.object({
  limit: z
    .number({
      invalid_type_error: 'Limit must be a number',
    })
    .positive()
    .optional(),
  page: z
    .number({
      invalid_type_error: 'Limit must be a number',
    })
    .positive()
    .optional(),
})

export type PaginationOptions = z.infer<typeof paginationOptionsSchema>
