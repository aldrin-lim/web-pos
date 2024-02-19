import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from 'contexts/AuthContext.tsx'
import Big from 'big.js'
Big.DP = 4

const queryClient = new QueryClient()

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
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <App />
          </Router>
        </QueryClientProvider>
      </AuthProvider>
    </Auth0Provider>
  </React.StrictMode>,
)
