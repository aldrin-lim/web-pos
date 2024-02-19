// AuthContext.tsx
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { httpClient } from 'util/http'
import LoadingCover from 'components/LoadingCover'
export interface AuthUser {
  name?: string
  email?: string
  picture?: string
}

// Define the context type
export interface AuthContextType {
  accessToken: string | null
  user: AuthUser | null
  isLoading: boolean
  error: Error | null
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  user: null,
  isLoading: true,
  error: null,
})

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const {
    isAuthenticated,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
    user: auth0User,
    error: auth0Error,
    loginWithRedirect,
    logout,
  } = useAuth0()

  const [isStateLoading, setIsStateLoading] = useState(true)

  useEffect(() => {
    const getAccessTokenAndUser = async () => {
      try {
        if (isAuth0Loading === false && isAuthenticated) {
          const token = await getAccessTokenSilently()

          setAccessToken(token)
          setUser(
            auth0User
              ? {
                  name: auth0User.name,
                  email: auth0User.email,
                  picture: auth0User.picture,
                }
              : null,
          )

          await new Promise((resolve) => {
            httpClient.defaults.headers.common['Authorization'] =
              `Bearer ${token}`

            httpClient.interceptors.response.use(
              (config) => config,
              (error) => {
                if (error.response && error.response.status === 401) {
                  logout({})
                }
                // Optionally handle other error statuses or log errors.

                return Promise.reject(error)
              },
            )
            setTimeout(() => {
              setIsStateLoading(false)
              resolve(null)
              // TODO: Fix this hacky way of setting the loading state
            }, 100)
          })
        }

        if (isAuth0Loading === false && isAuthenticated === false) {
          loginWithRedirect({
            appState: {
              returnTo: window.location.pathname,
            },
          })
        }
      } catch (e) {
        setError(
          e instanceof Error
            ? e
            : new Error('An error occurred getting the access token'),
        )
      }
    }

    getAccessTokenAndUser()
  }, [isAuthenticated, isAuth0Loading])

  if (auth0Error) {
    setError(auth0Error)
  }

  const isLoading = isAuth0Loading || isStateLoading

  if (isLoading) {
    return <LoadingCover />
  }

  return (
    <AuthContext.Provider value={{ accessToken, user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => useContext(AuthContext)
