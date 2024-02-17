// AuthContext.tsx
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
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
    isLoading: auth0Loading,
    getAccessTokenSilently,
    user: auth0User,
    error: auth0Error,
    loginWithRedirect,
  } = useAuth0()

  useEffect(() => {
    const getAccessTokenAndUser = async () => {
      try {
        if (isAuthenticated) {
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
        } else {
          // Log out the user from the application if not authenticated
          // You can specify a returnTo URL in the logout method
          await loginWithRedirect({
            authorizationParams: {
              redirect_uri: window.location.origin,
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
  }, [isAuthenticated, getAccessTokenSilently, auth0User, loginWithRedirect])

  if (auth0Error) {
    setError(auth0Error)
  }

  const isLoading = auth0Loading || accessToken === null || user === null

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
    >
      <AuthContext.Provider value={{ accessToken, user, isLoading, error }}>
        {children}
      </AuthContext.Provider>
    </Auth0Provider>
  )
}

export const useAuth = (): AuthContextType => useContext(AuthContext)
