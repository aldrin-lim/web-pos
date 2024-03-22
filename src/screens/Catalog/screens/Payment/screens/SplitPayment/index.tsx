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

import cash from '../../assets/cash.svg'
import banktransfer from '../../assets/banktransfer.svg'
import creditcard from '../../assets/creditcard.svg'
import debitcard from '../../assets/debitcard.svg'
import gcash from '../../assets/gcash.svg'
import paymaya from '../../assets/paymaya.svg'
import CurrencyInput from 'react-currency-input-field'
import SlidingTransition from 'components/SlidingTransition'
import { AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import NextPayment from './NextPayment'
import { useEffect } from 'react'
import useUser from 'hooks/useUser'

enum Screen {
  NextPayment = 'next-payment',
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

export const PaymentSchema = z.object({
  method: z.enum(paymentMethods, {
    required_error: 'Please select a payment method',
  }),
  amountReceived: z
    .number({
      required_error: 'Please enter the amount received',
      coerce: true,
    })
    .positive('Amount received must be greater than 0'),
  amountPayable: z
    .number({
      required_error: 'Please enter the amount payable',
      coerce: true,
    })
    .positive('Amount payable must be greater than 0'),
  change: z.number({
    required_error: 'Please enter the amount received',
    coerce: true,
  }),
})

export type Payment = z.infer<typeof PaymentSchema>

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

const SplitPayment = (props: PaymentProps) => {
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

  const { setFieldValue, values, errors, submitForm } = useFormik({
    initialValues: {
      method: '',
      amountReceived: 0,
      amountPayable: 0,
      change: 0,
    },
    validationSchema: toFormikValidationSchema(PaymentSchema),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      navigate(`${Screen.NextPayment}`, {
        state: {
          ...location.state,
          payment: {
            ...values,
            change: values.amountReceived - values.amountPayable,
          },
        },
      })
    },
  })

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('split-payment-1-amount-payable')?.focus()
    }, 200)
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
            <p className="text-3xl text-secondary">
              {formatToPeso(totalOrderAmount)}
            </p>

            {/* Payment Method Item */}
            <div className="flex flex-col justify-start gap-2 text-left">
              <h1 className="text-white">Payment 1</h1>
              {/* Amount Payable */}
              <label className="form-control w-full ">
                {/* <div className="form-control-label  ">
                  <span className="label-text-alt text-gray-400">
                    Amount Payable
                  </span>
                </div> */}
                <CurrencyInput
                  id="split-payment-1-amount-payable"
                  type="text"
                  tabIndex={1}
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
              <label className="form-control w-full text-white">
                <select
                  tabIndex={2}
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

              <label className="form-control w-full text-white">
                {/* <div className="absolute left-4 top-[3px] flex pl-[1px] align-top">
                  <span className="label-text-alt text-[8px] text-white">
                    Amount Received
                  </span>
                </div> */}
                <CurrencyInput
                  type="text"
                  tabIndex={3}
                  className="input input-bordered w-full border-neutral pl-4 pr-4"
                  prefix={'₱'}
                  placeholder="Amount Received"
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
            tabIndex={4}
            onClick={() => submitForm()}
            className="btn btn-primary mt-auto"
          >
            Split Payment 2
          </button>
        </div>
        {/* <pre className="text-xs">{JSON.stringify(values, null, 2)}</pre> */}
      </div>
      <AnimatePresence>
        <Routes location={location} key={isParentScreen.toString()}>
          <Route
            path={`${Screen.NextPayment}/*`}
            element={
              <SlidingTransition>
                <NextPayment orders={orders} />
              </SlidingTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default SplitPayment
