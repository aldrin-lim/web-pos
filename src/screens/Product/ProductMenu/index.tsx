import './styles.css'
import { useCallback, useState } from 'react'
import SlidingTransition from 'components/SlidingTransition'
import ProductSelection from './screens/ProductSelection'
import {
  ProductMenuActionType,
  ProductMenuActiveScreen,
  ProductMenuContextProvider,
  useProductMenuContext,
} from './context/ProductMenuContext'
import ProductCollection from './screens/ProductCollection'
import { Product } from 'types/product.types'
import OrderSelection from './screens/OrderSelection'
import { ShoppingCartIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const ProductMenuComponent = () => {
  const {
    state: { activeScreen },
    dispatch,
  } = useProductMenuContext()

  const [seletectedProductToOrder, setSeletectedProductToOrder] =
    useState<Product | null>(null)

  const goBackToMainScreen = useCallback(() => {
    dispatch({
      type: ProductMenuActionType.UpdateActiveScreen,
      payload: {
        screen: ProductMenuActiveScreen.None,
      },
    })
  }, [dispatch])

  const setActiveScreen = (screen: ProductMenuActiveScreen) => {
    dispatch({
      type: ProductMenuActionType.UpdateActiveScreen,
      payload: {
        screen,
      },
    })
  }

  const selectProductToOrder = (product: Product) => {
    setSeletectedProductToOrder(product)
    dispatch({
      type: ProductMenuActionType.UpdateActiveScreen,
      payload: {
        screen: ProductMenuActiveScreen.OrderSelection,
      },
    })
  }

  return (
    <div
      className={`ProductMenu main-screen ${
        activeScreen === ProductMenuActiveScreen.None ? 'h-full' : ' h-screen '
      }`}
    >
      <ProductCollection
        onAddProduct={() =>
          setActiveScreen(ProductMenuActiveScreen.ProductSelection)
        }
        onProductClick={(product) => selectProductToOrder(product)}
      />
      {activeScreen === ProductMenuActiveScreen.None && (
        <div className="CartButton fixed bottom-10 left-0 right-0 flex justify-center ">
          <button className="CartButton btn mx-4 flex w-full max-w-md flex-shrink flex-row justify-center gap-4 rounded-md bg-purple-400 p-4 text-white shadow-md">
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
      )}

      <SlidingTransition
        direction="right"
        isVisible={activeScreen === ProductMenuActiveScreen.ProductSelection}
        zIndex={10}
      >
        <ProductSelection onBack={goBackToMainScreen} />
      </SlidingTransition>

      <SlidingTransition
        direction="right"
        isVisible={activeScreen === ProductMenuActiveScreen.OrderSelection}
        zIndex={10}
      >
        {seletectedProductToOrder && (
          <OrderSelection
            product={seletectedProductToOrder}
            onBack={goBackToMainScreen}
          />
        )}
      </SlidingTransition>
    </div>
  )
}

const ProductMenu = () => (
  <ProductMenuContextProvider>
    <ProductMenuComponent />
  </ProductMenuContextProvider>
)

export default ProductMenu
