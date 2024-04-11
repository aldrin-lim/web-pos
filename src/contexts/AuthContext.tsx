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
import { Analytics } from 'util/analytics'
import {
  ArrowLeftOnRectangleIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'
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
  const [unverified, setUnverified] = useState<boolean>(false)
  const {
    isAuthenticated,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
    user: auth0User,
    error: auth0Error,
    loginWithRedirect,
    logout,
    getIdTokenClaims,
  } = useAuth0()

  console.log('auth0User', auth0User)

  const [isStateLoading, setIsStateLoading] = useState(true)

  useEffect(() => {
    const getAccessTokenAndUser = async () => {
      try {
        if (isAuth0Loading === false && isAuthenticated && auth0User) {
          if (auth0User.email_verified === false) {
            setIsStateLoading(false)
            setUnverified(true)
            return
          }
          const token = await getAccessTokenSilently()
          const claims = await getIdTokenClaims()
          console.log('claims', claims)
          setAccessToken(token)
          setUser(
            auth0User
              ? {
                  ...auth0User,
                }
              : null,
          )

          await new Promise((resolve) => {
            httpClient.defaults.headers.common['Authorization'] =
              `Bearer ${token}`

            httpClient.interceptors.response.use(
              (config) => config,
              async (error) => {
                if (error.response && error.response.status === 401) {
                  await logout({})
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

  if (unverified) {
    return <UnveriedPage />
  }

  return (
    <AuthContext.Provider value={{ accessToken, user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

const UnveriedPage = () => {
  const { logout } = useAuth0()

  useEffect(() => {
    Analytics.trackPageView('Unveried Page')
  }, [])

  return (
    <div className="absolute bottom-0 top-0 z-50 flex w-screen flex-col items-center justify-center px-4 text-white">
      <EnvelopeIcon className="mx-auto mb-3 w-20" />
      <h1 className="text-center text-2xl font-bold">
        Verify Your Email to Get Started!
      </h1>
      <p className="mx-auto mt-10 max-w-xs text-center">
        Welcome aboard! Please click the link we&apos;ve sent to your email to
        activate your account. If you need assitance, contact us at &nbsp;
        <a
          className="underlined text-blue-400"
          href="mailto:support@qrafter.io"
        >
          support@qrafter.io
        </a>
      </p>

      <p className='text-center" mx-auto mt-10 max-w-xs text-center'>
        if you need to exit, you can log out below.
      </p>

      <div className="mt-2 flex flex-col gap-4">
        <button
          onClick={() => logout()}
          className="btn btn-sm flex w-full flex-row gap-2 text-white"
        >
          <ArrowLeftOnRectangleIcon className="w-6" />
          Sign out
        </button>
      </div>
    </div>
  )
}

export const useAuth = (): AuthContextType => useContext(AuthContext)
