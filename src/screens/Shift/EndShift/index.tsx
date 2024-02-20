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
import { useEffect } from 'react'

const EndShift = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const { isEnding, endShift } = useEndShift()
  const { shift } = useGetShift()

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
              onClick={() => {
                navigate(AppPath.Catalog)
              }}
            />,
            <ToolbarTitle key="title" title="Close Shift" />,
          ]}
        />
        <div className="flex h-full flex-col gap-4">
          <h1>
            Closing Staff:{' '}
            <span className="text-neutral">
              {user?.firstName} {user?.lastName}
            </span>
          </h1>
          {/* Closing Cash */}
          <label className="form-control w-full ">
            <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">
                Total Cash Counted
              </span>
            </div>
            <CurrencyInput
              onBlur={getFieldProps('closingPettyCash').onBlur}
              name={getFieldProps('closingPettyCash').name}
              value={getFieldProps('closingPettyCash').value}
              type="text"
              tabIndex={3}
              className="input input-bordered w-full"
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

          {/* Notes */}
          <label className="form-control w-full ">
            <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">Notes</span>
            </div>
            <textarea
              {...getFieldProps('notes')}
              disabled={isEnding}
              className="textarea textarea-bordered"
            />

            {errors.notes && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.notes}
                </span>
              </div>
            )}
          </label>

          <button
            disabled={isEnding}
            onClick={submitForm}
            className="btn btn-primary mt-auto"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

export default EndShift
