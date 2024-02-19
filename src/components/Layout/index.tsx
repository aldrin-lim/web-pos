import { useAuth0 } from '@auth0/auth0-react'
import ArrowLeftOnRectangleIcon from '@heroicons/react/24/outline/ArrowLeftOnRectangleIcon'
import {
  ArrowsRightLeftIcon,
  BookmarkSquareIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline'
import useGetShift from 'hooks/useGetTodayShift'
import useUser from 'hooks/useUser'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

const Layout = () => {
  const navigate = useNavigate()
  const { logout } = useAuth0()
  const { isLoading, user } = useUser()
  const { shift } = useGetShift()

  const isShiftOpen = shift && shift?.status === 'open'

  // Format: 08:00:00 Am
  const shiftStart =
    isShiftOpen &&
    new Date(shift.createdAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })

  if (isLoading) {
    return (
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    )
  }

  return (
    <main className="flex w-full flex-col ">
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <Outlet />
        </div>
        <div className="drawer-side z-30">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu flex h-full min-h-full w-56 flex-col bg-base-200 p-4 text-base-content">
            <div className="mb-4 flex flex-col gap-1 border-b pb-4">
              <h2 className="text-1xl font-bold">Welcome, {user?.firstName}</h2>
              <p className="text-sm">({user?.email})</p>
            </div>
            <div className="mb-8 flex flex-col gap-2">
              <p>Store: {user?.businesses[0].name}</p>
              <p>
                Status:{' '}
                <span className="font-bold text-neutral-500">
                  <span
                    className={`uppercase ${
                      shift && shift.status === 'closed'
                        ? 'text-neutral'
                        : 'text-green-400'
                    }`}
                  >
                    {shift?.status ?? 'closed'}
                  </span>{' '}
                </span>
              </p>
              {shift && shift.status === 'open' && (
                <p className="text-sm ">
                  Shift Start: <span className="">{shiftStart}</span>
                </p>
              )}
            </div>
            <div className="mt-0">
              {shift && shift.status === 'open' && (
                <label
                  onClick={() => navigate(AppPath.Catalog)}
                  htmlFor="my-drawer"
                  className="btn btn-ghost mt-auto w-full justify-start px-1 pl-0"
                >
                  <BookmarkSquareIcon className="h-6 w-6" />
                  Catalog
                </label>
              )}
              <label
                onClick={() => navigate(AppPath.EndShift)}
                htmlFor="my-drawer"
                className="btn btn-ghost mt-auto w-full justify-start px-1 pl-0"
              >
                <ClipboardDocumentListIcon className="h-6 w-6" />Z Report
              </label>
              {shift && shift.status === 'open' && (
                <label
                  onClick={() => navigate(AppPath.EndShift)}
                  htmlFor="my-drawer"
                  className="btn btn-ghost mt-auto w-full justify-start px-1 pl-0"
                >
                  <ArrowsRightLeftIcon className="h-6 w-6" />
                  End Shift
                </label>
              )}

              {shift && shift.status === 'closed' && (
                <label
                  onClick={() => navigate(AppPath.StartShift)}
                  htmlFor="my-drawer"
                  className="btn btn-ghost mt-auto w-full justify-start px-1 pl-0"
                >
                  <ArrowsRightLeftIcon className="h-6 w-6" />
                  Start Shift
                </label>
              )}

              <button
                className="btn btn-ghost w-full justify-start px-1 pl-0 "
                onClick={async () => {
                  await logout({
                    logoutParams: {
                      returnTo: window.location.origin,
                    },
                  })
                }}
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Layout
