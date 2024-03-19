import { useQuery } from '@tanstack/react-query'
import * as API from 'api/shift'

const useGetTodayShift = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['shift', 'today'],
    queryFn: API.getTodayShift,
    retry: 0,
    refetchOnWindowFocus: true,
  })

  return {
    shift: data,
    error,
    isLoading,
  }
}

export default useGetTodayShift
