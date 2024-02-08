import { AxiosResponse } from 'axios'
import { Shift } from 'types/shift.types'
import { httpClient } from 'util/http'

export default async () => {
  const url = `/shifts/today`

  const result = await httpClient
    .get<unknown, AxiosResponse<Shift>>(url)
    .then((res) => res.data)
  return result
}
