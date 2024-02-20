import { useAuth0 } from '@auth0/auth0-react'
import LoadingCover from 'components/LoadingCover'
import { useEffect } from 'react'

const SignoutScreen = () => {
  const { logout } = useAuth0()

  useEffect(() => {
    logout()
  }, [])
  return <LoadingCover />
}

export default SignoutScreen
