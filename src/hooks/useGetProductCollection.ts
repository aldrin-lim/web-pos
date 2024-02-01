import { useQuery } from '@tanstack/react-query'
import * as API from 'api/productCollection'

const useGetProductCollection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['productCollection', 'default'],
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
