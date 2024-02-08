import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from 'components/Layout'
import { AppPath } from './AppRoutes.types'
import Catalog from 'screens/Catalog'
import ShiftCheck from 'components/ShiftCheck'
import StartShift from 'screens/Shift/StartShift'
import EndShift from 'screens/Shift/EndShift'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
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
      <Route path={AppPath.EndShift} element={<EndShift />} />
    </Route>
  </Routes>
)

export default AppRoutes
