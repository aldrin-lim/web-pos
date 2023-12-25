import { useQuery } from '@tanstack/react-query'
import { GetAllProductFilterSchema } from 'api/product/getAllProducts'
import { PaginationOptions } from 'types/api.types'
import * as API from 'api/product'

const useAllProducts = (
  bussinessId?: string,
  param?: PaginationOptions & GetAllProductFilterSchema,
) => {
  const {
    data,
    isFetching: isLoading,
    error,
  } = useQuery({
    queryKey: ['products', bussinessId, param],
    queryFn: () => API.getAllProducts(param),
    retry: 0,
    enabled: Boolean(bussinessId),
    refetchOnWindowFocus: false,
  })

  return {
    products: data || [],
    error,
    isLoading,
  }
}

export default useAllProducts
