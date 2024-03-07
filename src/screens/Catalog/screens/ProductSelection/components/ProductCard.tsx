import MiddleTruncatedText from 'components/MiddleTruncatedText'
import ImageLoader from 'components/ImageLoader'
import { Product } from 'types/product.types'
import { formatToPeso } from 'util/currency'
import { unitAbbrevationsToLabel } from 'util/measurement'
import { isExpired } from 'util/data'
import { toNumber } from 'lodash'

type ProductCardProps = {
  product: Product
  onClick?: (product: Product) => void
}

const ProductCard = (props: ProductCardProps) => {
  const { product, onClick } = props
  const { name } = product

  const image = product.images?.[0] || ''

  return (
    <div className="relative  justify-self-center">
      <div className="absolute top-2 z-[9] flex w-full items-center justify-between px-2">
        <div className="bg-primary/50 p-1 text-sm text-white">
          {renderPrice(product)}
        </div>
      </div>
      <div
        className={`ProductCard card card-compact relative w-[155px] cursor-pointer border border-gray-300  bg-base-100 `}
        onClick={() => onClick?.(product)}
      >
        <figure className="top-1 h-[155px] w-[153px] overflow-hidden  bg-gray-300">
          {/* Show image or PhotoIcon based on image load status */}
          <ImageLoader src={image} iconClassName="w-24 text-gray-400" />
        </figure>
        <div className="card-body flex flex-col gap-0 !py-2 text-left">
          <h2 className="card-title text-sm">
            <MiddleTruncatedText text={name} maxLength={18} />
          </h2>

          {renderStockInfo(product)}
        </div>
      </div>
    </div>
  )
}

const renderPrice = (product: Product) => {
  const activeBatch = product.activeBatch
  const cost = activeBatch?.cost ?? 0
  const measurement = activeBatch?.unitOfMeasurement
  if (!product.forSale) {
    // user price for ingredients

    if (product.isBulkCost) {
      return `${formatToPeso(cost)} ${
        measurement ? `/${unitAbbrevationsToLabel(measurement)}` : ``
      }`
    }

    return formatToPeso(cost)
  }

  if (product.isBulkCost) {
    return `${formatToPeso(cost)} ${
      measurement ? `/${unitAbbrevationsToLabel(measurement)}` : ``
    }`
  }

  return formatToPeso(product.price)
}

const renderStockInfo = (product: Product) => {
  const activeBatch = product.activeBatch
  const measurement = unitAbbrevationsToLabel(
    activeBatch?.unitOfMeasurement ?? '',
  )
  if (!activeBatch) {
    return (
      <div className="flex flex-row gap-1  text-xs">
        <span className={`overflow-hidden truncate text-ellipsis text-red-400`}>
          No Batches Found
        </span>
      </div>
    )
  }

  if (product.outOfStock) {
    return (
      <div className="flex flex-row gap-1  text-xs">
        <span className={`overflow-hidden truncate text-ellipsis text-red-400`}>
          Out of stock
        </span>
      </div>
    )
  }

  if (isExpired(activeBatch.expirationDate)) {
    return (
      <div className="flex flex-row gap-1  text-xs">
        <span
          className={`overflow-hidden truncate text-ellipsis text-orange-400`}
        >
          Expired
        </span>
      </div>
    )
  }
  if (toNumber(product.stockWarning) >= product.totalQuantity) {
    return (
      <div className="flex flex-row gap-1  text-xs">
        <span
          className={`overflow-hidden truncate text-ellipsis text-orange-400`}
        >
          Low ({product.totalQuantity} {measurement} available)
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-row gap-1  text-xs">
      <span className={`overflow-hidden truncate text-ellipsis `}>
        {product.totalQuantity} {measurement} available
      </span>
    </div>
  )
}

export default ProductCard
