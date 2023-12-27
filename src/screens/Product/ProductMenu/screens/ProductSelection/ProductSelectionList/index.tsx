import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'

type ProductSelectionListProps = {
  onBack: () => void
}

const ProductSelectionList = (props: ProductSelectionListProps) => {
  const { onBack } = props
  return (
    <div className="section sub-screen">
      <Toolbar
        items={[
          <ToolbarButton
            key={2}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={onBack}
          />,
          <ToolbarTitle key={2} title="All Products" />,
        ]}
      />
      List
    </div>
  )
}

export default ProductSelectionList
