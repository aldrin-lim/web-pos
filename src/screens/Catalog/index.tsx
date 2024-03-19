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
import { Bars3Icon, ShoppingCartIcon } from '@heroicons/react/24/solid'
import useGetProductCollection from 'hooks/useGetProductCollection'
import { Product } from 'types/product.types'
import useUpdateProductCollection from 'hooks/useUpdateProductCollection'
import ProductList from './components/ProductList'
import { useEffect, useState } from 'react'
import OrderItemDetail from './screens/OrderItemDetail'

import { v4 } from 'uuid'
import { cloneDeep, toNumber } from 'lodash'
import Big from 'big.js'
import { z } from 'zod'
import OrderCart from './screens/OrderCart'
import { formatToPeso } from 'util/currency'
import { useQueryClient } from '@tanstack/react-query'
import { AppPath } from 'routes/AppRoutes.types'
import LoadingCover from 'components/LoadingCover'
enum ScreenPath {
  AddProduct = 'add-product',
  AddOrder = 'add-product-to-order',
  UpdateOrder = 'update-order',
  OrderCart = 'order-cart',
}

export type Order = {
  id: string
  product: Product
  quantity: number
  discount?: Discount
}

export type OrderAction = 'add' | 'edit' | 'reset'
const useCatalog = () => {
  // This hooks accepts a list of products

  const queryClient = useQueryClient()

  const { isLoading, productCollection } = useGetProductCollection()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!isLoading && productCollection?.products) {
      setProducts(cloneDeep(productCollection.products))
    }
  }, [isLoading, productCollection])

  const [orders, setOrder] = useState<Array<Order>>([])

  const addProductToOrder = (order: Order) => {
    // Subtract the quantity from the products
    const { product, quantity, discount } = order

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
      setOrder([...orders, { id: v4(), product, quantity, discount }])
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

  const removeOrder = (product: Product) => {
    // Find the order based from the input product
    const order = orders.find((p) => p.product.id === product.id)

    if (!order) {
      console.error('Order not found')
      return
    }

    const quantityUsed = order.quantity
    const updatedOrder = orders.filter((p) => p.product.id !== order.product.id)
    setOrder(updatedOrder)

    const updatedProduct = products.map((p) => {
      if (p.id === order.product.id) {
        p.totalQuantity += quantityUsed
      }
      return p
    })
    setProducts(updatedProduct)
  }

  const updateOrder = async (order: Order) => {
    // If quantity is zero remove the order
    if (order.quantity === 0) {
      removeOrder(order.product)
      return
    }

    // Find the order
    const existingOrder = orders.find((o) => o.id === order.id)

    if (!existingOrder) {
      console.error('Order not found')
      return
    }

    // Update the order
    const updatedOrder = orders.map((o) => {
      if (o.id === order.id) {
        return order
      }
      return o
    })
    setOrder(updatedOrder)

    const originalProduct = productCollection?.products.find(
      (p) => p.id === order.product.id,
    )

    if (!originalProduct) {
      console.error('Product not found')
      return
    }

    const updatedProduct = products.map((p) => {
      if (originalProduct.id === p.id) {
        p.totalQuantity = originalProduct.totalQuantity - order.quantity
        return p
      }
      return p
    })
    setProducts(updatedProduct)
  }

  const resetCatalog = async () => {
    setOrder([])
    await queryClient.invalidateQueries(['productCollection', 'default'])
  }

  return {
    isLoading,
    products,
    orders,
    addProductToOrder,
    removeOrder,
    updateOrder,
    resetCatalog,
  }
}

