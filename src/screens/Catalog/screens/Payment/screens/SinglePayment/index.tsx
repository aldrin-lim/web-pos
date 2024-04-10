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

import cash from '../../assets/cash.svg'
import banktransfer from '../../assets/banktransfer.svg'
import creditcard from '../../assets/creditcard.svg'
import debitcard from '../../assets/debitcard.svg'
import gcash from '../../assets/gcash.svg'
import paymaya from '../../assets/paymaya.svg'
import { useEffect, useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import PaymentCompleted from '../PaymentCompleted'
import { AppPath } from 'routes/AppRoutes.types'
import useFulfillOrder from 'hooks/useFulfillOrder'
import useGetShift from 'hooks/useGetTodayShift'
import useUser from 'hooks/useUser'
import { FulFillOrderValidationSchema } from 'api/order/fulfillOrder'
import { v4 } from 'uuid'
import { Customer } from 'types/customer.types'

enum Screen {
  Completed = 'completed',
}

type PaymentProps = {
  orders: Order[]
  customer?: Customer
}

const paymentMethods = [
  'cash',
  'banktransfer',
  'creditcard',
  'debitcard',
  'gcash',
  'paymaya',
] as const

type PaymentMethod = (typeof paymentMethods)[number]

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

export const getPaymentMethodName = (method: PaymentMethod) => {
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

const SinglePayment = (props: PaymentProps) => {
  const { orders, customer } = props
  const { taxRate } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const paymentMethod = location.state.paymentMethod as PaymentMethod

  const { fulfillOrder, isLoading } = useFulfillOrder()
  const { shift } = useGetShift()

  useEffect(() => {
    if (!location.state?.paymentMethod) {
      navigate(AppPath.Catalog)
    }
  }, [location.state])

  const [amountReceived, setAmountReceived] = useState<string | undefined>()
  const [change, setChange] = useState<number>(0)

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

  useEffect(() => {
    setChange(Number(amountReceived) - totalOrderAmount)
  }, [amountReceived, totalOrderAmount])

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('single-payment-amount-received')?.focus()
    }, 200)
  }, [])

  const fulfillOrders = async () => {
    const payload = {
      orders,
      payments: [
        {
          amountPayable: totalOrderAmount,
          amountReceived: Number(amountReceived),
          change,
          method: paymentMethod ?? 'cash',
        },
      ],
      shiftId: shift?.id,
    } as FulFillOrderValidationSchema

    if (customer && !Object.values(customer).every((v) => v === '')) {
      payload.customer = {
        id: v4(),
        ...customer,
      }
    }
    const order = await fulfillOrder(payload)
    navigate(Screen.Completed, {
      state: {
        ...location.state,
        orderId: order?.id,
      },
      replace: true,
    })
  }

  return (
    <>
      <div className={['pb-9', isParentScreen ? 'screen' : 'hidden'].join(' ')}>
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

        <div className="flex  flex-col gap-4 pb-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <img
              className="w-[30px]"
              src={getPaymentMethodImages(paymentMethod)}
            />
            <p className="text-lg">{getPaymentMethodName(paymentMethod)}</p>
          </div>
          {/* Heading */}
          <div className="flex w-full flex-col gap-2 text-center">
            <h1 className="text-2xl">Amount Payable</h1>
            <p className="text-3xl font-bold text-primary">
              {formatToPeso(totalOrderAmount)}
            </p>
          </div>
          {/* Payment Input */}
          <label className="form-control flex w-full flex-col gap-4 text-center">
            <h1 className="text-2xl">Amount Received</h1>
            <CurrencyInput
              id="single-payment-amount-received"
              type="text"
              tabIndex={1}
              className="input input-lg input-bordered w-full text-center text-xl"
              prefix={'₱'}
              placeholder="P0.00"
              inputMode="decimal"
              allowNegativeValue={false}
              onValueChange={(value) => {
                setAmountReceived(value)
              }}
            />
          </label>
          <button
            onClick={fulfillOrders}
            disabled={!amountReceived || isLoading}
            className="btn btn-primary mt-auto"
          >
            Pay
          </button>
        </div>
        <pre className="max-w-xs text-xs">
          {JSON.stringify(orders, null, 2)}
        </pre>
      </div>
      <Routes location={location} key={isParentScreen.toString()}>
        <Route
          path={`${Screen.Completed}/*`}
          element={
            <PaymentCompleted
              orders={orders}
              payments={[
                {
                  amountPayable: totalOrderAmount,
                  amountReceived: Number(amountReceived),
                  change,
                  method: paymentMethod ?? 'cash',
                },
              ]}
            />
          }
        />
      </Routes>
    </>
  )
}

export default SinglePayment
