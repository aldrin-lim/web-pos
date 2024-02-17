import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { OrderSchema, SaleSchema } from 'types/report.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

const GetOrderSchema = OrderSchema.extend({
  sale: SaleSchema.omit({ order: true }),
})

const useGetOrder = (orderId?: string, shiftId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const url = `/orders/${orderId}/?shiftId=${encodeURIComponent(
        shiftId ?? '',
      )}`

      const result = await httpClient
        .get<unknown, AxiosResponse<z.infer<typeof GetOrderSchema>>>(url)
        .then((res) => res.data)
      return result
    },
    retry: 0,
    refetchOnWindowFocus: false,
    enabled: !!shiftId && !!orderId,
  })

  return {
    order: data,
    error,
    isLoading,
  }
}

export default useGetOrder
