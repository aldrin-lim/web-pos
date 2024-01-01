import { PlusIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useProductMenuContext } from '../../context/ProductMenuContext'
import useUpdateProductCollection from 'hooks/useUpdateProductCollection'
import ProductCard from '../../components/ProductCard'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import { useAuth0 } from '@auth0/auth0-react'
import { Product } from 'types/product.types'

type ProductCollectionProps = {
  onAddProduct: () => void
  onProductClick?: (product: Product) => void
}

const ProductCollection = (props: ProductCollectionProps) => {
  const { logout } = useAuth0()
  const { onAddProduct, onProductClick } = props
  const {
    state: {
      productCollectionState: { activeCollection, isLoading },
    },
  } = useProductMenuContext()
  const { updateProductCollection } = useUpdateProductCollection()

  const removeProductFromActiveCollection = async (productId: string) => {
    if (activeCollection) {
      const productIds = activeCollection.products
        .map((p) => ({ id: p.id }))
        .filter((p) => p.id !== productId)

      await updateProductCollection({
        products: productIds,
      })
    }
  }

  return (
    <div className="sub-screen pb-32">
      <Toolbar
        items={[
          <div key={1} />,
          <ToolbarTitle key={2} title="Product Menu" />,
          <ToolbarButton
            key={3}
            label="Sign out"
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              })
            }
          />,
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
          {activeCollection?.products.map((product, index) => (
            <ProductCard
              onRemove={async () =>
                await removeProductFromActiveCollection(product.id)
              }
              onClick={async () => {
                if (onProductClick) {
                  await onProductClick(product)
                }
              }}
              key={index}
              {...product}
            />
          ))}
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
