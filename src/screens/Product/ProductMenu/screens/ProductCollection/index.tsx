import {
  PlusIcon,
  ShoppingCartIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import OrderItemCard from '../../components/OrderItemCard'
import { useProductMenuContext } from '../../context/ProductMenuContext'

type ProductCollectionProps = {
  onAddProduct: () => void
}

const ProductCollection = (props: ProductCollectionProps) => {
  const { onAddProduct } = props
  const {
    state: {
      productCollectionState: { activeCollection, isLoading },
    },
  } = useProductMenuContext()

  const onProductClick = (productId: string) => {
    console.log(productId)
  }

  return (
    <div className="section">
      <Toolbar
        items={[
          <div key={1} />,
          <ToolbarTitle key={2} title="Product Menu" />,
          <div key={3} />,
        ]}
      />
      {isLoading && <Skeleton />}
      {!isLoading && (
        <div className="ProductMenuGrid flex w-full flex-row flex-wrap gap-4">
          <button
            className="btn btn-square  mt-1 flex h-[213px] w-[150px] flex-col border-2 border-dashed border-gray-300"
            onClick={onAddProduct}
          >
            <PlusIcon className="w-8 text-success" />
            Add Product
          </button>
          {activeCollection?.products.map((p, index) => (
            <OrderItemCard
              onClick={() => onProductClick(p.id)}
              key={index}
              {...p}
            />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="CartButton fixed bottom-10 left-0 right-0 flex justify-center ">
          <button className="CartButton btn mx-4 flex w-full max-w-md flex-shrink flex-row justify-center gap-4 rounded-md bg-purple-400 p-4 text-white">
            <div className="mx-auto flex flex-row gap-4">
              <div data-testid className="flex flex-row gap-1">
                <ShoppingCartIcon className="w-4" />
                <p>0</p>
              </div>
              <div className="flex flex-row gap-1">
                <p>₱ 0</p>
              </div>
            </div>
            <ChevronRightIcon className="w-5" />
          </button>
        </div>
      )}
    </div>
  )
}

const Skeleton = () => (
  <div className="ProductMenuGrid flex w-full flex-row flex-wrap gap-4">
    <div className="skeleton block min-h-[221px] min-w-[155px]" />
    <div className="skeleton block min-h-[221px] min-w-[155px]" />
    <div className="skeleton block min-h-[221px] min-w-[155px]" />
    <div className="skeleton block min-h-[221px] min-w-[155px]" />
  </div>
)

export default ProductCollection
