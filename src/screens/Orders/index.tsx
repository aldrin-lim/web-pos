import {
  ArchiveBoxArrowDownIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import useGetOrders from 'hooks/useGetOrders'
import moment from 'moment'
import React from 'react'
import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'
import { AppPath } from 'routes/AppRoutes.types'
import { formatToPeso } from 'util/currency'

const StatusChip = (props: {
  status: 'pending' | 'completed' | 'cancelled' | 'voided'
}) => {
  const { status } = props
  if (status === 'pending')
    return (
      <div className="badge badge-warning badge-outline py-3 text-xs font-bold text-white">
        Pending
      </div>
    )
  if (status === 'cancelled')
    return (
      <div className="badge badge-error badge-outline py-3 text-xs font-bold text-white">
        Cancelled
      </div>
    )
  if (status === 'voided')
    return (
      <div className="badge badge-neutral badge-outline py-3 text-xs font-bold text-white">
        Voided
      </div>
    )

  return (
    <div className="badge badge-success badge-outline py-3 text-xs font-bold text-white">
      Completed
    </div>
  )
}

const Orders = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const { orders } = useGetOrders()

  return (
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
            onClick={() => {
              navigate(AppPath.Catalog)
            }}
          />,
          <ToolbarTitle key="title" title="Orders" />,
        ]}
      />
      <div className="w-full ">
        <table className="table table-md">
          {orders &&
            orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <div className="mb-4 w-full rounded-lg border border-gray-300 ">
                  <div className="p-2">
                    <thead>
                      <tr>
                        <th className="text-xl font-bold text-neutral">
                          Order #{order.orderNo}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Date:</strong>{' '}
                          {moment(order.createdAt).format('MM/DD/YYYY hh:mm A')}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Total:</strong> {formatToPeso(order.totalNet)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Status:</strong>{' '}
                          <StatusChip status={order.status} />
                        </td>
                      </tr>
                    </tbody>
                  </div>
                  <div className="flex flex-row justify-center gap-3 bg-gray-100 p-2 py-3">
                    <button className="btn btn-primary btn-md">
                      <ArchiveBoxArrowDownIcon className="w-5" /> Void Order
                    </button>
                    {/* <button className="btn btn-accent btn-md">
                      View Order
                    </button> */}
                  </div>
                </div>
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
