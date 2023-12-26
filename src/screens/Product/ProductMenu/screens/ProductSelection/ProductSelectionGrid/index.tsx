import OrderItemCard from 'screens/Product/ProductMenu/components/OrderItemCard'
import { Product } from 'types/product.types'

type ProductSelectionGridProps = {
  outOfStockProducts: Product[]
  inStockProducts: Product[]
  onSecondaryAction: () => void
}

const ProductSelectionGrid = () => {
  return (
    <div className="flex w-full flex-row gap-4">
      <OrderItemCard id="" name="New Product" quantity={33} />
      <OrderItemCard id="" name="New Product" quantity={33} />
      <OrderItemCard id="" name="New Product" quantity={33} />
      <OrderItemCard id="" name="New Product" quantity={33} />
      <OrderItemCard id="" name="New Product" quantity={33} />
      <OrderItemCard id="" name="New Product" quantity={33} />
    </div>
  )
}

export default ProductSelectionGrid
