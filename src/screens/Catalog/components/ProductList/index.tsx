import { Product } from 'types/product.types'
import ProductCard from './components/ProductCard'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useMemo } from 'react'
import { Order } from 'screens/Catalog'

const verticalScrollStyle =
  'grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
const horizontalScrollSyle = 'flex flex-row gap-4'

type Orientation = 'vertical' | 'horizontal'

type ProductListProps = {
  orientation?: Orientation
  products: Product[]
  onAddProductClick?: () => void
  onClickItem?: (product: Product) => void

  // Inactive state
  onHideItem?: (product: Product) => void
  onAddItemToOrder?: (product: Product) => void

  // Active state
  onRemoveItemFromOrder?: (product: Product) => void
  onModifyItem?: (product: Product) => void

  orders: Order[]
  searchFilter?: string
}

const ORIENTATION: Record<Orientation, string> = {
  horizontal: horizontalScrollSyle,
  vertical: verticalScrollStyle,
}

// List of products from collection
const ProductList = (props: ProductListProps) => {
  const {
    onAddProductClick,
    onHideItem,
    onClickItem,
    onAddItemToOrder,
    onModifyItem,
    onRemoveItemFromOrder,
    orientation = 'horizontal',
    searchFilter = '',
    orders,
  } = props

  const products = useMemo(() => {
    return props.products.filter((product) =>
      product.name.toLowerCase().includes(searchFilter.toLowerCase()),
    )
  }, [props.products, searchFilter])

  const productIdsFromOrder = props.orders.map((order) => order.product.id)

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <div className={ORIENTATION[orientation]}>
          {products.map((product) => (
            <ProductCard
              disableRemove={orders.length > 0}
              active={productIdsFromOrder.includes(product.id)}
              onHide={onHideItem}
              onAddToOrder={onAddItemToOrder}
              onModifyOrder={onModifyItem}
              onRemoveFromOrder={onRemoveItemFromOrder}
              key={product.id}
              product={product}
              onClick={(product) => onClickItem?.(product)}
            />
          ))}
          {onAddProductClick && (
            <button
              onClick={onAddProductClick}
              className="btn btn-square mt-1 flex h-[213px] w-[155px] flex-col justify-self-center border-2 border-dashed border-gray-300"
            >
              <PlusIcon className="w-8 text-success" />
              Add Product
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList
