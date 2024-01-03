import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { cloneDeep } from 'lodash'
import { OrderItem } from 'types/order.types'

type CartItemProps = {
  orderItem: OrderItem
  onClick?: (orderItem: OrderItem) => void
}

const CartItem = (props: CartItemProps) => {
  const { onClick, orderItem } = props
  const { gross, net, discount, product, quantity, productVariant } = orderItem
  const price = productVariant ? productVariant.price : product.price

  const onOrderItemClick = (orderItem: OrderItem) => {
    if (onClick) {
      onClick(orderItem)
    }
  }
  return (
    <div
      className="clickable flex w-full flex-row gap-2 bg-gray-200 p-2 align-middle text-sm"
      onClick={() => onOrderItemClick(cloneDeep(orderItem))}
    >
      <PencilSquareIcon className="w-6 text-purple-400" />
      <div className="max-w-sm ">
        <p>{productVariant ? `${productVariant.name}` : product.name}</p>
        <p>
          {quantity} x ₱{price.toFixed(2)}
        </p>
      </div>
      <div className="ml-auto">
        <p className={`${discount ? 'line-through' : ''}`}>
          ₱ {gross.toFixed(2)}
        </p>
        {discount && <p>₱ {net.toFixed(2)}</p>}
      </div>
    </div>
  )
}

export default CartItem
