import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { getUser } from 'api/users.api'

const useUser = () => {
  const { user, isAuthenticated } = useAuth0()

  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(user?.email ?? ''),
    enabled: isAuthenticated,
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
