import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'

const PaymentCompleted = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const goBackToCatalog = () => {
    navigate(AppPath.Catalog, { replace: true, state: { action: 'reset' } })
  }

  return (
    <>
      <div
        className={[
          'screen h-full pb-9',
          !isParentScreen ? 'hidden-screen' : '',
        ].join(' ')}
      >
        <Toolbar
          items={[
            <div key={1} />,
            <ToolbarTitle key="title" title="Completed" />,
          ]}
        />

        <div className="flex h-full flex-col gap-4">
          Completed
          <div className="mt-auto flex w-full flex-col gap-4">
            <button onClick={goBackToCatalog} className="btn btn-primary">
              New Order
            </button>
            <button className="btn btn-outline btn-primary">Receipt</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentCompleted
