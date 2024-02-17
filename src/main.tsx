import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Protected from 'components/Protected.tsx'
import { AuthProvider } from 'contexts/AuthContext.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Protected>
        <QueryClientProvider client={queryClient}>
          <Router>
            <App />
          </Router>
        </QueryClientProvider>
      </Protected>
    </AuthProvider>
  </React.StrictMode>,
)
