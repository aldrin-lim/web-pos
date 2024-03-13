import { useAuth0 } from '@auth0/auth0-react'
import {
  ArrowLeftOnRectangleIcon,
  FaceFrownIcon,
} from '@heroicons/react/24/outline'
import { ArrowPathIcon } from '@heroicons/react/24/solid'

const Error = () => {
  const { logout } = useAuth0()
  const refreshPage = () => {
    // Go back to the original url without the paths
    window.location.href = window.location.origin
  }

  return (
    <div className="z-50 flex h-screen w-screen flex-col items-center justify-center bg-base-100">
      <FaceFrownIcon className="mx-auto mb-3 w-20" />
      <h1 className="text-3xl font-bold">Unexpected Error</h1>

      <p className="mx-auto mt-10 max-w-xs text-center">
        Sorry, We had some techinical problem. We are already working on it.
        Please try again in a few minutes
      </p>

      <p className="mx-auto mt-10 max-w-xs text-center">
        If you need assitance, contact us at &nbsp;
        <a
          className="underlined text-blue-400"
          href="mailto:support@qrafter.io"
        >
          support@qrafter.io
        </a>
      </p>

      <div className="mt-10 flex flex-col gap-4">
        <button className="btn flex flex-row gap-2 " onClick={refreshPage}>
          <ArrowPathIcon className="w-6" />
          Refresh page
        </button>
        <button
          onClick={() => logout()}
          className="btn flex w-full flex-row gap-2"
        >
          <ArrowLeftOnRectangleIcon className="w-6" />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default Error
