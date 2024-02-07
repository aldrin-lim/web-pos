import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { Order } from 'screens/Catalog'
import { formatToPeso } from 'util/currency'
import Big from 'big.js'
import { toNumber } from 'lodash'
import { Payment } from '..'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import { getPaymentMethodName } from '../../..'

type PaymentCompletedPrpos = {
  orders: Order[]
  payments: Payment[]
  onPayClick: () => void
}

const PaymentSummary = (props: PaymentCompletedPrpos) => {
  const { orders, payments, onPayClick } = props
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const goBackToCatalog = () => {
    navigate(AppPath.Catalog, { replace: true, state: { action: 'reset' } })
  }

  const totalAmountPayable = payments.reduce((acc, payment) => {
    return acc + payment.amountPayable
  }, 0)

  const totalChange = payments.reduce((acc, payment) => {
    return acc + payment.change
  }, 0)

  const totalOrderAmount = orders.reduce((acc, order) => {
    let price = order.product.price

    if (order.discount && order.discount.type === 'fixed') {
      price = toNumber(
        new Big(order.product.price)
          .sub(new Big(order.discount.amount))
          .round(2)
          .toFixed(2),
      )
    }
    if (order.discount && order.discount.type === 'percentage') {
      price = toNumber(
        new Big(order.product.price)
          .sub(
            new Big(order.product.price).times(
              new Big(order.discount.amount).div(100),
            ),
          )
          .round(2)
          .toFixed(2),
      )
    }
    return acc + price * order.quantity
  }, 0)

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
            <ToolbarButton
              key={'negative'}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={() => navigate(-1)}
            />,
            <ToolbarTitle key="title" title="Split Payment" />,
          ]}
        />

        <div className="flex h-full flex-col gap-4">
          {payments.map((payment, index) => {
            return (
              <div key={index} className="mb-2 flex flex-col">
                <div className="flex w-full flex-row justify-between text-lg font-bold">
                  <p>
                    Payment {index + 1} ({getPaymentMethodName(payment.method)})
                  </p>
                  <p>{formatToPeso(payment.amountPayable)}</p>
                </div>
                <div className="flex w-full flex-row justify-between">
                  <p>Amount Received</p>
                  <p>{formatToPeso(payment.amountReceived)}</p>
                </div>
                {payment.method === 'cash' && (
                  <div className="flex w-full flex-row justify-between text-primary">
                    <p>Change</p>
                    <p>{formatToPeso(payment.change)}</p>
                  </div>
                )}
              </div>
            )
          })}
          <div className="mt-auto flex w-full flex-col gap-4">
            <button onClick={onPayClick} className="btn btn-primary">
              Pay
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentSummary
