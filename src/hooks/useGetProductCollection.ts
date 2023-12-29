import { useQuery } from '@tanstack/react-query'
import * as API from 'api/productCollection'

const useGetProductCollection = (productId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['productCollection', productId ?? 'default'],
    queryFn: () => API.getDefaultProductCollection(),
    retry: 0,
    refetchOnWindowFocus: false,
  })

  return {
    productCollection: data,
    error,
    isLoading,
  }
}

export default useGetProductCollection
