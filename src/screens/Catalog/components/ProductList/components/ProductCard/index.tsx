import MiddleTruncatedText from 'components/MiddleTruncatedText'
import ImageLoader from 'components/ImageLoader'
import { z } from 'zod'
import { ProductSchema } from 'types/product.types'
import DropdownButton from 'components/DropdownButton'

type Product = z.infer<typeof ProductSchema>

type ProductCardProps = {
  product: Product
  onClick?: (product: Product) => void
  onHide?: (product: Product) => void
  onAddToOrder?: (product: Product) => void
}

//  Card component for displaying the products from collection
const ProductCard = (props: ProductCardProps) => {
  const { product, onClick } = props
  const { name, outOfStock, totalQuantity } = product

  const { unitOfMeasurement } = product.activeBatch

  const image = product.images?.[0] || ''

  return (
    <div className="relative  justify-self-center">
      <div className="absolute right-2 top-2 z-10">
        <DropdownButton
          buttonClassName="btn-primary btn-circle btn-sm "
          items={[
            {
              text: 'Add to order',
              onClick: () => props.onAddToOrder?.(product),
            },
            {
              text: 'Hide Product',
              onClick: () => props.onHide?.(product),
            },
          ]}
        />
      </div>
      <div
        className="ProductCard card card-compact relative w-[155px] cursor-pointer border border-gray-300 bg-base-100"
        onClick={() => onClick?.(product)}
      >
        <figure className="h-[155px] w-[153px] overflow-hidden rounded-t-xl bg-gray-300">
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
              {totalQuantity} {unitOfMeasurement} available
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
