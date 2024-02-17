import { useQuery } from '@tanstack/react-query'
import { getUser } from 'api/users.api'
import { useAuth } from 'contexts/AuthContext'

const useUser = () => {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(user?.email ?? ''),
    retry: 0,
    refetchOnWindowFocus: false,
  })

  return {
    user: data,
    error,
    isLoading,
  }
}

export default useUser
