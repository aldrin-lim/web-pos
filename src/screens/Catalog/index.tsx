import SlidingTransition from 'components/SlidingTransition'
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom'
import ProductSelection from './screens/ProductSelection'
import { AnimatePresence } from 'framer-motion'
import Toolbar from 'components/Layout/components/Toolbar'

import logo from '../../../public/logo.svg'
import { Bars3Icon } from '@heroicons/react/24/solid'
import useGetProductCollection from 'hooks/useGetProductCollection'
import { Product } from 'types/product.types'
import useUpdateProductCollection from 'hooks/useUpdateProductCollection'
import ProductList from './components/ProductList'
import { useEffect, useState } from 'react'
import OrderItemDetail from './screens/OrderItemDetail'
enum ScreenPath {
  AddProduct = 'add-product',
  OrderItemDetail = 'order-item-detail',
}

export type Order = {
  product: Product
  quantity: number
  discount?: {
    name: string
    type: 'percentage' | 'amount'
    amount: number
  }
}

const useCatalog = () => {
  // This hooks accepts a list of products

  const { isLoading, productCollection } = useGetProductCollection()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!isLoading && productCollection?.products) {
      setProducts(productCollection.products)
    }
  }, [isLoading, productCollection])

  const [orders, setOrder] = useState<Array<Order>>([])

  const addProductToOrder = (order: Order) => {
    // Subtract the quantity from the products
    const { product, quantity } = order

    const updatedProduct = products.map((p) => {
      if (p.id === product.id) {
        p.totalQuantity -= quantity
      }
      return p
    })
    setProducts(updatedProduct)

    // Increase the quantity of the product in the order
    const existingOrder = orders.findIndex((p) => p.product.id === product.id)
    if (existingOrder === -1) {
      setOrder([...orders, { product, quantity }])
    } else {
      const updatedOrder = orders.map((p) => {
        if (p.product.id === product.id) {
          p.quantity += quantity
        }
        return p
      })
      setOrder(updatedOrder)
    }
  }

  // const updateProductInOrder = (product: Product, quantity: number) => {
  //   // Determine first if its subtracting or adding
  //   const existingOrderIndex = orders.findIndex(
  //     (p) => p.product.id === product.id,
  //   )
  //   if (existingOrderIndex === -1) {
  //     console.error('Product not found in order')
  //     return
  //   }

  //   const existingOrder = orders[existingOrderIndex]
  // }

  return {
    isLoading,
    products,
    orders,
    addProductToOrder,
  }
}

const Catalog = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')

  const [searchFilter, setSearchFilter] = useState('')

  const { updateProductCollection, isUpdating } = useUpdateProductCollection()

  const { products, orders, addProductToOrder, isLoading } = useCatalog()

  const isMutating = isUpdating

  const productIdsInCollection = products.map((product) => product.id) ?? []
  const filter = (product: Product) => {
    return !productIdsInCollection.includes(product.id)
  }
  const isParentScreen = location.pathname === resolvePath.pathname

  const showProductSelectionScreen = () => {
    navigate(ScreenPath.AddProduct, { relative: 'route' })
  }

  const addProductToCollection = async (product: Product) => {
    navigate(-1)

    const existingProducts = products.map((p) => ({ id: p.id })) ?? []

    await updateProductCollection({
      products: [...existingProducts, { id: product.id }],
    })
  }

  const removeProductFromCollection = async (product: Product) => {
    const existingProducts = products.map((p) => ({ id: p.id })) ?? []

    await updateProductCollection({
      products: existingProducts.filter((p) => p.id !== product.id),
    })
  }

  const addProductToroder = (product: Product) => {
    console.log(product)
  }

  const addOrder = (order: Order) => {
    navigate(-1)
    addProductToOrder(order)
  }

  const showOrderDetailScreen = (product: Product) => {
    navigate(`${ScreenPath.OrderItemDetail}`, {
      state: {
        order: {
          product,
          quantity: 1,
        },
      },
    })
  }

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton />
    }

    return (
      <div className="flex flex-col gap-4">
        <input
          className="input input-bordered w-full "
          placeholder="Search Product by Name"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <ProductList
          searchFilter={searchFilter}
          onAddProductClick={showProductSelectionScreen}
          onAddItemToOrder={showOrderDetailScreen}
          onHideItem={removeProductFromCollection}
          onClickItem={addProductToroder}
          products={products}
          orders={orders}
          orientation="vertical"
        />
      </div>
    )
  }

  return (
    <>
      <div
        className={['screen pb-9', !isParentScreen ? 'hidden-screen' : ''].join(
          ' ',
        )}
      >
        <Toolbar
          items={[
            <label
              htmlFor="my-drawer"
              key="1"
              className="btn btn-link px-0 normal-case text-blue-400 no-underline disabled:bg-transparent disabled:text-gray-400"
            >
              <Bars3Icon className="w-6" />
            </label>,
            <div
              key="title"
              className="mx-auto flex flex-row gap-3 self-center py-3 text-center"
            >
              <img key="logo " className="w-6 self-center" src={logo} />
              <h1 className="font-bold">Qrafter</h1>
            </div>,
            null,
          ]}
        />
        {isMutating && <LoadingCover />}
        {renderContent()}
      </div>
      <AnimatePresence>
        <Routes location={location} key={isParentScreen.toString()}>
          <Route
            path={`${ScreenPath.AddProduct}/*`}
            element={
              <SlidingTransition>
                <ProductSelection
                  onProductSelect={addProductToCollection}
                  filter={filter}
                  onBack={() => navigate(-1)}
                />
              </SlidingTransition>
            }
          />
          <Route
            path={`${ScreenPath.OrderItemDetail}/*`}
            element={
              <SlidingTransition>
                <OrderItemDetail onAddToOrder={addOrder} />
              </SlidingTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default Catalog

const LoadingCover = () => (
  <div className="fixed z-50 flex h-screen w-full justify-center bg-gray-500/60">
    <span className="loading loading-ring loading-lg text-primary"></span>
  </div>
)

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
