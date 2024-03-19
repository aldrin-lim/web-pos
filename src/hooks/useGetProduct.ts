import { useQuery } from '@tanstack/react-query'
import * as API from 'api/product'

const useGetProduct = (productId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => API.getProductById(productId as string),
    retry: 0,
    enabled: Boolean(productId),
    refetchOnWindowFocus: true,
  })

  return {
    product: data,
    error,
    isLoading,
  }
}

export default useGetProduct
