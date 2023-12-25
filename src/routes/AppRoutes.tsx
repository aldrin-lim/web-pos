import { Routes, Route } from 'react-router-dom'
import Layout from 'components/Layout'
import { AppPath } from './AppRoutes.types'
import ProductMenu from 'screens/Product/ProductMenu'
import ProtectedRoute from './ProtectedRoutes'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
      <Route index element={<ProductMenu />} />
      <Route path={AppPath.Products} element={<ProductMenu />} />
    </Route>
  </Routes>
)

export default AppRoutes
