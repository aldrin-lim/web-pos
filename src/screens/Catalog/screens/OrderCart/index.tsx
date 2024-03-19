import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import {
  useNavigate,
  useLocation,
  useResolvedPath,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import { Order } from 'screens/Catalog'
import { Product } from 'types/product.types'
import { formatToPeso } from 'util/currency'
import OrderCartItem from './OrderCartItem'
import SlidingTransition from 'components/SlidingTransition'
import { AnimatePresence } from 'framer-motion'
import Payment from '../Payment'
import OrderItemDetail from '../OrderItemDetail'
import { useMemo } from 'react'
import useUser from 'hooks/useUser'
import Big from 'big.js'
import { toNumber } from 'lodash'

enum Screen {
  Payment = 'payment',
  UpdateOrder = 'update-order',
}

type CartProps = {
  orders: Order[]
  products: Product[]
  onEmptyCart?: () => void
  totalAmount: number
  updateProductInOrder: (order: Order) => void
}

const OrderCart = (props: CartProps) => {
  const { totalAmount, orders } = props
  const { taxRate, tax } = useUser()

  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const showPaymentScreen = () => {
    navigate(Screen.Payment)
  }

  const updateProductInOrder = (order: Order) => {
    if (order.quantity === 0) {
      navigate(-1)
    }
    props.updateProductInOrder(order)
  }

  const showUpdateOrderScreen = (order: Order) => {
    navigate(`${Screen.UpdateOrder}`, {
      state: {
        order,
        action: 'edit',
      },
    })
  }

  const totalTax = useMemo(() => {
    const totalTax = orders.reduce((acc, order) => {
      if (tax?.type === 'inclusive') {
        return acc
      }
      if (order.product.applyTax === false) {
        return acc
      }
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

      price = price * order.quantity

      return new Big(acc)
        .add(new Big(price).times(new Big(taxRate ?? 0).div(100)))
        .round(2)
        .toNumber()
    }, 0)

    return totalTax
  }, [orders, taxRate, tax])

  if (orders.length === 0) {
    return <Navigate to="../" />
  }

  return (
    <>
      <div
        className={[
          'screen relative h-full w-full pb-9',
          !isParentScreen ? 'hidden-screen' : '',
        ].join(' ')}
      >
        <Toolbar
          items={[
            <ToolbarButton
              key={'negative'}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={() => navigate(-1)}
            />,
            <ToolbarTitle key="title" title="Cart" />,
          ]}
        />
        <div className="flex h-full flex-col gap-4 pb-8">
          {/* Heading */}
          <div className="flex flex-row justify-between gap-4 text-white">
            <h1 className="text-2xl font-bold text-white">Total</h1>
            <p className="text-2xl font-bold">{formatToPeso(totalAmount)}</p>
          </div>
          {/* Items */}
          <div className="flex w-full flex-col gap-[2px]">
            {orders.map((order) => {
              return (
                <OrderCartItem
                  onClick={() => showUpdateOrderScreen(order)}
                  key={order.id}
                  order={order}
                />
              )
            })}
            {totalTax > 0 && (
              <div className="ml-[-0.75rem] mr-[-0.75rem] flex flex-row justify-between bg-gray-700 p-2 pl-[0.75rem] pr-[0.75rem]">
                <div className="flex flex-row items-center">
                  <div className="flex flex-col">
                    <p className="text-xl text-white">TAX</p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-white">
                    {formatToPeso(totalTax)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="fixed bottom-4 left-0 right-0 flex flex-col bg-base-100 px-2">
          <button onClick={showPaymentScreen} className="btn btn-primary">
            Payment
          </button>
        </div>
      </div>
      <AnimatePresence>
        <Routes>
          <Route
            path={`${Screen.Payment}/*`}
            element={
              <SlidingTransition>
                <Payment orders={orders} />
              </SlidingTransition>
            }
          />
          <Route
            path={`${Screen.UpdateOrder}/*`}
            element={
              <SlidingTransition>
                <OrderItemDetail
                  onBack={() => navigate(-1)}
                  onUpdateOrder={updateProductInOrder}
                />
              </SlidingTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default OrderCart
