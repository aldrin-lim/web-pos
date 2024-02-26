import { XCircleIcon } from '@heroicons/react/24/solid'
import { useQueryClient } from '@tanstack/react-query'
import LoadingCover from 'components/LoadingCover'
import useGetOrder from 'hooks/useGetOder'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { User } from 'types/user.type'
import { formatToPeso } from 'util/currency'
import ShareButton from './components/ShareButton'
import { useMemo, useRef } from 'react'
import moment from 'moment'
import { toNumber } from 'lodash'

const Receipt = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const orderId = location.state?.orderId
  const shiftId = location.state?.shiftId

  const user = queryClient.getQueryData(['user']) as User

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
    <div className="h-screen  w-full print:max-w-screen-sm">
      <div className="flex flex-row justify-between print:hidden">
        <ShareButton
          fileName={`receipt-${order?.orderNo}.png`}
          elementToShare={ref.current}
        />
        <button
          onClick={() => navigate('/')}
          className="btn btn-ghost flex flex-row items-center gap-1"
        >
          <XCircleIcon className="w-6" />
        </button>
      </div>
      <div ref={ref} className="h-screen w-full bg-base-100">
        <div className="mx-auto flex h-[calc(100%-48px)] max-w-sm flex-col gap-2 p-4">
          <div>
            <h1 className="text-center text-lg font-bold">
              {user.businesses[0].name}
            </h1>
            <h2 className="text-center">{user.businesses[0].address}</h2>
          </div>
          <div className=" flex flex-col gap-1">
            <div className="">Receipt #: {order?.orderNo}</div>
            <div className="">
              Staff: {user.firstName} {user.lastName}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {order?.createdAt &&
              moment(order.createdAt).format('MMM DD YYYY, h:mm:ss a')}
          </div>

          <div className=" w-full border-b-2 border-dotted border-black pt-2" />

          <div className="flex w-full flex-col gap-2">
            <div className="col-span-12 grid grid-cols-12 gap-4 font-bold">
              <div className="col-span-4">Item</div>
              <div className="col-span-3">Price</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Amount</div>
            </div>
            {order?.orderItems.map((orderItem) => (
              <div
                className="col-span-12 grid grid-cols-12 gap-2"
                key={orderItem.id}
              >
                <div className="col-span-4">{orderItem.product.name}</div>
                <div className="col-span-3 text-right">
                  {formatToPeso(orderItem.price)}
                </div>
                <div className="col-span-2 text-right">
                  {orderItem.quantity}
                </div>
                <div className="col-span-3 text-right">
                  {formatToPeso(orderItem.gross)}
                </div>
              </div>
            ))}
          </div>

          {!!discount && discount > 0 && (
            <div className="flex w-full flex-col gap-2">
              <div className="col-span-12 grid grid-cols-12 gap-2">
                <div className="col-span-4">Discount</div>
                <div className="col-span-3 text-right">&nbsp;</div>
                <div className="col-span-2 text-right">&nbsp;</div>
                <div className="col-span-3 text-right">
                  {formatToPeso(discount)}
                </div>
              </div>
            </div>
          )}

          <div className=" w-full border-b-2  border-black pt-2" />

          <div className="col-span-12 grid grid-cols-12 gap-4 font-bold">
            <div className="col-span-6">Total PHP</div>
            <div className="col-span-6 text-right">
              {formatToPeso(order?.totalNet ?? 0)}
            </div>
          </div>

          <div className="mt-auto w-full border-b-2 border-dotted border-black pt-2" />

          <p className="text-center uppercase ">
            This serves as temporary receipt{' '}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Receipt
