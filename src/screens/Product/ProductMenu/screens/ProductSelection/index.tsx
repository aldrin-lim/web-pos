import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'

const ProductSelection = () => {
  return (
    <div className="section">
      <Toolbar
        items={[<div key={1} />, <ToolbarTitle key={2} title="Menu" />]}
      />
      Product selection
    </div>
  )
}

export default ProductSelection
