import { z } from 'zod'

import { ProductSchema } from './product.types'

export const ProductCollectionSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  products: z.array(ProductSchema),
})

export type ProductCollection = z.infer<typeof ProductCollectionSchema>
