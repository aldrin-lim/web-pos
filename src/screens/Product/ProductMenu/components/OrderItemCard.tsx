type OrderItemCardProps = {
  id: string
  name: string
  quantity: number
  image?: string
  outOfStock?: boolean
  onClick?: () => void
}

import ImageLoader from 'components/ImageLoader'
import MiddleTruncatedText from 'components/MiddleTruncatedText'
import './OrderItemCard.styles.css'
import { TrashIcon } from '@heroicons/react/24/outline'
import useUpdateProductCollection from 'hooks/useUpdateProductCollection'
import { useProductMenuContext } from '../context/ProductMenuContext'

const OrderItemCard = (props: OrderItemCardProps) => {
  const { id, name, quantity, image, onClick, outOfStock = false } = props
  const { updateProductCollection } = useUpdateProductCollection()

  const {
    state: {
      productCollectionState: { activeCollection },
    },
  } = useProductMenuContext()

  const onRemove = async () => {
    if (activeCollection) {
      const productIds = activeCollection.products
        .map((p) => ({ id: p.id }))
        .filter((p) => (p.id = id))

      await updateProductCollection({
        products: productIds,
      })
    }
  }
  return (
    <div className="OrderItem card card-compact w-[155px] cursor-pointer border border-gray-300 bg-base-100">
      <button
        onClick={onRemove}
        className="btn btn-circle btn-ghost btn-xs absolute right-2 top-2 bg-purple-300"
      >
        <TrashIcon className="w-4 text-white" />
      </button>
      <figure onClick={onClick} className="h-[155px] w-[155px] bg-gray-300">
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
