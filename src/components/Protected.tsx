import { FC, PropsWithChildren } from 'react'
import { withAuthenticationRequired } from '@auth0/auth0-react'

const Protected: FC<PropsWithChildren> = ({ children }) => {
  // Create a Component that returns your element
  const Component = () => children

  // Wrap the component with authentication and render it
  const WithAuth = withAuthenticationRequired(Component, {
    onRedirecting: () => (
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    ),
  })

  return <WithAuth />
}

export default Protected
