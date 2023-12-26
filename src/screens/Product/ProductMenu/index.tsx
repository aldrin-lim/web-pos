import {
  ChevronRightIcon,
  PlusIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'

import './styles.css'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { useState } from 'react'
import SlidingTransition from 'components/SlidingTransition'
import ProductSelection from './screens/ProductSelection'

enum ProductMenuScreen {
  None = 'none',
  ProductSelection = 'productSelection',
}

const ProductMenu = () => {
  const navigate = useNavigate()

  const [activeScreen, setActiveScreen] = useState(ProductMenuScreen.None)
  return (
    <div
      className={`ProductMenu flex min-h-screen w-full flex-col gap-4 overflow-hidden bg-base-300 ${
        activeScreen === ProductMenuScreen.None ? 'h-full' : 'h-screen'
      }`}
    >
      <div className="section">
        <Toolbar
          items={[
            <div key={1} />,
            <ToolbarTitle key={2} title="Menu" />,
            <div key={3} />,
          ]}
        />
        <div className="flex w-full flex-row flex-wrap gap-4">
          <button className="btn btn-square  mt-1 flex h-[150px] w-[150px] flex-col border-2 border-dashed border-gray-300 ">
            <PlusIcon className="w-8 text-success" />
            Add Product
          </button>
          <button className="btn btn-square  mt-1 flex h-[150px] w-[150px] flex-col border-2 border-dashed border-gray-300 ">
            <PlusIcon className="w-8 text-success" />
            Add Product
          </button>
          <button className="btn btn-square  mt-1 flex h-[150px] w-[150px] flex-col border-2 border-dashed border-gray-300 ">
            <PlusIcon className="w-8 text-success" />
            Add Product
          </button>
          <button className="btn btn-square  mt-1 flex h-[150px] w-[150px] flex-col border-2 border-dashed border-gray-300 ">
            <PlusIcon className="w-8 text-success" />
            Add Product
          </button>
        </div>
        <div className="fixed bottom-10 left-0 right-0 flex justify-center ">
          <button className="CartButton btn mx-10 flex w-full max-w-md flex-shrink flex-row justify-center gap-4 rounded-md bg-purple-400 p-4 text-white">
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
        isVisible={activeScreen === ProductMenuScreen.ProductSelection}
        zIndex={10}
      >
        <ProductSelection />
      </SlidingTransition>
    </div>
  )
}

export default ProductMenu
