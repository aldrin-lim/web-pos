import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Report } from 'types/report.types'
import { httpClient } from 'util/http'

const useGetShiftReport = (shiftId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['shiftReport', shiftId],
    queryFn: async () => {
      const url = `/shifts/${shiftId}/report`

      const result = await httpClient
        .get<unknown, AxiosResponse<Report>>(url)
        .then((res) => res.data)
      return result
    },
    retry: 0,
    refetchOnWindowFocus: true,
    enabled: !!shiftId,
  })

  return {
    report: data,
    error,
    isLoading,
  }
}

export default useGetShiftReport
