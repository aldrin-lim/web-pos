import { useQueryClient } from '@tanstack/react-query'
import LoadingCover from 'components/LoadingCover'
import useGetOrder from 'hooks/useGetOder'
import { useLocation } from 'react-router-dom'
import { User } from 'types/user.type'
import { formatToPeso } from 'util/currency'

const Receipt = () => {
  const location = useLocation()

  const queryClient = useQueryClient()

  const orderId = location.state?.orderId
  const shiftId = location.state?.shiftId

  const user = queryClient.getQueryData(['user']) as User

  const { isLoading: isGetOrderLoading, order } = useGetOrder(
    orderId as string,
    shiftId as string,
  )

  const isLoading = isGetOrderLoading

  if (
    location.state === undefined ||
    orderId === undefined ||
    shiftId === undefined
  ) {
    return (
      <div>
        <h1>Invalid receipt</h1>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingCover />
  }

  return (
    <div className="h-full min-h-screen w-full">
      <div className="mx-auto flex h-full max-w-sm flex-col gap-2 p-4">
        <div>
          <h1 className="text-center text-lg font-bold">
            {user.businesses[0].name}
          </h1>
          <h2 className="text-center">{user.businesses[0].address}</h2>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <div className="">Receipt #: 0000001</div>
          <div className="">
            Staff: {user.firstName} {user.lastName}
          </div>
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
              <div className="col-span-2 text-right">{orderItem.quantity}</div>
              <div className="col-span-3 text-right">
                {formatToPeso(orderItem.gross)}
              </div>
            </div>
          ))}
        </div>

        <div className=" w-full border-b-2  border-black pt-2" />

        <div className="col-span-12 grid grid-cols-12 gap-4 font-bold">
          <div className="col-span-6">Total PHP</div>
          <div className="col-span-6 text-right">
            {formatToPeso(order?.totalNet ?? 0)}
          </div>
        </div>

        <div className=" mt-auto w-full border-b-2 border-dotted border-black pt-2" />

        <p className="text-center uppercase ">
          This serves as temporary receipt{' '}
        </p>
      </div>
    </div>
  )
}

export default Receipt
