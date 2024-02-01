import { Product } from 'types/product.types'
import ProductCard from '../ProductCard'

const verticalScrollStyle =
  'grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
const horizontalScrollSyle = 'flex flex-row gap-4'

type Orientation = 'vertical' | 'horizontal'

type ProductListProps = {
  orientation?: Orientation
  products: Product[]
  onProductSelect?: (product: Product) => void
  onViewAll?: () => void
}

const ORIENTATION: Record<Orientation, string> = {
  horizontal: horizontalScrollSyle,
  vertical: verticalScrollStyle,
}

const ProductList = (props: ProductListProps) => {
  const {
    onViewAll,
    onProductSelect,
    products,
    orientation = 'horizontal',
  } = props

  return (
    <div className="flex flex-col gap-4">
      {onViewAll && (
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="font-bold">Available</h2>
          <button
            onClick={() => onViewAll?.()}
            className="btn btn-link h-0 min-h-[20px] px-0 text-cyan-400 no-underline disabled:bg-transparent disabled:text-gray-400"
          >
            View all
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <div className={ORIENTATION[orientation]}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={(product) => onProductSelect?.(product)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductList
