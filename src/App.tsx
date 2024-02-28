import { useEffect } from 'react'
import { themeChange } from 'theme-change'

import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'
import useUser from 'hooks/useUser'
import * as Sentry from '@sentry/react'

function App() {
  useUser()

  const { user } = useUser()

  useEffect(() => {
    themeChange(false)
  }, [])

  useEffect(() => {
    user?.email && Sentry.setUser({ email: user.email })
  }, [user])

  return (
    <div className="App mx-auto flex h-full w-full" data-theme="">
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
