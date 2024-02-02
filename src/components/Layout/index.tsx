import { useAuth0 } from '@auth0/auth0-react'
import ArrowLeftOnRectangleIcon from '@heroicons/react/24/outline/ArrowLeftOnRectangleIcon'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  const { logout } = useAuth0()
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
          <ul className="menu min-h-full w-48 bg-base-200 p-4 text-base-content">
            {/* Sidebar content here */}
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <button
                className="btn btn-ghost w-full justify-start px-1 "
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
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default Layout
