import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
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

import cash from '../../../assets/cash.svg'
import banktransfer from '../../../assets/banktransfer.svg'
import creditcard from '../../../assets/creditcard.svg'
import debitcard from '../../../assets/debitcard.svg'
import gcash from '../../../assets/gcash.svg'
import paymaya from '../../../assets/paymaya.svg'
import CurrencyInput from 'react-currency-input-field'
import SlidingTransition from 'components/SlidingTransition'
import { AnimatePresence } from 'framer-motion'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Payment, PaymentSchema } from '..'
import { useEffect } from 'react'
import PaymentSummary from '../PaymentSummary'
import PaymentCompleted from '../../PaymentCompleted'
import useFulfillOrder from 'hooks/useFulfillOrder'
import useGetShift from 'hooks/useGetTodayShift'
import useUser from 'hooks/useUser'

enum Screen {
  Summary = 'summary',
  Completed = 'completed',
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

type PaymentMethod = (typeof paymentMethods)[number]

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

const NextPayment = (props: PaymentProps) => {
  const { orders } = props
  const { taxRate } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const { fulfillOrder, isLoading } = useFulfillOrder()
  const { shift } = useGetShift()

  useEffect(() => {
    if (!location.state) {
      navigate(-1)
    }
  }, [location.state])

  const previousPayment = location.state.payment as Payment

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

  const { setFieldValue, values, errors, submitForm } = useFormik({
    initialValues: {
      method: '' as PaymentMethod,
      amountReceived: 0,
      amountPayable: 0,
      change: 0,
    } as Payment,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: toFormikValidationSchema(PaymentSchema),
    onSubmit: () => {
      navigate(Screen.Summary, {
        state: location.state,
      })
    },
  })

  const remainingPayable = totalOrderAmount - previousPayment.amountPayable

  const fulfillOrders = async () => {
    const payload = {
      orders,
      payments: [previousPayment, values],
      shiftId: shift?.id,
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

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('split-payment-2-amount-payable')?.focus()
    }, 100)
  }, [])

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

        <div className="flex h-full flex-col gap-4 pb-4">
          {/* Heading */}
          <div className="flex w-full flex-col gap-4 text-center">
            <h1 className="text-2xl text-white">Amount Payable</h1>
            <p className="text-4xl text-secondary">
              {formatToPeso(remainingPayable)}
            </p>

            {/* Previous Payment Summary */}

            <div className="mb-2 flex flex-col">
              <div className="flex w-full flex-row justify-between text-lg font-bold text-white">
                <p>
                  Payment 1 ({getPaymentMethodName(previousPayment.method)})
                </p>
                <p>{formatToPeso(previousPayment.amountPayable)}</p>
              </div>
              <div className="flex w-full flex-row justify-between text-white">
                <p>Amount Received</p>
                <p>{formatToPeso(previousPayment.amountReceived)}</p>
              </div>
              {previousPayment.method === 'cash' && (
                <div className="flex w-full flex-row justify-between text-secondary">
                  <p>Change</p>
                  <p>{formatToPeso(previousPayment.change)}</p>
                </div>
              )}
            </div>

            {/* Payment Method Item */}
            <div className="flex flex-col justify-start gap-2 text-left">
              <h1 className="text-white">Payment 2</h1>
              {/* Amount Payable */}
              <label className="form-control w-full ">
                {/* <div className="form-control-label  ">
                  <span className="label-text-alt text-gray-400">
                    Amount Payable
                  </span>
                </div> */}
                <CurrencyInput
                  id="split-payment-2-amount-payable"
                  type="text"
                  tabIndex={0}
                  className="input input-bordered w-full border-secondary text-center text-2xl text-white"
                  prefix={'₱'}
                  placeholder="P0.00"
                  inputMode="decimal"
                  allowNegativeValue={false}
                  onValueChange={(value) => {
                    setFieldValue('amountPayable', Number(value))
                  }}
                />
                {errors.amountPayable && (
                  <div className="label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {errors.amountPayable}
                    </span>
                  </div>
                )}
              </label>

              {/* Payment Method */}
              <label className="form-control w-full ">
                <select
                  className="join-item select select-bordered border-neutral bg-none"
                  onChange={(e) => {
                    setFieldValue('method', e.target.value as PaymentMethod)
                    if (e.target.value === 'cash') {
                      setFieldValue('change', 0)
                    }
                  }}
                >
                  <option disabled selected>
                    Select Payment Method
                  </option>
                  {paymentMethods.map((method) => {
                    return (
                      <option key={method} value={method}>
                        {getPaymentMethodName(method)}
                      </option>
                    )
                  })}
                </select>
                <ChevronDownIcon className="t- absolute right-[0.5rem] top-[15px] w-6 text-white" />
                {errors.method && (
                  <div className="label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {errors.method}
                    </span>
                  </div>
                )}
              </label>

              <label className="form-control w-full ">
                {/* <div className="absolute left-4 top-[3px] flex pl-[1px] align-top">
                  <span className="label-text-alt text-[8px] text-white">
                    Amount Received
                  </span>
                </div> */}
                <CurrencyInput
                  type="text"
                  tabIndex={0}
                  className="input input-bordered w-full border-neutral pl-4 pr-4"
                  prefix={'₱'}
                  placeholder="P0.00"
                  inputMode="decimal"
                  allowNegativeValue={false}
                  onValueChange={(value) => {
                    setFieldValue('amountReceived', Number(value))
                    if (values.method === 'cash') {
                      setFieldValue(
                        'change',
                        Number(value) - Number(values.amountPayable),
                      )
                    }
                  }}
                />
                {errors.amountReceived && (
                  <div className="label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {errors.amountReceived}
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>
          <button
            onClick={() => submitForm()}
            className="btn btn-primary mt-auto"
          >
            Done
          </button>
        </div>
      </div>
      <AnimatePresence>
        <Routes location={location} key={isParentScreen.toString()}>
          <Route
            path={`${Screen.Summary}/*`}
            element={
              <SlidingTransition>
                <PaymentSummary
                  isLoading={isLoading}
                  onPayClick={fulfillOrders}
                  orders={orders}
                  payments={[previousPayment, values]}
                />
              </SlidingTransition>
            }
          />
          <Route
            path={`${Screen.Completed}/*`}
            element={
              <SlidingTransition>
                <PaymentCompleted
                  orders={orders}
                  payments={[previousPayment, values]}
                />
              </SlidingTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default NextPayment
