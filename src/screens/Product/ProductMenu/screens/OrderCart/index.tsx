import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useState } from 'react'
import CartItem from './components/CartItem'
import { useProductMenuContext } from '../../context/ProductMenuContext'

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

  const {
    state: { order },
    dispatch,
  } = useProductMenuContext()

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
          ]}
        />
        <div className="flex flex-col gap-2">
          {/* COST */}
          <div className="TotalCost mb-4 flex flex-row justify-between align-middle text-2xl font-bold">
            <p className="">TOTAL</p>
            <p>₱ 0</p>
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
