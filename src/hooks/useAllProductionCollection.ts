import { useQuery } from '@tanstack/react-query'
import * as API from 'api/productCollection'

const useAllProductionCollection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['productCollections'],
    queryFn: () => API.getAllProductCollection(),
    retry: 0,
    refetchOnWindowFocus: false,
  })

  return {
    productCollections: data ?? [],
    error,
    isLoading,
  }
}

export default useAllProductionCollection
