import { Product } from 'types/product.types'
import ProductCard from './components/ProductCard'
import { PlusIcon } from '@heroicons/react/24/solid'

const verticalScrollStyle =
  'grid grid-cols-2 gap-x-4 gap-y-4 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
const horizontalScrollSyle = 'flex flex-row gap-4'

type Orientation = 'vertical' | 'horizontal'

type ProductListProps = {
  orientation?: Orientation
  products: Product[]
  onProductSelect?: (product: Product) => void
  onAddProduct?: () => void
  onHideItem?: (product: Product) => void
}

const ORIENTATION: Record<Orientation, string> = {
  horizontal: horizontalScrollSyle,
  vertical: verticalScrollStyle,
}

// List of products from collection
const ProductList = (props: ProductListProps) => {
  const {
    onProductSelect,
    products,
    onAddProduct,
    onHideItem,
    orientation = 'horizontal',
  } = props

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <div className={ORIENTATION[orientation]}>
          {products.map((product) => (
            <ProductCard
              onHide={onHideItem}
              key={product.id}
              product={product}
              onClick={(product) => onProductSelect?.(product)}
            />
          ))}
          {onAddProduct && (
            <button
              onClick={onAddProduct}
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
