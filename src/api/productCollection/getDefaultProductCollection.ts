import { AxiosResponse } from 'axios'
import { ProductCollection } from 'types/productCollection.types'
import { httpClient } from 'util/http'

export default async () => {
  const url = `/product-collections/default`

  const result = await httpClient
    .get<unknown, AxiosResponse<ProductCollection>>(url)
    .then((res) => res.data)
  return result
}
