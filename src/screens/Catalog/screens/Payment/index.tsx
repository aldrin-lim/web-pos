import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import {
  useNavigate,
  useLocation,
  useResolvedPath,
  Route,
  Routes,
} from 'react-router-dom'
import { Order } from 'screens/Catalog'
import Big from 'big.js'
import { toNumber } from 'lodash'
import { formatToPeso } from 'util/currency'

import cash from './assets/cash.svg'
import banktransfer from './assets/banktransfer.svg'
import creditcard from './assets/creditcard.svg'
import debitcard from './assets/debitcard.svg'
import gcash from './assets/gcash.svg'
import paymaya from './assets/paymaya.svg'
import SlidingTransition from 'components/SlidingTransition'
import { AnimatePresence } from 'framer-motion'
import SinglePayment from './screens/SinglePayment'
import SplitPayment from './screens/SplitPayment'
import useUser from 'hooks/useUser'

enum Screen {
  SinglePayment = 'single-payment',
  SplitPayment = 'split-payment',
}

type PaymentProps = {
  orders: Order[]
}

const paymentMethods = [
  'cash',
  'banktransfer',
  'creditcard',
  'debitcard',
  'gcash',
  'paymaya',
] as const

export type PaymentMethod = (typeof paymentMethods)[number]

export type Payment = {
  method: PaymentMethod
  amountReceived: number
  amountPayable: number
  change: number
}

export const getPaymentMethodImages = (method: PaymentMethod) => {
  switch (method) {
    case 'cash':
      return cash
    case 'banktransfer':
      return banktransfer
    case 'creditcard':
      return creditcard
    case 'debitcard':
      return debitcard
    case 'gcash':
      return gcash
    case 'paymaya':
      return paymaya
    default:
      return cash
  }
}

export const getPaymentMethodName = (method: PaymentMethod): string => {
  switch (method) {
    case 'cash':
      return 'Cash'
    case 'banktransfer':
      return 'Bank Transfer'
    case 'creditcard':
      return 'Credit Card'
    case 'debitcard':
      return 'Debit Card'
    case 'gcash':
      return 'GCash'
    case 'paymaya':
      return 'PayMaya'
    default:
      return 'Cash'
  }
}

const Payment = (props: PaymentProps) => {
  const { orders } = props
  const { taxRate } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

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
    if (order.product.applyTax && taxRate) {
      return new Big(acc)
        .add(
          new Big(price).add(
            new Big(price).times(new Big(taxRate ?? 0).div(100)),
          ),
        )
        .round(2)
        .toNumber()
    }

    return new Big(acc)
      .add(new Big(price).times(new Big(order.quantity)))
      .round(2)
      .toNumber()
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
            <ToolbarTitle key="title" title="Payment" />,
          ]}
        />

        <div className="flex h-full flex-col gap-4">
          {/* Heading */}
          <div className="flex w-full flex-col gap-2 text-center">
            <h1 className="text-2xl">Amount Payable</h1>
            <p className="text-3xl font-bold text-primary">
              {formatToPeso(totalOrderAmount)}
            </p>
          </div>

          {/* Payment methods */}
          <div className="flex flex-row flex-wrap justify-center gap-2">
            {paymentMethods.map((method) => {
              return (
                <button
                  onClick={() =>
                    navigate(Screen.SinglePayment, {
                      state: { paymentMethod: method },
                    })
                  }
                  key={method}
                  className="btn btn-outline flex h-auto w-min min-w-[155px] items-center py-6 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <img
                      className="w-[30px]"
                      src={getPaymentMethodImages(method)}
                    />
                    <p className="text-lg">{getPaymentMethodName(method)}</p>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="mt-10 flex flex-col gap-4 text-center ">
            <h1>OR</h1>
            <button
              onClick={() => navigate(Screen.SplitPayment)}
              className="btn btn-outline btn-primary"
            >
              Split Payment
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        <Routes location={location} key={isParentScreen.toString()}>
          <Route
            path={`${Screen.SinglePayment}/*`}
            element={
              <SlidingTransition>
                <SinglePayment orders={orders} />
              </SlidingTransition>
            }
          />
          <Route
            path={`${Screen.SplitPayment}/*`}
            element={
              <SlidingTransition>
                <SplitPayment orders={orders} />
              </SlidingTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default Payment
