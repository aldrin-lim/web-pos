import { z } from 'zod'
import { ProductSchema } from './product.types'

export const MaterialSchema = z.object({
  id: z.string().optional(),
  quantity: z.number({
    required_error: 'Quantity is required',
  }),
  product: ProductSchema,
  cost: z.number({ required_error: 'Cost is required' }),
  measurement: z
    .string({
      required_error: 'Measurement is required',
    })
    .min(1),
})
export type Material = z.infer<typeof MaterialSchema>

export const RecipeSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: 'recipe name is required',
    invalid_type_error: 'recipe name is must be a string',
  }),
  quantity: z.number({
    required_error: 'Quantity is required',
  }),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  measurement: z.string(),
  cost: z.number(),
  materials: z
    .array(MaterialSchema)
    .min(1, 'Materials must have at least 1 item'),
})

export type Recipe = z.infer<typeof RecipeSchema>
