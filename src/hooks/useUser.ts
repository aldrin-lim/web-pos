import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { getUser } from 'api/users.api'
import { useEffect, useState } from 'react'

const useUser = () => {
  const { isLoading: isAuth0Loading, isAuthenticated, user } = useAuth0()
  const [email, setEmail] = useState<string>('')

  const {
    data,
    isFetching: isLoading,
    error,
  } = useQuery({
    queryKey: ['User', email],
    queryFn: async () => getUser(email),
    retry: 0,
    enabled: Boolean(email),
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!isAuth0Loading && isAuthenticated && user?.email) {
      setEmail(user.email)
    }
  }, [isAuth0Loading, isAuthenticated, user])

  return {
    user: data,
    isLoading,
    error,
  }
}

export default useUser
