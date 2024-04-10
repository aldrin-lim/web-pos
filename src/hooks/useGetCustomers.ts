import { useQuery } from '@tanstack/react-query'
import { httpClient } from 'util/http'
import { AxiosResponse } from 'axios'
import { Customer } from 'types/customer.types'

const useGetCustomers = (name: string = '', orders = false) => {
  const {
    data,
    isFetching: isLoading,
    error,
  } = useQuery({
    queryKey: ['customers', name, orders],
    queryFn: async () => {
      const query = {} as Record<string, string>

      if (name) {
        query.searchQuery = name
      }

      if (orders) {
        query.orders = orders.toString()
      }

      const url = `/customers${`?${new URLSearchParams(query).toString()}`}`
      const result = await httpClient
        .get<unknown, AxiosResponse<Customer[]>>(url)
        .then((res) => res.data)
      return result
    },
    retry: 0,
    refetchOnWindowFocus: false,
    enabled: !!name,
  })

  return {
    customers: data,
    error,
    isLoading,
  }
}

export default useGetCustomers
