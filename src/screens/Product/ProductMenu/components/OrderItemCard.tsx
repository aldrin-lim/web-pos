type OrderItemCardProps = {
  id: string
  name: string
  quantity: number
  image?: string
  outOfStock?: boolean
}

import ImageLoader from 'components/ImageLoader'
import MiddleTruncatedText from 'components/MiddleTruncatedText'
import './OrderItemCard.styles.css'

const OrderItemCard = (props: OrderItemCardProps) => {
  const { name, quantity, image, outOfStock = false } = props

  return (
    <div className="OrderItem card card-compact w-[155px] cursor-pointer border border-gray-300 bg-base-100">
      <figure className="h-[155px] w-[155px] bg-gray-300">
        {/* Show image or PhotoIcon based on image load status */}
        <ImageLoader src={image} iconClassName="w-24 text-gray-400" />
      </figure>
      <div className="card-body flex flex-col gap-0 !py-2 text-left">
        <h2 className="card-title text-sm">
          <MiddleTruncatedText text={name} maxLength={18} />
        </h2>

        <div className="flex flex-row gap-1  text-xs">
          <span
            className={`overflow-hidden truncate text-ellipsis ${
              outOfStock ? 'text-red-400' : ''
            }`}
          >
            {quantity} available
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderItemCard
