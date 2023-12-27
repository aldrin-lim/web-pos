import useAllProducts from 'hooks/useAllProducts'
import useMediaQuery, { ScreenSize } from 'hooks/useMediaQuery'
import useUser from 'hooks/useUser'
import { Navigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import OrderItemCard from 'screens/Product/ProductMenu/components/OrderItemCard'

type ProductSelectionGridProps = {
  onViewAll: () => void
}

const getProductCardNumber = (size: ScreenSize) => {
  switch (size) {
    case 'xs':
    case 'sm':
      return 4
    case 'md':
    case 'lg':
      return 8
    default:
      return 10
  }
}

const ProductSelectionGrid = (props: ProductSelectionGridProps) => {
  const { onViewAll } = props
  const { currentBreakpoint } = useMediaQuery({ updateOnResize: true })

  const { user, isLoading: isUserLoading, error: userError } = useUser()

  const bussinessId = user?.businesses[0]?.id

  const productCardNumber = getProductCardNumber(currentBreakpoint)
  const {
    products,
    isLoading: isProductsLoading,
    error: productError,
  } = useAllProducts(bussinessId, {
    limit: productCardNumber,
    outOfStock: false,
  })

  const {
    products: outOfStockProducts,
    isLoading: isoutOfSotckProductsLoading,
    error: outOfStouckProductError,
  } = useAllProducts(bussinessId, {
    limit: productCardNumber,
    outOfStock: true,
  })

  const error = productError || outOfStouckProductError || userError

  const isLoading =
    isUserLoading || isProductsLoading || isoutOfSotckProductsLoading

  if (isLoading) {
    return <Skeleton />
  }

  if (!isLoading && error) {
    return <Navigate to={AppPath.Error} />
  }

  const hasOutOfStocks = true

  const verticalScrollStyle = 'flex-wrap justify-center'
  const horizontalScrollSyle = 'overflow-x-auto'
  return (
    <div className="flex flex-col gap-4">
      {/* IN STOCKS */}
      {products.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-row items-center justify-between">
            <h2 className="font-bold">Available</h2>
            <button
              onClick={onViewAll}
              className="btn btn-link h-0 min-h-[20px] px-0 text-cyan-400 no-underline disabled:bg-transparent disabled:text-gray-400"
            >
              View all
            </button>
          </div>
          <div
            className={`flex w-full flex-row gap-x-2 gap-y-4 ${
              hasOutOfStocks ? horizontalScrollSyle : verticalScrollStyle
            }`}
          >
            {products.map((product) => (
              <OrderItemCard
                id={product.id as string}
                image={product?.images?.[0] || ''}
                name={product.name}
                key={product.name}
                quantity={product.quantity}
              />
            ))}
          </div>
        </div>
      )}

      {/* OUT OF STOCKS */}
      {outOfStockProducts.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-row items-center justify-between">
            <h2 className="font-bold">Out of Stocks</h2>
            <button
              onClick={onViewAll}
              className="btn btn-link h-0 min-h-[20px] px-0 text-cyan-400 no-underline disabled:bg-transparent disabled:text-gray-400"
            >
              View all
            </button>
          </div>
          <div
            className={`flex w-full flex-row gap-x-2 gap-y-4 ${
              hasOutOfStocks ? horizontalScrollSyle : verticalScrollStyle
            }`}
          >
            {outOfStockProducts.map((product) => (
              <OrderItemCard
                outOfStock
                id={product.id as string}
                image={product?.images?.[0] || ''}
                name={product.name}
                key={product.name}
                quantity={product.quantity}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const Skeleton = () => (
  <>
    <div className="flex flex-col gap-4">
      <div className=" w-full ">
        <div className="skeleton h-[20px] w-full" />
      </div>
      <div className="flex w-full flex-row gap-4 overflow-x-auto">
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
      </div>
    </div>
    <div className="flex flex-col gap-4">
      <div className=" w-full ">
        <div className="skeleton h-[20px] w-full" />
      </div>
      <div className="flex w-full flex-row gap-4 overflow-x-auto">
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
        <div className="skeleton h-[221px] w-[155px] min-w-[155px]" />
      </div>
    </div>
  </>
)

export default ProductSelectionGrid
