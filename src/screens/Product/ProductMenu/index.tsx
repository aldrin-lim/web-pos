import './styles.css'
import { useCallback } from 'react'
import SlidingTransition from 'components/SlidingTransition'
import ProductSelection from './screens/ProductSelection'
import {
  ProductMenuActionType,
  ProductMenuActiveScreen,
  ProductMenuContextProvider,
  useProductMenuContext,
} from './context/ProductMenuContext'
import ProductCollection from './screens/ProductCollection'

const ProductMenuComponent = () => {
  const {
    state: { activeScreen },
    dispatch,
  } = useProductMenuContext()

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
      />

      <SlidingTransition
        direction="right"
        isVisible={activeScreen === ProductMenuActiveScreen.ProductSelection}
        zIndex={10}
      >
        <ProductSelection onBack={goBackToMainScreen} />
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
