import { XCircleIcon } from '@heroicons/react/24/solid'
import { useQueryClient } from '@tanstack/react-query'
import LoadingCover from 'components/LoadingCover'
import useGetOrder from 'hooks/useGetOder'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { User } from 'types/user.type'
import { formatToPeso } from 'util/currency'
import ShareButton from './components/ShareButton'
import { useMemo, useRef } from 'react'
import moment from 'moment-timezone'
import Big from 'big.js'
import { toNumber } from 'lodash'
import {
  PaymentMethod,
  getPaymentMethodName,
} from 'screens/Catalog/screens/Payment'

const Receipt = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const orderId = location.state?.orderId
  const shiftId = location.state?.shiftId

  const user = queryClient.getQueryData(['user']) as User
  const taxRate = user.businesses[0].tax?.amount ?? 0

  const ref = useRef<HTMLDivElement>(null)

  const { isLoading: isGetOrderLoading, order } = useGetOrder(
    orderId as string,
    shiftId as string,
  )

  const discount = useMemo(() => {
    if (order?.totalDiscount && order?.totalGross) {
      return order.totalGross - order.totalDiscount
    }
    return 0
  }, [order?.totalDiscount, order?.totalGross])

  const tax = useMemo(() => {
    const totalTax = order?.orderItems.reduce((acc, order) => {
      if (order.product.applyTax === false) {
        return acc
      }
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

      price = price * order.quantity

      return new Big(acc)
        .add(new Big(price).times(new Big(taxRate ?? 0).div(100)))
        .round(2)
        .toNumber()
    }, 0)

    return totalTax
  }, [order?.orderItems, taxRate])

  const orderTotal = useMemo(() => {
    const total = new Big(order?.totalNet ?? 0).round(2).toNumber()
    if (tax) {
      return new Big(total).add(tax).round(2).toNumber()
    }

    return total
  }, [order?.totalNet, tax])

  const paymentMethods = useMemo(() => {
    const paymentDetails = ([order?.sale] ?? []).reduce(
      (acc, sale) => {
        sale &&
          sale.payments.forEach((payment) => {
            if (acc[payment.method]) {
              acc[payment.method] += payment.amountReceived - payment.change
            } else {
              acc[payment.method] = payment.amountReceived - payment.change
            }
          })

        return acc
      },
      {} as Record<PaymentMethod, number>,
    )

    const formattedPaymentDetails: Record<string, string> = {}

    for (const key in paymentDetails) {
      formattedPaymentDetails[getPaymentMethodName(key as PaymentMethod)] =
        formatToPeso(paymentDetails[key as PaymentMethod])
    }

    return formattedPaymentDetails
  }, [order?.sale])

  const paymentsRecievedPerMethod = useMemo(() => {
    const paymentDetails = ([order?.sale] ?? []).reduce(
      (acc, sale) => {
        sale &&
          sale.payments.forEach((payment) => {
            if (payment.method === 'cash') {
              if (!acc['Cash Received']) {
                acc['Cash Received'] = 0
                acc['Change'] = 0
              }
              acc['Cash Received'] += payment.amountReceived
              acc['Change'] += payment.change
            }
          })

        return acc
      },
      { 'Cash Received': 0, Change: 0 },
    )

    return paymentDetails
  }, [order?.sale])

  const isLoading = isGetOrderLoading

  if (
    location.state === undefined ||
    orderId === undefined ||
    shiftId === undefined
  ) {
    console.error('Invalid Receipt', {
      orderId,
      shiftId,
      location,
    })
    return <Navigate to={'/'} replace />
  }

  if (isLoading) {
    return <LoadingCover />
  }

  return (
    <div className="min-h-screen  w-full bg-neutral pb-2 pt-2 print:max-w-screen-sm">
      <div className="flex flex-row justify-between pr-6 pt-2 text-gray-900 print:hidden">
        <ShareButton
          fileName={`receipt-${order?.orderNo}.png`}
          elementToShare={ref.current}
        />
        <a onClick={() => navigate('/')} className="flex flex-row items-center">
          Close
        </a>
      </div>
      <div
        id="receipt-container"
        ref={ref}
        className="min-h-screen  w-full bg-neutral pb-2 pt-2 text-black"
      >
        <div className="mx-auto flex h-[calc(100%-48px)] max-w-sm flex-col gap-2 p-4">
          <div className="mb-2">
            <h1 className="mb-2 text-center text-lg font-bold leading-6 text-black">
              {user.businesses[0].name}
            </h1>
            <div>
              <h2 className="text-center text-sm">
                {user.businesses[0].address}
              </h2>
              <h2 className="text-center text-sm">TIN: 123-456-789-101</h2>
            </div>
          </div>
          <div className=" flex flex-col gap-1">
            <div className="">Receipt #: {order?.orderNo}</div>
            <div>
              {order?.createdAt &&
                moment(order.createdAt)
                  .tz('Asia/Manila')
                  .format('MMM DD YYYY, h:mm:ss a')}
            </div>
            <div className="">
              Cashier: {user.firstName} {user.lastName}
            </div>
            <div className="">Customer:</div>
            <div className="">Order Type:</div>
          </div>
          <div className="flex flex-col gap-1"></div>

          <div className=" w-full border-b-2 border-dotted border-black pt-2" />

          <div className="flex w-full flex-col gap-2">
            <div className="col-span-12 grid grid-cols-12 gap-2 ">
              <div className="col-span-4">Item</div>
              {/* <div className="col-span-3 text-right"></div> */}
              <div className="col-span-4 text-right">Qty</div>
              <div className="col-span-4 text-right">Price</div>
            </div>
            {order?.orderItems.map((orderItem) => (
              <div
                className="col-span-12 grid grid-cols-12 gap-2"
                key={orderItem.id}
              >
                <div className="col-span-4">{orderItem.product.name}</div>
                <div className="col-span-4 text-right">
                  {orderItem.quantity}
                </div>
                <div className="col-span-4 text-right">
                  {/* {formatToPeso(orderItem.price)} */}
                  {formatToPeso(orderItem.gross)}
                </div>
                {/* <div className="col-span-3 text-right">
                  {formatToPeso(orderItem.gross)}
                </div> */}
              </div>
            ))}
          </div>

          <div className=" w-full border-b-2  border-black pt-2" />

          <div className="col-span-12 grid grid-cols-12 gap-4">
            <div className="col-span-6">Subtotal Php</div>
            <div className="col-span-6 text-right">
              {formatToPeso(order?.totalNet ?? 0)}
            </div>
          </div>

          {!!discount && discount > 0 && (
            <div className="flex w-full flex-col gap-2">
              <div className="col-span-12 grid grid-cols-12 gap-2">
                <div className="col-span-7">Sr Citizen Discount (5%)</div>
                <div className="col-span-5 text-right">
                  {formatToPeso(discount)}
                </div>
              </div>
            </div>
          )}

          {!!tax && tax > 0 && (
            <div className="flex w-full flex-col gap-2">
              <div className="col-span-12 grid grid-cols-12 gap-2">
                <div className="col-span-7">Tax excl. (12%) ({taxRate}%)</div>
                <div className="col-span-5 text-right">{formatToPeso(tax)}</div>
              </div>
            </div>
          )}

          <div className=" w-full border-b-2  border-black pt-2" />

          {!!orderTotal && orderTotal > 0 && (
            <div className="flex w-full flex-col gap-2">
              <div className="col-span-12 grid grid-cols-12 gap-2">
                <div className="col-span-7">Total Due</div>
                <div className="col-span-5 text-right">
                  {formatToPeso(orderTotal)}
                </div>
              </div>
            </div>
          )}

          <div className="w-full border-b-2 border-dotted border-black pt-2" />
          <div className="">Payment Information</div>
          {Object.entries(paymentsRecievedPerMethod ?? {}).map(
            ([key, value]) => {
              return (
                <div key={key} className=" grid grid-cols-12 gap-2">
                  <div className="col-span-7">{key}</div>
                  <div className="col-span-5 text-right">
                    {formatToPeso(value)}
                  </div>
                </div>
              )
            },
          )}

          <div className="w-full border-b-2 border-dotted border-black pt-2" />
          {Object.entries(paymentMethods ?? {}).map(([key, value]) => {
            return (
              <div key={key} className=" grid grid-cols-12 gap-2">
                <div className="col-span-7">{key}</div>
                <div className="col-span-5 text-right">{value}</div>
              </div>
            )
          })}

          <div className="mt-auto w-full border-b-2 border-dotted border-black pt-2" />
          <div className="flex w-full flex-col gap-2">
            <div className="col-span-12 grid grid-cols-12 gap-2">
              <div className="col-span-7">Split Payment</div>
              <div className="col-span-5 text-right"></div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <div className="col-span-12 grid grid-cols-12 gap-2">
              <div className="col-span-7">Cash</div>
              <div className="col-span-5 text-right"></div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <div className="col-span-12 grid grid-cols-12 gap-2">
              <div className="col-span-7">Card</div>
              <div className="col-span-5 text-right"></div>
            </div>
          </div>
          <div className="mt-auto w-full border-b-2 border-dotted border-black pt-2" />

          <p className="flex h-[37px] flex-row content-center items-center justify-center text-center uppercase">
            This serves as temporary receipt{' '}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Receipt