const Catalog = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')

  const { updateProductCollection, isUpdating } = useUpdateProductCollection()

  const {
    products,
    orders,
    isLoading,
    addProductToOrder,
    removeOrder,
    updateOrder,
    resetCatalog,
  } = useCatalog()

  const isMutating = isUpdating

  const productIdsInCollection = products.map((product) => product.id) ?? []
  const filter = (product: Product) => {
    return !productIdsInCollection.includes(product.id) && product.forSale
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
    const isTracked =
      product.trackStock === true ||
      (product.recipe && product.trackStock === false)

    if (isTracked) {
      if (product.allowBackOrder === false && product.totalQuantity >= 1) {
        addProductToOrder({
          id: v4(),
          product,
          quantity: 1,
        })
      }
      if (product.allowBackOrder === true) {
        addProductToOrder({
          id: v4(),
          product,
          quantity: 1,
        })
      }
      return
    }
    addProductToOrder({
      id: v4(),
      product,
      quantity: 1,
    })
    // If product isnt being tracked negative is allowed
  }

  const addOrder = (order: Order) => {
    navigate(-1)
    addProductToOrder(order)
  }

  const showOrderDetailScreen = (product: Product) => {
    navigate(`${ScreenPath.AddOrder}`, {
      state: {
        order: {
          product,
          quantity: 1,
        },
      },
    })
  }

  const removeProductFromOrder = (product: Product) => {
    removeOrder(product)
  }

  const updateProductInOrder = (order: Order) => {
    navigate(-1)
    updateOrder(order)
  }

  const showUpdateOrderScreen = (product: Product) => {
    navigate(`${ScreenPath.UpdateOrder}`, {
      state: {
        order: orders.find((p) => p.product.id === product.id),
        action: 'edit',
      },
    })
  }

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton />
    }

    return (
      <div className="relative -top-4 flex flex-col pb-20 ">
        <div className="mt-2 p-2">
          <h1 className="font-bold text-white">Product Catalog </h1>
        </div>
        <div className="mt-4">
          <ProductList
            onAddProductClick={showProductSelectionScreen}
            // Event handler for item when not selected yet
            onAddItemToOrder={showOrderDetailScreen}
            onHideItem={removeProductFromCollection}
            // Event handler for item when selected

            onRemoveItemFromOrder={removeProductFromOrder}
            onUpdateItemClick={showUpdateOrderScreen}
            onClickItem={addProductToroder}
            products={products}
            orders={orders}
            orientation="vertical"
          />
        </div>
      </div>
    )
  }

  const showCartScreen = () => {
    if (orders.length > 0) {
      navigate(`${ScreenPath.OrderCart}`)
    }
  }

  const totalOrderAmount = orders.reduce((acc, order) => {
    let price = order.product.price

    if (order.discount && order.discount.type === 'fixed') {
      price = toNumber(
        new Big(order.product.price)
          .sub(new Big(order.discount.amount))
          .round(2)
          .toFixed(2),
      )
    }
    if (order.discount && order.discount.type === 'percentage') {
      price = toNumber(
        new Big(order.product.price)
          .sub(
            new Big(order.product.price).times(
              new Big(order.discount.amount).div(100),
            ),
          )
          .round(2)
          .toFixed(2),
      )
    }
    return acc + price * order.quantity
  }, 0)

  const totalOrderLength = orders.reduce((acc, order) => {
    return acc + order.quantity
  }, 0)

  useEffect(() => {
    if (location.state?.action === 'reset') {
      resetCatalog()
      navigate(AppPath.Catalog)
    }
  }, [location.state, resetCatalog])

  return (
    <>
      <div className={[isParentScreen ? 'screen' : 'hidden-screen'].join(' ')}>
        <Toolbar
          items={[
            <label
              htmlFor="my-drawer"
              key="1"
              className="btn btn-link px-0 normal-case text-neutral no-underline disabled:bg-transparent disabled:text-gray-400"
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

        {/* Cart Button */}
        <div className="fixed bottom-4 z-10 w-full">
          <div className="mx-auto max-w-sm md:max-w-md">
            <button className="btn btn-primary w-full" onClick={showCartScreen}>
              <div className="flex flex-row gap-4">
                <div className="flex flex-row items-center gap-2">
                  <ShoppingCartIcon className="w-5" /> {totalOrderLength}
                </div>
                <div className="flex flex-row items-center gap-2">
                  {formatToPeso(totalOrderAmount)}
                </div>
              </div>
            </button>
          </div>
        </div>
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
            path={`${ScreenPath.AddOrder}/*`}
            element={
              <SlidingTransition>
                <OrderItemDetail
                  onBack={() => navigate(-1)}
                  onAddToOrder={addOrder}
                />
              </SlidingTransition>
            }
          />
          <Route
            path={`${ScreenPath.UpdateOrder}/*`}
            element={
              <SlidingTransition>
                <OrderItemDetail
                  onBack={() => navigate(-1)}
                  onUpdateOrder={updateProductInOrder}
                />
              </SlidingTransition>
            }
          />
          <Route
            path={`${ScreenPath.OrderCart}/*`}
            element={
              <SlidingTransition>
                <OrderCart
                  updateProductInOrder={updateProductInOrder}
                  totalAmount={totalOrderAmount}
                  products={products}
                  orders={orders}
                />
              </SlidingTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default Catalog

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

export const DiscountSchema = z.object({
  name: z.string({}).optional(),
  type: z.enum(['percentage', 'fixed'], {
    required_error: 'Discount type is required',
  }),
  amount: z
    .number({
      required_error: 'Discount amount is required',
      invalid_type_error: 'Discount amount must be a number',
      coerce: true,
    })
    .positive('Amount must be greater than 0'),
})

export type Discount = z.infer<typeof DiscountSchema>
