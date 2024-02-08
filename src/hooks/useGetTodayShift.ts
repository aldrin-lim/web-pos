import { useQuery } from '@tanstack/react-query'
import * as API from 'api/shift'

const useGetShift = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['shift', 'today'],
    queryFn: API.getTodayShift,
    retry: 0,
    refetchOnWindowFocus: false,
  })

  return {
    shift: data,
    error,
    isLoading,
  }
}

export default useGetShift
