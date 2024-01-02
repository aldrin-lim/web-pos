import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { OrderItem } from 'types/order.types'

type CartItemProps = OrderItem

const CartItem = (props: CartItemProps) => {
  const { gross, net, discount, product, quantity, productVariant } = props
  return (
    <div className="clickable flex w-full flex-row gap-2 bg-gray-200 p-2 align-middle text-sm">
      <PencilSquareIcon className="w-6 text-purple-400" />
      <div className="max-w-sm ">
        <p>{productVariant ? `${productVariant.name}` : product.name}</p>
        <p>
          {quantity} x ₱{product.price.toFixed(2)}
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
