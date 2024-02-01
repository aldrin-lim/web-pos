import { AxiosResponse } from 'axios'
import { ProductSchema } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async () => {
  const url = '/products'

  const result = await httpClient
    .get<unknown, AxiosResponse<Array<GetAllProductSchema>>>(url)
    .then((res) => res.data)
  return result
}

// Schema and Types
export type GetAllProductSchema = z.infer<typeof ProductSchema>
