import { ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/outline'
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

enum ActiveScreen {
  None = 'none',
  DiscountList = 'list',
}

type OrderCartProps = {
  onBack: () => void
}

const OrderCart = (props: OrderCartProps) => {
  const { onBack } = props
  const [activeScreen, setActiveScreen] = useState(ActiveScreen.None)
  const queryClient = useQueryClient()

  const {
    state: { order, productCollectionState },
    dispatch,
  } = useProductMenuContext()

  const clearCart = async () => {
    dispatch({ type: ProductMenuActionType.ClearCart })
    await queryClient.resetQueries(['productCollections'])
    onBack()
  }

  if (!order) {
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
            ]}
          />
          <p>No items added on the cart yet.</p>
        </div>
      </div>
    )
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
        <label htmlFor="my_modal_6" className="btn">
          open modal
        </label>
        <input
          type="checkbox"
          hidden
          id="my_modal_6"
          className="modal-toggle"
        />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Hello!</h3>
            <p className="py-4">This modal works with a hidden checkbox!</p>
            <div className="modal-action">
              <label htmlFor="my_modal_6" className="btn">
                Close!
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {/* COST */}
          <div className="TotalCost mb-4 flex flex-row justify-between align-middle text-2xl font-bold">
            <p className="">TOTAL</p>
            <p>₱ {order.net.toFixed(2)}</p>
          </div>
          {/* ITEMS */}
          {order.orderItems.map((item, key) => {
            return <CartItem key={key} {...item} />
          })}
        </div>
      </div>
    </div>
  )
}

export default OrderCart
