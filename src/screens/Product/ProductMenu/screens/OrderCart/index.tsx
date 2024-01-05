import {
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useState } from 'react'
import CartItem from './components/CartItem'
import {
  ProductMenuActionType,
  useProductMenuContext,
} from '../../context/ProductMenuContext'
import { useQueryClient } from '@tanstack/react-query'
import { ProductCollection } from 'types/productCollection.types'
import { OrderItem } from 'types/order.types'
import SlidingTransition from 'components/SlidingTransition'
import OrderSelection from '../OrderSelection'
import { Product } from 'types/product.types'

enum ActiveScreen {
  None = 'none',
  OrderItem = 'orderItem',
}

type OrderCartProps = {
  onBack: () => void
}

const OrderCart = (props: OrderCartProps) => {
  const { onBack } = props
  const [activeScreen, setActiveScreen] = useState(ActiveScreen.None)
  const queryClient = useQueryClient()

  const [activeOrderItem, setActiveOrderItem] = useState<OrderItem | null>(null)

  const {
    state: {
      order,
      productCollectionState: { activeCollection },
    },
    dispatch,
  } = useProductMenuContext()

  const clearCart = async () => {
    dispatch({ type: ProductMenuActionType.ClearCart })
    const productCollections = (await queryClient.getQueryData([
      'productCollections',
    ])) as ProductCollection[]
    if (productCollections.length > 0) {
      dispatch({
        type: ProductMenuActionType.UpdateActiveCollection,
        payload: productCollections[0],
      })
    }
    onBack()
  }

  const goBackToOrderCartScreen = () => {
    setActiveScreen(ActiveScreen.None)
  }

  const onOrderItemSelect = (value: OrderItem) => {
    if (activeCollection) {
      const updatedProduct = activeCollection.products.find(
        (product) => product.id === value.product.id,
      )
      const updatedVariant = updatedProduct?.variants.find(
        (variant) => variant.id === value.productVariant?.id,
      )
      const updateOderItem: OrderItem = {
        ...value,
        product: updatedProduct as Product,
        productVariant: updatedVariant,
      }
      setActiveOrderItem(updateOderItem)
      setActiveScreen(ActiveScreen.OrderItem)
    }
  }

  const editCartItem = (updated: OrderItem, original?: OrderItem) => {
    if (original) {
      dispatch({
        type: ProductMenuActionType.UpdateOrderItem,
        payload: {
          updated,
          original,
        },
      })
      setActiveScreen(ActiveScreen.None)
    }
  }

  return (
    <div
      className={`OrderSelection main-screen ${
        activeScreen === ActiveScreen.None ? 'h-full' : 'h-screen'
      }`}
    >
      <div className="section sub-screen">
        <Toolbar
          items={[
            <ToolbarButton
              key={1}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={onBack}
            />,
            <ToolbarTitle key={2} title="Order Cart" />,
            <ToolbarButton
              key={3}
              icon={<TrashIcon className="w-6" />}
              onClick={clearCart}
            />,
          ]}
        />
        <div className="flex flex-col gap-2">
          {/* COST */}
          {!order && (
            <div className="mt-10 gap-8 text-center">
              <p className="text-xl font-bold">No items found in cart</p>
              <button
                className="btn btn-primary mt-10 self-center"
                onClick={onBack}
              >
                <ArrowUturnLeftIcon className="w-5" />
                Go Back to Menu
              </button>
            </div>
          )}
          {order && (
            <>
              <div className="TotalCost mb-4 flex flex-row justify-between align-middle text-2xl font-bold">
                <p className="">TOTAL</p>
                <p>₱ {order.net.toFixed(2)}</p>
              </div>
              {/* ITEMS */}
              {order.orderItems.map((item, key) => {
                return (
                  <CartItem
                    onClick={(orderItem) => onOrderItemSelect(orderItem)}
                    orderItem={item}
                    key={key}
                  />
                )
              })}
            </>
          )}
        </div>
      </div>

      <SlidingTransition
        direction="right"
        isVisible={activeScreen === ActiveScreen.OrderItem}
        zIndex={10}
      >
        {activeOrderItem && (
          <OrderSelection
            onComplete={editCartItem}
            values={activeOrderItem}
            onBack={goBackToOrderCartScreen}
            editMode={true}
          />
        )}
      </SlidingTransition>
    </div>
  )
}

export default OrderCart
