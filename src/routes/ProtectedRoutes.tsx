import { FC, ReactElement } from 'react'
import {
  withAuthenticationRequired,
  WithAuthenticationRequiredOptions,
} from '@auth0/auth0-react'

interface ProtectedRouteProps extends WithAuthenticationRequiredOptions {
  element: ReactElement
  [key: string]: unknown // additional props that can be passed to the component
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ element, ...args }) => {
  // Create a Component that returns your element
  const Component = () => element

  // Wrap the component with authentication and render it
  const WithAuth = withAuthenticationRequired(Component, {
    onRedirecting: () => (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    ),
    ...args,
  })

  return <WithAuth />
}

export default ProtectedRoute
