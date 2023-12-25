import { useMemo } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { attachToken } from './util/http'
import { useEffect } from 'react'
import { themeChange } from 'theme-change'

import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'

function App() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  useEffect(() => {
    themeChange(false)
  }, [])

  useMemo(() => {
    if (isAuthenticated) {
      attachToken(getAccessTokenSilently)
    }
  }, [getAccessTokenSilently, isAuthenticated])

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
