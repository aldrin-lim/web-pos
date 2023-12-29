import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import ProductSelectionGrid from './ProductSelectionGrid'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import { useCallback, useState } from 'react'
import SlidingTransition from 'components/SlidingTransition'
import ProductSelectionList from './ProductSelectionList'
import useGetProductCollection from 'hooks/useGetProductCollection'

enum ActiveScreen {
  None = 'none',
  ProductList = 'list',
}

type ProductSelectionProps = {
  onBack: () => void
}

const ProductSelection = (props: ProductSelectionProps) => {
  const { onBack } = props

  const [activeScreen, setActiveScreen] = useState(ActiveScreen.None)

  const goBackToProductSelectionScreen = useCallback(() => {
    setActiveScreen(ActiveScreen.None)
  }, [])

  const showProductSelectionList = () =>
    setActiveScreen(ActiveScreen.ProductList)

  const selectProduct = useCallback(async (productId: string) => {
    setActiveScreen(ActiveScreen.None)
  }, [])

  const { productCollection, isLoading } = useGetProductCollection()

  return (
    <div
      className={`ProductSelection main-screen ${
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

        <ProductSelectionGrid onViewAll={showProductSelectionList} />
      </div>
      <SlidingTransition
        direction="right"
        isVisible={activeScreen === ActiveScreen.ProductList}
        zIndex={10}
      >
        <ProductSelectionList onBack={goBackToProductSelectionScreen} />
      </SlidingTransition>
    </div>
  )
}

export default ProductSelection
