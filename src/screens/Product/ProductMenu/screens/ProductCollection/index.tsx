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
    <div className="ProductCollection sub-screen pb-32">
      <Toolbar
        items={[
          <div key={1} />,
          <ToolbarTitle key={2} title="Menu" />,
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
        <div className="ProductMenuGrid grid w-full grid-flow-row-dense grid-cols-2 justify-center gap-4 md:flex md:flex-row md:flex-wrap">
          <button
            className="btn btn-square mt-1 flex h-[213px] w-[150px] flex-col justify-self-center border-2 border-dashed border-gray-300"
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
  <div className="ProductMenuGrid grid w-full grid-flow-row-dense grid-cols-2 justify-center gap-4 md:flex md:flex-row md:flex-wrap">
    <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
    <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
    <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />
    <div className="skeleton block min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center" />

    {/* MORE ON LARGER VIEW */}

    <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center md:block" />
    <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center md:block" />
    <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center md:block" />
    <div className="skeleton hidden min-h-[221px] min-w-[155px] max-w-[155px] justify-self-center md:block" />
  </div>
)

export default ProductCollection
