import { useAuth0 } from '@auth0/auth0-react'

const AuthButton = () => {
  const { loginWithRedirect, isAuthenticated, isLoading, logout } = useAuth0()

  const onClick = async () => {
    if (!isAuthenticated) {
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: `${window.location.origin}/dashboard`,
        },
      })
    } else {
      await logout()
    }
  }
  return (
    <button
      className="rounded bg-blue-500 px-4 py-2 text-white"
      disabled={isLoading}
      onClick={onClick}
      type="button"
    >
      {isAuthenticated ? 'Sign out' : 'Sign in'}
    </button>
  )
}

export default AuthButton
