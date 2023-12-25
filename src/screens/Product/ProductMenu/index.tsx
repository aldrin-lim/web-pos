import {
  PlusIcon,
} from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'

import './styles.css'
import { useNavigate } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
const ProductMenu = () => {
  const navigate = useNavigate()
  return (
    <div className="ProductMenu section flex flex-col gap-4">
      <Toolbar
        items={[
          <div key={1} />,
          <ToolbarTitle key="title" title="Products" />,
          <ToolbarButton
            key="save"
            icon={<PlusIcon className="w-6" />}
            onClick={() => navigate(AppPath.AddProduct)}
          />,
        ]}
      />
      Oy
    </div>
  )
}

export default ProductMenu
