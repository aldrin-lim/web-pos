import React, { PropsWithChildren, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { attachToken } from 'util/http.ts'

const queryClient = new QueryClient()

const AuthInject = (props: PropsWithChildren) => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()
  const [loading, setLoading] = useState(true)

  useMemo(() => {
    if (!isLoading && isAuthenticated) {
      void (async () => {
        await attachToken(getAccessTokenSilently)
        setLoading(false)
      })()
    } else if (!isLoading && !isAuthenticated) {
      setLoading(false)
    }
  }, [getAccessTokenSilently, isAuthenticated, isLoading])

  if (loading) {
    return (
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    )
  }

  return props.children
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
    >
      <AuthInject>
        <QueryClientProvider client={queryClient}>
          <Router>
            <App />
          </Router>
        </QueryClientProvider>
      </AuthInject>
    </Auth0Provider>
  </React.StrictMode>,
)
