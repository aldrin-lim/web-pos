import { useQuery } from '@tanstack/react-query'
import * as API from 'api/product'

// TODO: Add pagination options
const useAllProducts = () => {
  const {
    data,
    isFetching: isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => API.getAllProducts(),
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })

  return {
    products: data || [],
    error,
    isLoading,
  }
}

export default useAllProducts
