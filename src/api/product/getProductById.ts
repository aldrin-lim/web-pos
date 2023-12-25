import { AxiosResponse } from 'axios'
import { Product } from 'types/product.types'
import { httpClient } from 'util/http'

export default async (id: string) => {
  const url = `/products/${id}`

  const result = await httpClient
    .get<unknown, AxiosResponse<Product>>(url)
    .then((res) => res.data)
  return result || []
}
