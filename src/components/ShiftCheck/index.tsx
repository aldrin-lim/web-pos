import useGetShift from 'hooks/useGetTodayShift'
import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

const ShiftCheck: React.FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, shift } = useGetShift()

  if (isLoading) {
    return (
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    )
  }
  // If there's no shift, redirect to the specified route
  if (shift && ['closed', 'not_opened'].includes(shift.status)) {
    return <Navigate to={AppPath.StartShift} replace />
  }

  // If a shift exists, render the children
  return <>{children}</>
}

export default ShiftCheck
