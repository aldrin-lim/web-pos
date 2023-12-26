import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import ProductSelectionGrid from './ProductSelectionGrid'

const ProductSelection = () => {
  return (
    <div className="section">
      <Toolbar
        items={[<div key={1} />, <ToolbarTitle key={2} title="Menu" />]}
      />
      <ProductSelectionGrid />
    </div>
  )
}

export default ProductSelection
