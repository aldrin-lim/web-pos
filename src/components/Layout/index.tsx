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
    <main className="flex w-full flex-col">
      <Outlet />
    </main>
  )
}

export default Layout
