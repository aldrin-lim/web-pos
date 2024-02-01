import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from 'components/Layout'
import { AppPath } from './AppRoutes.types'
import ProtectedRoute from './ProtectedRoutes'
import Catalog from 'screens/Catalog'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
      <Route index element={<Navigate to={AppPath.Catalog} />} />
      <Route path={`${AppPath.Catalog}/*`} element={<Catalog />} />
    </Route>
  </Routes>
)

export default AppRoutes
