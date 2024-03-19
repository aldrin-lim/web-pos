import { useQuery } from '@tanstack/react-query'
import * as API from 'api/productCollection'

const useGetProductCollection = () => {
  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ['productCollection', 'default'],
    queryFn: () => API.getDefaultProductCollection(),
    retry: 0,
    refetchOnWindowFocus: true,
  })

  return {
    productCollection: data,
    error,
    isLoading: isFetching,
    refetch,
  }
}

export default useGetProductCollection
