import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import {
  useNavigate,
  useLocation,
  useResolvedPath,
  Navigate,
} from 'react-router-dom'
import { Order } from 'screens/Catalog'
import { Product } from 'types/product.types'
import { formatToPeso } from 'util/currency'
import OrderCartItem from './OrderCartItem'

type CartProps = {
  orders: Order[]
  products: Product[]
  onEmptyCart?: () => void
  totalAmount: number
}

const OrderCart = (props: CartProps) => {
  const { totalAmount, orders } = props

  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  if (props.orders.length === 0) {
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
          <div className="flex flex-row justify-between gap-4">
            <h1 className="text-2xl font-bold">Total</h1>
            <p className="text-2xl font-bold">{formatToPeso(totalAmount)}</p>
          </div>
          {/* Items */}
          <div className="flex w-full flex-col gap-[2px]">
            {orders.map((order) => {
              return <OrderCartItem key={order.id} order={order} />
            })}
          </div>
        </div>
        <div className="fixed bottom-4 left-0 right-0 flex flex-col bg-gray-300 px-2">
          <button className="btn btn-primary">Payment</button>
        </div>
      </div>
    </>
  )
}

export default OrderCart
