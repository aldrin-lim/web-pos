import { AxiosResponse } from 'axios'
import { Product, ProductSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (param: {
  id: string
  product: UpdateProductRequestScheam
}) => {
  const { id, product } = param
  const url = `/products/${id}`

  const result = await httpClient
    .patch<unknown, AxiosResponse<Product>>(url, product)
    .then((res) => res.data)
  return result || []
}

// Schema and Types
export const UpdateProductSchema = ProductSchema.pick({
  name: true,
  description: true,
  cost: true,
  profit: true,
  price: true,
  quantity: true,
  measurement: true,
  images: true,
  category: true,
  allowBackOrder: true,
  productType: true,
  expiryDate: true,
  variants: true,
})
  .partial()
  .extend({
    id: z.string(),
  })

export type UpdateProductRequestScheam = z.infer<typeof UpdateProductSchema>
