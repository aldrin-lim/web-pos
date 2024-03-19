import MiddleTruncatedText from 'components/MiddleTruncatedText'
import ImageLoader from 'components/ImageLoader'
import { z } from 'zod'
import { ProductSchema } from 'types/product.types'
import DropdownButton from 'components/DropdownButton'
import { formatToPeso } from 'util/currency'
import { unitAbbrevationsToLabel } from 'util/measurement'
import { isExpired } from 'util/data'
import { toNumber } from 'lodash'

type Product = z.infer<typeof ProductSchema>

type ProductCardProps = {
  product: Product
  onClick?: (product: Product) => void

  // Inactive state
  onHide?: (product: Product) => void
  onAddToOrder?: (product: Product) => void

  // Active state
  onRemoveFromOrder?: (product: Product) => void
  onUpdateOrder?: (product: Product) => void

  active?: boolean

  disableRemove?: boolean
}

//  Card component for displaying the products from collection
const ProductCard = (props: ProductCardProps) => {
  const { product, onClick, active = false } = props
  const { name, outOfStock } = product

  const image = product.images?.[0] || ''

  const activeStyle = 'bg-primary text-white border-primary'
  const defaultStyle = 'bg-neutral'

  const getMenuItems = () => {
    if (outOfStock) {
      return [
        {
          text: 'Hide Product',
          onClick: () => props.onHide?.(product),
        },
      ]
    }

    if (active) {
      return [
        {
          text: 'Update order',
          onClick: () => props.onUpdateOrder?.(product),
        },
        {
          text: 'Remove Order',
          onClick: () => props.onRemoveFromOrder?.(product),
        },
      ]
    }

    return [
      {
        text: 'Add to order',
        onClick: () => props.onAddToOrder?.(product),
      },
      {
        text: 'Hide Product',
        onClick: () => props.onHide?.(product),
      },
    ]
  }

  return (
    <div className="group relative w-[160px] justify-self-center rounded border-gray-300 bg-neutral">
      <div className="absolute z-[9] flex w-full items-start justify-between">
        <div
          className={`ml-2 mt-2 rounded-md p-1 text-sm group-hover:bg-primary group-hover:text-white group-focus:bg-primary group-focus:text-white ${
            active ? `bg-primary text-white` : `bg-neutral text-gray-900`
          }`}
        >
          {/* 
            If the product is for sale, use the product price.
            If the product is not for sale and is a bulk cost, use the cost per unit if it exists, otherwise use 0.
            If the product is not for sale and is not a bulk cost, use the active batch cost if it exists, otherwise use 0.
          */}
          {renderPrice(product)}
        </div>
        <div className="relative">
          <DropdownButton
            buttonClassName={`btn-primary btn-circle btn-sm rounded-none rounded-bl-xl rounded-tr w-6 h-6 min-h-min hover:bg-primary border-0 ${
              active ? `bg-primary text-white` : `bg-neutral text-gray-900`
            }`}
            items={getMenuItems()}
          />
        </div>
      </div>
      <div
        className={` card card-compact relative w-[160px] cursor-pointer border-0  ${
          active ? activeStyle : defaultStyle
        }`}
        onClick={() => onClick?.(product)}
      >
        <figure className="top-1  h-[98px] w-[160px] overflow-hidden  rounded-tl rounded-tr bg-gray-300">
          {/* Show image or PhotoIcon based on image load status */}
          <ImageLoader src={image} iconClassName="w-24 text-gray-400" />
        </figure>
        <div className="card-body flex w-[160px] flex-col gap-0 rounded-bl rounded-br !py-2 text-left group-hover:bg-primary group-focus:bg-primary">
          <h2
            className={`card-title text-sm  group-hover:text-white group-focus:text-white ${
              active ? `text-white` : `text-gray-900`
            }`}
          >
            <MiddleTruncatedText text={name} maxLength={18} />
          </h2>
          {/* 
            If the product is either tracked or a recipe, display the quantity available.
            If the product is out of stock and does not allow back orders, display 'Out of stock'.
            Otherwise, display the quantity available and the unit of measurement.
          */}
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
