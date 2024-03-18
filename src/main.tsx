import React, { PropsWithChildren } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from 'contexts/AuthContext.tsx'
import Big from 'big.js'
import { ErrorBoundary } from 'react-error-boundary'
import Error from 'screens/Error/index.tsx'
import { Analytics } from 'util/analytics.ts'
import { useRegisterSW } from 'virtual:pwa-register/react'
Big.DP = 4

Analytics.init()

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      onError={(error) => {
        Analytics.trackUnhandledError(error)
      }}
      fallback={<Error />}
    >
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }}
      >
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
              <App />
            </Router>
          </QueryClientProvider>
        </AuthProvider>
      </Auth0Provider>
    </ErrorBoundary>
  </React.StrictMode>,
)

const PWAWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker at: ${swUrl}`)
      // @ts-expect-error just ignore
      if (reloadSW === 'true') {
        r &&
          setInterval(() => {
            console.log('Checking for sw update')
            r.update()
          }, 20000 /* 20s for testing purposes */)
      } else {
        // eslint-disable-next-line prefer-template
        console.log('SW Registered: ' + r)
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })
}
