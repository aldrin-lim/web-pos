import React, { useState } from 'react'
import moment from 'moment-timezone'
import {
  ArchiveBoxArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'
import { formatToPeso } from 'util/currency'
import { z } from 'zod'
import { OrderSchema } from 'types/report.types'
import useVoidOrder from 'hooks/useVoidOrder'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { toast } from 'react-toastify'

interface OrderItemProps {
  order: z.infer<typeof OrderSchema>
  shiftId: string
}

const OrderItem: React.FC<OrderItemProps> = ({ order, shiftId }) => {
  const [showPinDialog, setShowPinDialog] = React.useState(false)
  const { voidOrder, isLoading: isVoiding } = useVoidOrder()

  const [showPin, hidePin] = useState(false)

  const { values, setFieldValue, submitForm, getFieldProps, getFieldMeta } =
    useFormik({
      initialValues: {
        voidPin: '',
      },
      validationSchema: toFormikValidationSchema(
        z.object({
          voidPin: z
            .string({
              required_error: 'PIN is required',
            })
            .length(6, 'PIN must be 6 characters'),
        }),
      ),
      onSubmit: (values) => {
        processVoid(values.voidPin)
      },
    })

  const processVoid = async (voidPin: string) => {
    try {
      await voidOrder({
        orderId: order.id,
        shiftId: shiftId,
        voidPin: voidPin,
      })
      setShowPinDialog(false)
      toast.success(`Order #${order.orderNo} voided`, {
        autoClose: 500,
        theme: 'colored',
      })
    } finally {
      setFieldValue('voidPin', '')
    }
  }

  return (
    <>
      {showPinDialog && (
        <dialog
          open
          id={`pin-dialog-${order.id}`}
          className="modal bg-black/30"
        >
          <div className="modal-box px-4">
            <h3 className="text-lg font-bold">PIN</h3>
            <div className="join w-full">
              <div className="form-control w-full">
                <input
                  {...getFieldProps('voidPin')}
                  disabled={isVoiding}
                  type={showPin ? 'text' : 'password'}
                  className="input input-bordered w-full"
                  onChange={(e) => {
                    // Limit up to 6
                    if (values.voidPin?.length <= 6) {
                      setFieldValue('voidPin', e.target.value.slice(0, 6))
                    }
                  }}
                  inputMode="numeric"
                />
                <p className="form-control-error">
                  {getFieldMeta('voidPin').error}&nbsp;
                </p>
              </div>
              <button className="btn join-item ">
                {showPin ? (
                  <EyeIcon onClick={() => hidePin(false)} className="w-6" />
                ) : (
                  <EyeSlashIcon onClick={() => hidePin(true)} className="w-6" />
                )}
              </button>
            </div>
            <div className="font-sm modal-action">
              <button
                disabled={isVoiding}
                onClick={() => setShowPinDialog(false)}
                className="btn"
              >
                Cancel
              </button>
              <button
                disabled={isVoiding}
                onClick={submitForm}
                type="button"
                className="btn btn-primary"
              >
                Void Order
              </button>
            </div>
          </div>
        </dialog>
      )}
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
                {moment(order.createdAt)
                  .tz('Asia/Manila')
                  .format('MM/DD/YYYY hh:mm A')}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Total:</strong> {formatToPeso(order.totalNet)}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Status:</strong> <StatusChip status={order.status} />
              </td>
            </tr>
          </tbody>
        </div>
        <div className="flex flex-row justify-center gap-3 bg-base-100 p-2 py-3">
          <button
            onClick={() => setShowPinDialog(true)}
            disabled={isVoiding}
            className="btn btn-primary btn-md"
          >
            <ArchiveBoxArrowDownIcon className="w-5" /> Void Order
          </button>
        </div>
      </div>
    </>
  )
}

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

export default OrderItem
