/* eslint-disable react/display-name */
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import ProductImages from 'components/ProductImages'
import QuantityInput from 'components/QuantityInput'
import { toNumber } from 'lodash'
import { useMemo, useState } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom'
import { Discount, Order } from 'screens/Catalog'
import { v4 } from 'uuid'
import Dropdown from './components/Dropdown'
import SlidingTransition from 'components/SlidingTransition'
import { AnimatePresence } from 'framer-motion'
import DiscountDetail from '../DiscountDetail'
import Big from 'big.js'
import { formatToPeso } from 'util/currency'
import { useQueryClient } from '@tanstack/react-query'
import { ProductCollection } from 'types/productCollection.types'

enum Screen {
  DiscountDetail = 'discount-detail',
}

type OrderItemDetailProps = {
  onAddToOrder?: (order: Order) => void
  onUpdateOrder?: (order: Order) => void
  onBack?: () => void
}

const OrderItemDetail = (props: OrderItemDetailProps) => {
  const { onAddToOrder, onUpdateOrder, onBack } = props
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname
  const order = location.state.order as Order
  const queryClient = useQueryClient()

  const [initialQuantity] = useState(order.quantity)
  const [quantity, setQuantity] = useState(order.quantity.toString())
  const [discount, setDiscount] = useState<Discount | undefined>(order.discount)
  const [error, setError] = useState('')

  const originalTotalQuantity = useMemo(() => {
    const productCollection = queryClient.getQueryData([
      'productCollection',
      'default',
    ]) as ProductCollection

    if (!productCollection) {
      return 0
    }

    const product = productCollection.products.find(
      (product) => product.id === order.product.id,
    )

    if (!product) {
      return 0
    }

    return product.totalQuantity
  }, [order.product.id, queryClient])

  const totalQuantity = useMemo(() => {
    if (location.state.action === 'edit') {
      return new Big(originalTotalQuantity).minus(new Big(quantity)).toString()
    }
    return new Big(order.product.totalQuantity)
      .minus(new Big(quantity))
      .toString()
  }, [
    location.state.action,
    order.product.totalQuantity,
    quantity,
    originalTotalQuantity,
  ])

  const product = order.product

  const discountAmount = useMemo(() => {
    if (!discount) {
      return 0
    }

    if (discount.type === 'fixed') {
      return new Big(product.price)
        .sub(new Big(discount.amount))
        .round(2)
        .toFixed(2)
    }

    // return product.price * (discount.amount / 100) - product.price
    return new Big(product.price).sub(
      new Big(product.price).times(new Big(discount.amount).div(100)),
    )
  }, [discount, product])

  const onAddAToOrderClick = () => {
    setError('')

    if (location.state.action === 'edit') {
      const originalQuantity = initialQuantity + product.totalQuantity
      const tracked =
        product.trackStock === true ||
        (product.trackStock === false && !!product.recipe)

      if (!tracked) {
        onUpdateOrder?.({
          id: order.id,
          product,
          quantity: toNumber(quantity),
          discount,
        })
      }

      if (
        product.allowBackOrder === false &&
        toNumber(quantity) > originalQuantity
      ) {
        setError(`Quantity should not exceed ${originalQuantity}`)
        return
      }

      onUpdateOrder?.({
        id: order.id,
        product,
        quantity: toNumber(quantity),
        discount,
      })

      return
    }

    if (toNumber(quantity) === 0) {
      setError('Quantity should not be zero')
      return
    }
    onAddToOrder?.({
      id: v4(),
      product,
      quantity: toNumber(quantity),
      discount,
    })
  }

  const onApplyDiscount = (discount: Discount) => {
    navigate(-1)
    setDiscount(discount)
  }

  const renderCTA = () => {
    if (location.state.action === 'edit') {
      if (toNumber(quantity) === 0) {
        return (
          <button
            onClick={onAddAToOrderClick}
            className="btn btn-error mb-9 mt-auto w-full text-white"
          >
            Remove order
          </button>
        )
      }
      return (
        <button
          onClick={onAddAToOrderClick}
          className="btn btn-primary mb-9 mt-auto w-full"
        >
          Update order
        </button>
      )
    }
    return (
      <button
        onClick={onAddAToOrderClick}
        className="btn btn-primary mb-9 mt-auto w-full"
      >
        Add to order
      </button>
    )
  }

  return (
    <>
      <div
        className={[
          'screen h-full',
          !isParentScreen ? 'hidden-screen' : '',
        ].join(' ')}
      >
        <Toolbar
          items={[
            <ToolbarButton
              key={'negative'}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={onBack}
            />,
            <ToolbarTitle key="title" title="Order" />,
            <Dropdown
              onDiscountClick={() =>
                navigate(Screen.DiscountDetail, { state: location.state })
              }
              key="3"
            />,
          ]}
        />
        <div className="flex h-full w-full flex-col gap-4">
          <ProductImages readOnly images={product.images} />
          <div className="flex w-full flex-row justify-between gap-3 text-white">
            <div className="flex flex-col gap-2">
              <p>{product.name}</p>
            </div>
            <div className="flex flex-col gap-2 text-right">
              <p
                className={[discount ? 'line-through' : 'font-bold'].join(' ')}
              >
                {formatToPeso(product.price)}
              </p>
              {discount?.amount && (
                <p className="font-bold">
                  {formatToPeso(toNumber(discountAmount) ?? 0)}
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 text-white">
            <label className="font-bold">Quantity</label>
            <QuantityInput
              value={quantity}
              onAdd={(value) => {
                if (location.state.action !== 'edit') {
                  if (+quantity < order.product.totalQuantity) {
                    setQuantity(value ?? '')
                    return
                  }
                  if (!product.recipe && product.trackStock === false) {
                    setQuantity(value ?? '')
                    return
                  }
                  if (product.trackStock === true && product.allowBackOrder) {
                    setQuantity(value ?? '')
                    return
                  }
                  return
                }
                if (+quantity < originalTotalQuantity) {
                  setQuantity(value ?? '')
                  return
                }

                if (!product.recipe && product.trackStock === false) {
                  setQuantity(value ?? '')
                  return
                }
                if (product.trackStock === true && product.allowBackOrder) {
                  setQuantity(value ?? '')
                  return
                }
              }}
              onSubtract={(value) => {
                if (+quantity > 0) {
                  setQuantity(value ?? '')
                }
              }}
              onChange={(value) => {
                setQuantity(value ?? '0')
              }}
              className="w-full"
            />
            {!product.allowBackOrder && <p>{totalQuantity} Available</p>}
            <p className="text-red-400">{error}</p>
          </div>
          {renderCTA()}
        </div>
      </div>

      <AnimatePresence>
        <Routes location={location} key={isParentScreen.toString()}>
          <Route
            path={`${Screen.DiscountDetail}/*`}
            element={
              <SlidingTransition>
                <DiscountDetail
                  value={discount}
                  onApplyDiscount={onApplyDiscount}
                />
              </SlidingTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}
const withLocationState =
  (Component: React.FC<OrderItemDetailProps>) =>
  (props: OrderItemDetailProps) => {
    const location = useLocation()
    if (!location.state?.order) {
      return <Navigate to={'../'} />
    }
    return <Component {...props} />
  }

// eslint-disable-next-line react-refresh/only-export-components
export default withLocationState(OrderItemDetail)
