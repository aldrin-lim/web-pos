import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { OrderSchema } from 'types/report.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

const useGetOrders = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      // const url = `/orders?limit=200&date=${encodeURIComponent(new Date().toISOString())}`
      const url = `/orders?limit=200`

      const result = await httpClient
        .get<unknown, AxiosResponse<z.infer<typeof OrderSchema>[]>>(url)
        .then((res) => res.data)
      return result
    },
    retry: 0,
    refetchOnWindowFocus: true,
  })

  return {
    orders: data,
    error,
    isLoading,
  }
}

export default useGetOrders
