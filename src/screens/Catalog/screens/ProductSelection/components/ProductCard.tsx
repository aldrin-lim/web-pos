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
    <div className="relative w-[160px] justify-self-center rounded border-gray-300 bg-neutral">
      <div className="absolute z-[9] flex w-full items-start justify-between">
        <div className="ml-2 mt-2 rounded-md bg-neutral bg-opacity-70 p-1 text-sm text-gray-900">
          {renderPrice(product)}
        </div>
      </div>
      <div
        className={`ProductCard  card card-compact relative w-[160px] cursor-pointer border-0  bg-neutral`}
        onClick={() => onClick?.(product)}
      >
        <figure className="top-1  h-[98px] w-[160px] overflow-hidden  rounded-tl rounded-tr bg-gray-300">
          {/* Show image or PhotoIcon based on image load status */}
          <ImageLoader src={image} iconClassName="w-24 text-gray-400" />
        </figure>
        <div className="card-body flex w-[160px] flex-col gap-0 rounded-bl rounded-br !py-2 text-left group-hover:bg-primary group-focus:bg-primary">
          <h2 className="card-title text-sm  text-gray-900 group-hover:text-white group-focus:text-white">
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
      return `${formatToPeso(activeBatch?.costPerUnit ?? 0)} ${
        measurement ? `/${unitAbbrevationsToLabel(measurement)}` : ``
      }`
    }

    return formatToPeso(cost)
  }

  if (product.isBulkCost) {
    return `${formatToPeso(product.price)} ${
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
