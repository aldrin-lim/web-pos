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
        activeScreen === ProductMenuActiveScreen.None ? 'h-full' : 'h-screen'
      }`}
    >
      <ProductCollection
        onAddProduct={() =>
          setActiveScreen(ProductMenuActiveScreen.ProductSelection)
        }
        onProductClick={(product) => selectProductToOrder(product)}
      />

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
