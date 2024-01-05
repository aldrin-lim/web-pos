import ImageLoader from 'components/ImageLoader'
import MiddleTruncatedText from 'components/MiddleTruncatedText'
import './ProductCard.styles.css'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

type OrderItemCardProps = {
  id: string
  name: string
  quantity: number
  image?: string
  outOfStock?: boolean
  onClick?: () => void
  onRemove?: () => void
  isLoading?: boolean
}

const ProductCard = (props: OrderItemCardProps) => {
  const { name, quantity, image } = props

  const [isLoading, setIsLoading] = useState(props.isLoading ?? false)

  useEffect(() => {
    setIsLoading(props.isLoading ?? false)
  }, [props.isLoading])

  const onClick = async () => {
    if (props.onClick) {
      try {
        setIsLoading(true)
        await props.onClick()
      } finally {
        setIsLoading(false)
      }
    }
  }

  const onRemove = async () => {
    if (props.onRemove) {
      try {
        setIsLoading(true)
        await props.onRemove()
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div
      onClick={onClick}
      className={`ProductCard card card-compact relative w-[155px] cursor-pointer justify-self-center border border-gray-300 bg-base-100 ${
        isLoading ? 'opacity-35' : ''
      }`}
    >
      {isLoading && (
        <div className="absolute top-20 flex w-full justify-center">
          <span className="loading loading-bars loading-lg " />
        </div>
      )}
      {props.onRemove && (
        <button
          onClick={onRemove}
          disabled={isLoading}
          className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2 bg-purple-300"
        >
          <TrashIcon className="w-5 text-white" />
        </button>
      )}
      <figure className="h-[155px] w-[155px] bg-gray-300">
        {/* Show image or PhotoIcon based on image load status */}
        <ImageLoader src={image} iconClassName="w-24 text-gray-400" />
      </figure>
      <div className="card-body flex flex-col gap-0 !py-2 text-left">
        <h2 className="card-title text-sm">
          <MiddleTruncatedText text={name} maxLength={18} />
        </h2>

        <div className="flex flex-row gap-1  text-xs">
          <span className={`overflow-hidden truncate text-ellipsis`}>
            {quantity} available
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
