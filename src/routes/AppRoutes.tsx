import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from 'components/Layout'
import { AppPath } from './AppRoutes.types'
import ProtectedRoute from './ProtectedRoutes'
import Catalog from 'screens/Catalog'
import ShiftCheck from 'components/ShiftCheck'
import StartShift from 'screens/Shift/StartShift'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
      <Route index element={<Navigate to={AppPath.Catalog} />} />
      <Route
        path={`${AppPath.Catalog}/*`}
        element={
          <ShiftCheck>
            <Catalog />
          </ShiftCheck>
        }
      />
      <Route path={AppPath.StartShift} element={<StartShift />} />
    </Route>
  </Routes>
)

export default AppRoutes
