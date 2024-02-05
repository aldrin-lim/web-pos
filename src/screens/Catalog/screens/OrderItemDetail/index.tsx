import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import ProductImages from 'components/ProductImages'
import QuantityInput from 'components/QuantityInput'
import { toNumber } from 'lodash'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useResolvedPath } from 'react-router-dom'
import { Order } from 'screens/Catalog'
import { v4 } from 'uuid'

type OrderItemDetailProps = {
  onAddToOrder?: (order: Order) => void
  onModifyOrder?: (order: Order) => void
}

const OrderItemDetail = (props: OrderItemDetailProps) => {
  const { onAddToOrder, onModifyOrder } = props
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname
  const order = location.state.order as Order

  const [initialQuantity] = useState(order.quantity)
  const [quantity, setQuantity] = useState(order.quantity.toString())
  const [error, setError] = useState('')

  const totalQuantity = useMemo(() => {
    if (location.state.action === 'edit') {
      return order.product.totalQuantity + initialQuantity
    }
    return order.product.totalQuantity
  }, [order, location.state.action, initialQuantity])

  if (!order) {
    console.error('Product state is empty')
    return <div>Error loading product</div>
  }

  const product = order.product

  const onAddAToOrderClick = () => {
    setError('')

    if (location.state.action === 'edit') {
      const originalQuantity = initialQuantity + product.totalQuantity

      if (toNumber(quantity) > originalQuantity) {
        setError(`Quantity should not exceed ${originalQuantity}`)
        return
      }

      onModifyOrder?.({
        id: order.id,
        product,
        quantity: toNumber(quantity),
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
    })
  }

  const renderCTA = () => {
    if (location.state.action === 'edit') {
      if (toNumber(quantity) === 0) {
        return (
          <button
            onClick={onAddAToOrderClick}
            className="btn btn-error mt-auto w-full text-white"
          >
            Remove order
          </button>
        )
      }
      return (
        <button
          onClick={onAddAToOrderClick}
          className="btn btn-primary mt-auto w-full"
        >
          Modify order
        </button>
      )
    }
    return (
      <button
        onClick={onAddAToOrderClick}
        className="btn btn-primary mt-auto w-full"
      >
        Add to order
      </button>
    )
  }

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
          <ProductImages readOnly images={product.images} />
          <div className="flex w-full flex-row justify-between gap-3">
            <p>{product.name}</p>
            <p className="font-bold">₱{product.price}</p>
          </div>
          <div className="flex w-full flex-col gap-2">
            <label>Quantity</label>
            <QuantityInput
              value={quantity}
              onChange={(value) => {
                setQuantity(value ?? '')
              }}
              className="w-full"
            />
            <p>{totalQuantity} Available</p>
            <p className="text-red-400">{error}</p>
          </div>
          {renderCTA()}
        </div>
      </div>
    </>
  )
}

export default OrderItemDetail
