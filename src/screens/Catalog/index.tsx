import SlidingTransition from 'components/SlidingTransition'
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom'
import ProductOverview from './screens/ProductOverview'
import { AnimatePresence } from 'framer-motion'

enum ScreenPath {
  AddProduct = 'add-product',
}

const Catalog = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const showAddProduct = () => {
    navigate(ScreenPath.AddProduct, { relative: 'route' })
  }

  const resolvePath = useResolvedPath('')

  const isParentScreen = location.pathname === resolvePath.pathname

  return (
    <>
      <div
        className={['screen pb-9', !isParentScreen ? 'hidden-screen' : ''].join(
          ' ',
        )}
      >
        <button onClick={showAddProduct}>Add Product</button>
      </div>
      <AnimatePresence>
        <Routes location={location} key={isParentScreen.toString()}>
          <Route
            path={`${ScreenPath.AddProduct}/*`}
            element={
              <SlidingTransition>
                <ProductOverview onBack={() => navigate(-1)} />
              </SlidingTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default Catalog
