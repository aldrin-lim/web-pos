import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { Order } from 'screens/Catalog'
import { Payment } from '../..'
import { formatToPeso } from 'util/currency'
import useGetTodayShift from 'hooks/useGetTodayShift'

type PaymentCompletedPrpos = {
  orders: Order[]
  payments: Payment[]
}

const PaymentCompleted = (props: PaymentCompletedPrpos) => {
  const { orders, payments } = props
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const { isLoading, shift } = useGetTodayShift()

  const orderId = location.state.orderId

  const goBackToCatalog = () => {
    navigate(AppPath.Catalog, { replace: true, state: { action: 'reset' } })
  }

  const totalAmountPayable = payments.reduce((acc, payment) => {
    return acc + payment.amountPayable
  }, 0)

  const totalChange = payments.reduce((acc, payment) => {
    if (payment.method === 'cash') {
      return acc + payment.change
    }
    return acc
  }, 0)

  const showReceipt = () => {
    navigate(AppPath.Receipt, { state: { orderId, shiftId: shift?.id } })
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
          <div className="flex w-full flex-col gap-2 text-center">
            <h1 className="text-2xl"> Change</h1>
            <p className="text-4xl font-bold text-primary">
              {formatToPeso(totalChange)}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 text-center">
            <h1 className="text-2xl">Payable </h1>
            <p className="text-3xl font-bold ">
              {formatToPeso(totalAmountPayable)}
            </p>
          </div>
          <div className="mt-auto flex w-full flex-col gap-4">
            <button onClick={goBackToCatalog} className="btn btn-primary">
              New Order
            </button>
            <button
              onClick={showReceipt}
              className="btn btn-outline btn-primary"
            >
              Receipt
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentCompleted
