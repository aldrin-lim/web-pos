import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'
import { useFormik } from 'formik'
import CurrencyInput from 'react-currency-input-field'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import useUser from 'hooks/useUser'
import { toast } from 'react-toastify'
import { AppPath } from 'routes/AppRoutes.types'
import useEndShift from 'hooks/useEndShift'
import { EndShiftValidationSchema } from 'api/shift/endShift'
import useGetShift from 'hooks/useGetTodayShift'
import { useEffect, useMemo } from 'react'
import useGetShiftReport from 'hooks/useGetShiftReport'
import LoadingCover from 'components/LoadingCover'
import {
  PaymentMethod,
  getPaymentMethodName,
} from 'screens/Catalog/screens/Payment'
import { formatToPeso } from 'util/currency'
import { toNumber } from 'lodash'
import mixpanel from 'mixpanel-browser'

const EndShift = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const { isEnding, endShift } = useEndShift()
  const { shift, isLoading: isGetShiftLoading } = useGetShift()
  const { report, isLoading: isGetShiftReportLoading } = useGetShiftReport(
    shift?.id,
  )

  useEffect(() => {
    if (shift?.closedBy) {
      mixpanel.track('End Shift', {
        email: shift?.closedBy.email,
      })
    }
  }, [shift])

  const isLoading = isGetShiftLoading || isGetShiftReportLoading

  const { user } = useUser()

  const { errors, submitForm, setFieldValue, getFieldProps } = useFormik({
    initialValues: {
      notes: '',
      closingPettyCash: 0,
      closedBy: user?.id,
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: toFormikValidationSchema(EndShiftValidationSchema),
    onSubmit: async (formValues) => {
      const validation = EndShiftValidationSchema.safeParse(formValues)

      if (!validation.success) {
        toast.error(validation.error.errors[0].message)
        return
      }

      await endShift(validation.data)

      navigate(AppPath.ZReport, {
        state: {
          shiftId: shift?.id,
        },
      })
    },
  })

  useEffect(() => {
    if (shift && shift.status === 'close') {
      navigate(AppPath.Catalog)
    }
  }, [shift])

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

  const expectedCash = useMemo(() => {
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
      {} as Record<PaymentMethod, number>,
    )

    const openingCash = report?.shift?.openingPettyCash ?? 0

    return formatToPeso(
      toNumber(paymentDetails.cash ?? 0) + toNumber(openingCash ?? 0),
    )
  }, [report?.sales, report?.shift?.openingPettyCash])

  if (isLoading) {
    return <LoadingCover />
  }

  return (
    <>
      <div
        className={[
          'screen pb-23 h-full',
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
            <ToolbarTitle key="title" title="Close Shift" />,
          ]}
        />
        <div className="flex h-full flex-col gap-4 pb-4">
          <h1 className="text-xs text-white">
            Closing Staff:{' '}
            <span className="text-neutral">
              {user?.firstName} {user?.lastName}
            </span>
          </h1>

          <div className=" grid grid-cols-12 gap-2 text-xl font-bold">
            <div className="col-span-7 text-white">Expected Cash:</div>
            <div className="col-span-5 text-right text-white">
              {expectedCash}
            </div>
          </div>
          {/* Closing Cash */}
          <h2 className="text-base text-white">Total Cash Counted</h2>
          <label className="form-control w-full ">
            {/* <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">
                Total Cash Counted
              </span>
            </div> */}
            <CurrencyInput
              onBlur={getFieldProps('closingPettyCash').onBlur}
              name={getFieldProps('closingPettyCash').name}
              value={getFieldProps('closingPettyCash').value}
              type="text"
              tabIndex={3}
              className="input input-bordered w-full focus:border-secondary"
              prefix={'₱'}
              disabled={isEnding}
              onValueChange={(value) => {
                setFieldValue('closingPettyCash', value)
              }}
              inputMode="decimal"
              allowNegativeValue={false}
            />

            {errors.closingPettyCash && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.closingPettyCash}
                </span>
              </div>
            )}
          </label>

          {/* Difference */}
          <h2 className="border-b border-gray-700 pb-4 text-base font-bold text-white">
            Difference:{' '}
          </h2>

          {/* Opening Cash */}
          <h2 className="text-base text-white">Opening Cash: </h2>
          {/* Payments in Cash */}
          <h2 className="text-base text-white">Payments in Cash: </h2>
          {/* Payments in Gcash */}
          <h2 className="text-base text-white">Payments in Gcash: </h2>
          {/* Payments in MAYA */}
          <h2 className="border-b border-gray-700 pb-4 text-base text-white">
            Payments in MAYA:{' '}
          </h2>

          {/* Notes */}
          <h2 className="text-base font-bold text-white">Notes</h2>
          <label className="form-control w-full ">
            {/* <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">Notes</span>
            </div> */}
            <textarea
              {...getFieldProps('notes')}
              disabled={isEnding}
              className="textarea textarea-bordered focus:border-secondary"
            />

            {errors.notes && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.notes}
                </span>
              </div>
            )}
          </label>
          <div className=" grid grid-cols-12 gap-2">
            <div className="col-span-7">Opening Cash:</div>
            <div className="col-span-5 text-right">
              {formatToPeso(report?.shift?.openingPettyCash ?? 0)}
            </div>
          </div>
          {Object.entries(paymentsRecievedPerMethod ?? {}).map(
            ([key, value]) => (
              <div key={key} className=" grid grid-cols-12 gap-2">
                <div className="col-span-7">{key}</div>
                <div className="col-span-5 text-right">{value}</div>
              </div>
            ),
          )}

          <button
            disabled={isEnding}
            onClick={submitForm}
            className="btn btn-secondary mb-9 mb-auto mt-2"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

export default EndShift
