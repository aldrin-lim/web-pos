import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useState } from 'react'

enum ActiveScreen {
  None = 'none',
  DiscountList = 'list',
}

type OrderSelectionDiscountProps = {
  onBack: () => void
}

const OrderSelectionDiscount = (props: OrderSelectionDiscountProps) => {
  const { onBack } = props
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
            <ToolbarTitle key={2} title="Discount" />,
          ]}
        />
        OrderSelectionDiscount
      </div>
    </div>
  )
}

export default OrderSelectionDiscount
