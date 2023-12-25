import { AxiosResponse } from 'axios'
import { Product, ProductSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (param: AddProductSchema) => {
  const result = await httpClient
    .post<AddProductSchema, AxiosResponse<Product>>(`/products`, param)
    .then((res) => res.data)
  return result
}

// Schema and Types
type AddProductSchema = z.infer<typeof AddProductSchema>

export const AddProductSchema = ProductSchema.pick({
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
