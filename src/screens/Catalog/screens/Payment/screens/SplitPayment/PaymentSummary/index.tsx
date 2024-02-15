import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'
import { Order } from 'screens/Catalog'
import { formatToPeso } from 'util/currency'
import { Payment } from '..'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import { getPaymentMethodName } from '../../..'

type PaymentCompletedPrpos = {
  orders: Order[]
  payments: Payment[]
  onPayClick: () => void
  isLoading?: boolean
}

const PaymentSummary = (props: PaymentCompletedPrpos) => {
  const { payments, onPayClick, isLoading } = props
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

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
            <button
              onClick={onPayClick}
              disabled={isLoading}
              className="btn btn-primary"
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentSummary
