import { AxiosResponse } from 'axios'
import { Product } from 'types/product.types'
import { httpClient } from 'util/http'

export default async (param: { id: string }) => {
  const { id } = param
  const url = `/products/${id}`

  const result = await httpClient
    .delete<unknown, AxiosResponse<Product>>(url)
    .then((res) => res.data)
  return result || []
}
