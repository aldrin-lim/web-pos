import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useAllProducts from 'hooks/useAllProducts'
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

import './styles.css'
import ProductList from './components/ProductList'
import { ComponentProps } from 'react'
import { Product } from 'types/product.types'
import SlidingTransition from 'components/SlidingTransition'
import Inventory from 'components/Inventory'
import { AnimatePresence } from 'framer-motion'
import NoSelection from './components/NoSelection'

enum ScreenPath {
  List = `list`,
}

type ProductSelectionProps = {
  onBack: () => void
  onProductSelect?: (product: Product) => void
  filter: (product: Product) => boolean
}

const ProductSelection = (props: ProductSelectionProps) => {
  const { onBack, onProductSelect, filter } = props
  const navigate = useNavigate()
  const location = useLocation()

  const resolvePath = useResolvedPath('')

  const { products, isLoading } = useAllProducts()

  const filteredProducts = products.filter(filter)

  const outOfStocks = filteredProducts.filter(
    (product) => product.outOfStock === true,
  )

  const inStocks = filteredProducts.filter(
    (product) => product.outOfStock === false,
  )

  const hasOutOfStockProducts = outOfStocks.length > 0

  const orientation: ComponentProps<typeof ProductList>['orientation'] =
    hasOutOfStockProducts ? 'horizontal' : 'vertical'

  const viewProduct = (product: Product) => {
    onProductSelect?.(product)
  }

  const showInventory = () => {
    // navigateTo(ScreenPath.List, { relative: 'path' })
    navigate(ScreenPath.List)
  }

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton />
    }

    if (filteredProducts.length === 0) {
      return <NoSelection />
    }

    return (
      <div className="flex flex-col gap-4">
        {/* IN STOCKS */}
        <ProductList
          onViewAll={showInventory}
          onProductSelect={viewProduct}
          products={inStocks}
          orientation={orientation}
        />

        {outOfStocks.length > 0 && (
          <ProductList
            outOfStock
            onViewAll={showInventory}
            onProductSelect={viewProduct}
            products={outOfStocks}
            orientation={orientation}
          />
        )}
      </div>
    )
  }

  const isParentScreen = location.pathname === resolvePath.pathname

  return (
    <>
      <div
        className={['screen pb-9', !isParentScreen ? 'hidden-screen' : ''].join(
          ' ',
        )}
      >
        <Toolbar
          items={[
            <ToolbarButton
              key={1}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={onBack}
            />,

            <ToolbarTitle key="title" title="Products" />,
            <div key={3} />,
          ]}
        />
        {renderContent()}
      </div>
      <AnimatePresence>
        <Routes location={location} key={isParentScreen.toString()}>
          <Route
            path={`${ScreenPath.List}/*`}
            element={
              <SlidingTransition>
                <Inventory
                  products={filteredProducts}
                  onBack={() => navigate(-1)}
                  onProductSelect={viewProduct}
                />
              </SlidingTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

const Skeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="skeleton h-[24px] w-full rounded-md"></div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
        <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center lg:block" />
        <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center lg:block" />
      </div>
    </div>
  )
}

export default ProductSelection
