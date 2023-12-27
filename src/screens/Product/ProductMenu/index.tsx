import {
  ChevronRightIcon,
  PlusIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'

import './styles.css'
import { useCallback, useState } from 'react'
import SlidingTransition from 'components/SlidingTransition'
import ProductSelection from './screens/ProductSelection'
import OrderItemCard from './components/OrderItemCard'

enum ActiveScreen {
  None = 'none',
  ProductSelection = 'productSelection',
}

const ProductMenu = () => {
  const [activeScreen, setActiveScreen] = useState(ActiveScreen.None)

  const goBackToMainScreen = useCallback(() => {
    setActiveScreen(ActiveScreen.None)
  }, [])

  return (
    <div
      className={`ProductMenu main-screen ${
        activeScreen === ActiveScreen.None ? 'h-full' : 'h-screen'
      }`}
    >
      <div className="section">
        <Toolbar
          items={[
            <div key={1} />,
            <ToolbarTitle key={2} title="Product Menu" />,
            <div key={3} />,
          ]}
        />
        <div className="ProductMenuGrid flex w-full flex-row flex-wrap gap-4">
          <button
            className="btn btn-square  mt-1 flex h-[213px] w-[150px] flex-col border-2 border-dashed border-gray-300"
            onClick={() => setActiveScreen(ActiveScreen.ProductSelection)}
          >
            <PlusIcon className="w-8 text-success" />
            Add Product
          </button>
          <OrderItemCard id="" name="New Product" quantity={33} />
        </div>
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
      </div>

      <SlidingTransition
        direction="right"
        isVisible={activeScreen === ActiveScreen.ProductSelection}
        zIndex={10}
      >
        <ProductSelection onBack={goBackToMainScreen} />
      </SlidingTransition>
    </div>
  )
}

export default ProductMenu
