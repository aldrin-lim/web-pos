import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import { useCallback, useState } from 'react'
import { Product } from 'types/product.types'

// This component lets you pick product to be inlcuded in the main screen of the POS
enum ActiveScreen {
  None = 'none',
  DiscountList = 'list',
}

type OrderSelectionProps = {
  onBack: () => void
  product: Product
}

const OrderSelection = (props: OrderSelectionProps) => {
  const { onBack, product } = props

  const [activeScreen, setActiveScreen] = useState(ActiveScreen.None)
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
            <ToolbarTitle key={2} title="Products" />,
          ]}
        />
        {product.name}
      </div>
    </div>
  )
}

export default OrderSelection
