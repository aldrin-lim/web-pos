import { useMemo } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { attachToken } from './util/http'
import { useEffect } from 'react'
import { themeChange } from 'theme-change'

import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'
import useUser from 'hooks/useUser'

function App() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()
  const { isLoading: isUserLoading } = useUser()

  useEffect(() => {
    themeChange(false)
  }, [])

  useMemo(() => {
    if (isLoading === false && isAuthenticated === true) {
      attachToken(getAccessTokenSilently)
    }
  }, [isAuthenticated, isLoading])

  if (isUserLoading) {
    return (
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="App mx-auto flex w-full" data-theme="">
      <ToastContainer
        className={'!left-4 !top-2 !mx-auto !w-[90%] !rounded-md text-xs'}
        toastClassName={'!rounded-md'}
        closeButton={false}
        closeOnClick
      />
      <AppRoutes />
    </div>
  )
}

export default App
