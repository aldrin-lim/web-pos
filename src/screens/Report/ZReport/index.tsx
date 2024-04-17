import LoadingCover from 'components/LoadingCover'
import useGetShiftReport from 'hooks/useGetShiftReport'
import moment from 'moment-timezone'
import { useMemo } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  PaymentMethod,
  getPaymentMethodName,
} from 'screens/Catalog/screens/Payment'
import { formatToPeso } from 'util/currency'

const ZReport = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const shiftId = location.state?.shiftId

  const { isLoading: isGetShiftReporting, report } = useGetShiftReport(shiftId)

  const isLoading = isGetShiftReporting

  const paymentsRecievedPerMethod = useMemo(() => {
    const paymentDetails = (report?.sales ?? []).reduce(
      (acc, sale) => {
        sale.payments.forEach((payment) => {
          if (acc[payment.method]) {
            acc[payment.method] += payment.amountReceived - payment.change
          } else {
            acc[payment.method] = payment.amountReceived - payment.change
          }
        })

        return acc
      },
      {} as Record<string, number>,
    )

    const formattedPaymentDetails: Record<string, string> = {}

    for (const key in paymentDetails) {
      formattedPaymentDetails[getPaymentMethodName(key as PaymentMethod)] =
        formatToPeso(paymentDetails[key])
    }

    return formattedPaymentDetails
  }, [report?.sales])

  const productsSold = useMemo(() => {
    // Return value {
    //   name: product name
    //   quantity: quantity,
    //   total price
    // }

    const products = (report?.sales ?? []).reduce(
      (acc, sale) => {
        sale.order.orderItems.forEach((orderItem) => {
          if (acc[orderItem.product.name]) {
            acc[orderItem.product.name].quantity += orderItem.quantity
            acc[orderItem.product.name].totalPrice += orderItem.net
          } else {
            acc[orderItem.product.name] = {
              quantity: orderItem.quantity,
              totalPrice: orderItem.net,
            }
          }
        })

        return acc
      },
      {} as Record<string, { quantity: number; totalPrice: number }>,
    )

    return products
  }, [report?.sales])

  if (!shiftId) {
    return <Navigate replace to={'/'} />
  }

  if (isLoading) {
    return <LoadingCover />
  }

  if (!report) {
    return <div>Shift not found</div>
  }

  const { shift, sales } = report

  const opened =
    shift?.openedTime &&
    moment(shift.openedTime)
      .tz('Asia/Manila')
      .format('MMM. d, yyyy @ hh:mm:ss A')

  const closed =
    shift?.closedTime &&
    moment(shift.closedTime)
      .tz('Asia/Manila')
      .format('MMM. d, yyyy @ hh:mm:ss A')

  const grossSales = sales.reduce((acc, sale) => {
    return (
      acc +
      sale.order.orderItems.reduce((acc, orderItem) => {
        return acc + orderItem.gross
      }, 0)
    )
  }, 0)

  const netSales = sales.reduce((acc, sale) => {
    return (
      acc +
      sale.order.orderItems.reduce((acc, orderItem) => {
        return acc + orderItem.net
      }, 0)
    )
  }, 0)

  const totalDiscounts = sales.reduce((acc, sale) => {
    return (
      acc +
      sale.order.orderItems.reduce((acc, orderItem) => {
        return acc + (orderItem.gross - orderItem.net)
      }, 0)
    )
  }, 0)

  // format the paymentsRecievedPerMethod to peso

  return (
    <div className="min-h-screen w-full bg-neutral pb-2 pt-2">
      <div className="flex flex-col items-end pr-6 pt-2 text-gray-900">
        <a onClick={() => navigate('/')} className="">
          Close
        </a>
      </div>
      <div className="mx-auto flex h-full max-w-md flex-col gap-10 bg-neutral p-6 text-black">
        <div className="item flex flex-col gap-1">
          <h1 className="border-b-2 border-black pb-4  text-center text-2xl font-bold leading-6 text-black">
            Z-Report
          </h1>
          <h2 className="mb-4 mt-4 text-center text-sm">
            POS Register: 1 - Shift 1
          </h2>
          {/* Opening */}
          <div className="grid grid-cols-12 gap-2 text-sm">
            <div className="opening-date col-span-6">Opened: {opened}</div>
            <div className="opening-staff col-span-6">
              Staff: {shift.openedBy?.firstName} {shift.closedBy?.lastName}
            </div>
          </div>
          {/* Closing */}
          <div className="grid grid-cols-12 gap-2 text-sm">
            <div className="closing-date col-span-6">Closed: {closed}</div>
            <div className="closing-staff col-span-6">
              Staff: {shift.closedBy?.firstName} {shift.closedBy?.lastName}
            </div>
          </div>
        </div>

        {/* Sales Report */}
        <div className="item flex flex-col gap-1">
          <h1 className="mb-4 border-b-2 border-black pb-4 text-center text-2xl uppercase text-black">
            Sales Summary
          </h1>
          <div className="flex flex-row justify-between">
            <div className="opening-date">Sales</div>
            <div className="opening-staff">{formatToPeso(grossSales)}</div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="opening-date">Discounts</div>
            <div className="opening-staff">{formatToPeso(totalDiscounts)}</div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="opening-date">Tax excl. (12%)</div>
            <div className="opening-staff"></div>
          </div>
          <div className="mt-4 flex flex-row justify-between border-t-2 border-black pt-4 font-bold">
            <div className="opening-date">Total Sales</div>
            <div className="opening-staff">{formatToPeso(netSales)}</div>
          </div>
        </div>

        {/* Transactions */}
        <div className="item flex flex-col gap-1">
          <h1 className="mb-4 border-b-2 border-black pb-4 text-center text-2xl uppercase text-black">
            No. Transactions
          </h1>
          <div className=" grid grid-cols-12 gap-2 border-b-2 border-black py-2">
            <div className="col-span-7">Product</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-3 text-right">Total</div>
          </div>
          {Object.entries(productsSold ?? {}).map(([key, value]) => (
            <div key={key} className=" grid grid-cols-12 gap-2">
              <div className="col-span-7">{key}</div>
              <div className="col-span-2">{value.quantity}</div>
              <div className="col-span-3 text-right">
                {formatToPeso(value.totalPrice)}
              </div>
            </div>
          ))}
          <div className="mt-4 flex flex-row justify-between border-t-2 border-black pt-4 font-bold">
            <div className="opening-date">Total Transactions</div>
            <div className="opening-staff">0</div>
          </div>
        </div>

        {/* Payments */}
        <div className="item flex flex-col gap-1">
          <h1 className="mb-4 border-b-2 border-black pb-4 text-center text-2xl uppercase text-black">
            Payment Information
          </h1>
          <div className="grid grid-cols-12 gap-2 border-b-2 border-black py-2">
            <div className="col-span-7">Method</div>
            <div className="col-span-5 text-right">Total</div>
          </div>
          {Object.entries(paymentsRecievedPerMethod ?? {}).map(
            ([key, value]) => (
              <div key={key} className=" grid grid-cols-12 gap-2">
                <div className="col-span-7">{key}</div>
                <div className="col-span-5 text-right">{value}</div>
              </div>
            ),
          )}
          <div className="mt-4 flex flex-row justify-between border-t-2 border-black pt-4 font-bold">
            <div className="opening-date">Total</div>
            <div className="opening-staff">{formatToPeso(0)}</div>
          </div>
        </div>

        {/* Discount */}
        <div className="item flex flex-col gap-1">
          <h1 className="mb-4 border-b-2 border-black pb-4 text-center text-2xl uppercase text-black">
            Discounts
          </h1>
          <div className=" grid grid-cols-12 gap-2 border-b-2 border-black py-2">
            <div className="col-span-7">Discount</div>
            <div className="col-span-2">Count</div>
            <div className="col-span-3 text-right">Amount</div>
          </div>
          {Object.entries(productsSold ?? {}).map(([key, value]) => (
            <div key={key} className=" grid grid-cols-12 gap-2">
              <div className="col-span-7">{key}</div>
              <div className="col-span-2">{value.quantity}</div>
              <div className="col-span-3 text-right">
                {formatToPeso(value.totalPrice)}
              </div>
            </div>
          ))}
          <div className="mt-4 flex flex-row justify-between border-t-2 border-black pt-4 font-bold">
            <div className="opening-date">Total</div>
            <div className="opening-staff">{formatToPeso(0)}</div>
          </div>
        </div>

        {/* Address */}
        <div className="mt-5 grid gap-2 border-t-2 border-black pb-4  pt-4 text-sm">
          <h2 className="text-center text-sm">
            More Information for POS Register: 1 - Shift 1
          </h2>
          <div>
            <h2 className="text-center text-sm">Opening: {opened}</h2>
            <h2 className="text-center text-sm">Opening Cash: ₱100.00</h2>
            <h2 className="text-center text-sm">
              Opening Staff: {shift.openedBy?.firstName}{' '}
              {shift.closedBy?.lastName}
            </h2>
          </div>

          <div>
            <h2 className="text-center text-sm">Closing: {closed}</h2>
            <h2 className="text-center text-sm">Closing Cash: ₱100.00</h2>
            <h2 className="text-center text-sm">
              Closing Staff: {shift.closedBy?.firstName}{' '}
              {shift.closedBy?.lastName}
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZReport
