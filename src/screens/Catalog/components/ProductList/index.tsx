import { Product } from 'types/product.types'
import ProductCard from './components/ProductCard'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useMemo } from 'react'

const verticalScrollStyle =
  'grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
const horizontalScrollSyle = 'flex flex-row gap-4'

type Orientation = 'vertical' | 'horizontal'

type ProductListProps = {
  orientation?: Orientation
  products: Product[]
  onAddProductClick?: () => void
  onClickItem?: (product: Product) => void
  onHideItem?: (product: Product) => void
  onAddItemToOrder?: (product: Product) => void

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
    orientation = 'horizontal',
    searchFilter = '',
  } = props

  const products = useMemo(() => {
    return props.products.filter((product) =>
      product.name.toLowerCase().includes(searchFilter.toLowerCase()),
    )
  }, [props.products, searchFilter])

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <div className={ORIENTATION[orientation]}>
          {products.map((product) => (
            <ProductCard
              onHide={onHideItem}
              onAddToOrder={onAddItemToOrder}
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
