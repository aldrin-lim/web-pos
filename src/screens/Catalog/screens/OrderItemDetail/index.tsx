import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import ProductImages from 'components/ProductImages'
import QuantityInput from 'components/QuantityInput'
import { useState } from 'react'
import { useLocation, useNavigate, useResolvedPath } from 'react-router-dom'
import { Order } from 'screens/Catalog'

type OrderItemDetailProps = {
  onAddToOrder?: (order: Order) => void
}

const OrderItemDetail = (props: OrderItemDetailProps) => {
  const { onAddToOrder } = props
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname
  const order = location.state.order as Order
  const [quantity, setQuantity] = useState(order.quantity ?? 0)

  if (!order) {
    console.error('Product state is empty')
    return <div>Error loading product</div>
  }

  const product = order.product

  return (
    <>
      <div
        className={[
          'screen h-full pb-9',
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

            <ToolbarTitle key="title" title="Order" />,
          ]}
        />
        <div className="flex h-full w-full flex-col gap-4">
          <ProductImages images={product.images} />
          <div className="flex w-full flex-row justify-between gap-3">
            <p>{product.name}</p>
            <p className="font-bold">₱{product.price}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label>Quantity</label>
            <QuantityInput
              value={quantity}
              onChange={(value) => {
                const newQuantity = +value
                if (product.totalQuantity > newQuantity) {
                  setQuantity(+value)
                }
              }}
              className="w-full"
            />
            <p>{product.totalQuantity} Available</p>
          </div>
          <button
            onClick={() =>
              onAddToOrder?.({
                product,
                quantity,
              })
            }
            className="btn btn-primary mt-auto"
          >
            Add to order{' '}
          </button>
        </div>
      </div>
    </>
  )
}

export default OrderItemDetail
