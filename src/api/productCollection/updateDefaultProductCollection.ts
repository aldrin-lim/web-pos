import { AxiosResponse } from 'axios'
import { ProductSchema } from 'types/product.types'
import {
  ProductCollection,
  ProductCollectionSchema,
} from 'types/productCollection.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (param: z.infer<typeof UpdateProductCollectionSchema>) => {
  const url = `/product-collections/default`
  const result = await httpClient
    .patch<unknown, AxiosResponse<ProductCollection>>(url, param)
    .then((res) => res.data)
  return result || []
}

export const UpdateProductCollectionSchema = ProductCollectionSchema.omit({
  id: true,
})
  .partial({ name: true, description: true })
  .extend({
    products: z.array(ProductSchema.pick({ id: true })),
  })
