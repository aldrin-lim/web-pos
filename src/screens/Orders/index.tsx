import { useAuth0 } from '@auth0/auth0-react'
import {
  ArchiveBoxArrowDownIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useGetOrders from 'hooks/useGetOrders'
import useGetTodayShift from 'hooks/useGetTodayShift'
import useVoidOrder from 'hooks/useVoidOrder'
import moment from 'moment'
import React from 'react'
import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { formatToPeso } from 'util/currency'
import OrderItem from './components/OrderItem'

const Orders = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const [showPinDialog, setShowPinDialog] = React.useState(false)
  const [setPin, setSetPin] = React.useState('')

  const { orders, isLoading: isOrdersLoading } = useGetOrders()
  const { shift, isLoading: isShiftLoading } = useGetTodayShift()
  const { voidOrder, isLoading: isVoiding } = useVoidOrder()

  const isLoading = isOrdersLoading || isShiftLoading

  const submitVoid = () => {}

  return (
    <div
      className={[
        'screen h-full pb-9',
        !isParentScreen ? 'hidden-screen' : '',
      ].join(' ')}
    >
      {/* <dialog
        open={showPinDialog}
        id="unsaved-changes-dialog"
        className="modal bg-black/30"
      >
        <div className="modal-box px-4">
          <h3 className="text-lg font-bold">Unsaved Changes</h3>
          <p className="py-4">
            There are unsaved changes. Do you want to leave without saving?
          </p>
          <div className="font-sm modal-action">
            <button className="btn">Keep editing</button>
            <button type="button" className="btn btn-primary">
              Leave without saving
            </button>
          </div>
        </div>
      </dialog> */}
      <Toolbar
        items={[
          <ToolbarButton
            key={'negative'}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => {
              navigate(AppPath.Catalog)
            }}
          />,
          <ToolbarTitle key="title" title="Orders" />,
        ]}
      />
      {isLoading && (
        <div className="flex flex-col gap-4">
          <div className="skeleton h-[283px] w-full rounded-lg" />
          <div className="skeleton h-[283px] w-full rounded-lg" />
          <div className="skeleton h-[283px] w-full rounded-lg" />
        </div>
      )}
      <div className="w-full ">
        <table className="table table-md">
          {orders &&
            orders.map((order) => (
              <React.Fragment key={order.id}>
                <OrderItem shiftId={shift?.id ?? ''} order={order} />
              </React.Fragment>
            ))}
          {/* <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order, index) => (
                <tr key={order.id}>
                  <th>{order.orderNo}</th>
                  <td>{moment(order.createdAt).format('MM/DD/YYYY')}</td>
                  <td>{formatToPeso(order.totalNet)}</td>
                  <td>{order.status}</td>
                  <td>
                    <div className="flex flex-row">
                      <button className="btn btn-primary btn-xs">
                        Void Order
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody> */}
        </table>
      </div>
    </div>
  )
}

export default Orders
