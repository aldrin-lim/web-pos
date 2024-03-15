import { Bars3Icon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'
import { useFormik } from 'formik'
import CurrencyInput from 'react-currency-input-field'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import useUser from 'hooks/useUser'
import { toast } from 'react-toastify'
import { StartShiftValidationSchema } from 'api/shift/startShift'
import useStartShift from 'hooks/useStartShift'
import { AppPath } from 'routes/AppRoutes.types'
import { getTodayShift } from 'api/shift'
import { useEffect } from 'react'
import useGetShift from 'hooks/useGetTodayShift'
import mixpanel from 'mixpanel-browser'

const StartShift = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const { isStarting, startShift } = useStartShift()
  const { shift } = useGetShift()

  const { user } = useUser()

  useEffect(() => {
    if (shift?.openedBy) {
      mixpanel.track('Start Shift', {
        email: shift?.openedBy.email,
      })
    }
  }, [shift])

  const { values, errors, submitForm, setFieldValue, getFieldProps } =
    useFormik({
      initialValues: {
        name: '',
        notes: '',
        openingPettyCash: 0,
        openedBy: user?.id,
      },
      validateOnBlur: false,
      validateOnChange: false,
      validationSchema: toFormikValidationSchema(StartShiftValidationSchema),
      onSubmit: async (formValues) => {
        const validation = StartShiftValidationSchema.safeParse(formValues)

        if (!validation.success) {
          toast.error(validation.error.errors[0].message)
          return
        }

        await startShift(validation.data)

        navigate(AppPath.Catalog)
      },
    })

  useEffect(() => {
    if (shift && shift.status === 'open') {
      navigate(AppPath.Catalog)
    }
  }, [shift])

  return (
    <>
      <div
        className={[
          'screen h-full',
          !isParentScreen ? 'hidden-screen' : '',
        ].join(' ')}
      >
        <Toolbar
          items={[
            <label
              htmlFor="my-drawer"
              key="1"
              className="btn btn-link px-0 normal-case text-blue-400 no-underline disabled:bg-transparent disabled:text-gray-400"
            >
              <Bars3Icon className="w-6" />
            </label>,
            <ToolbarTitle key="title" title="New Shift" />,
          ]}
        />
        <div className="flex h-full flex-col gap-2">
          <h1 className="text-xs text-white">
            Opening Staff:{' '}
            <span className="text-neutral">
              {user?.firstName} {user?.lastName}
            </span>
          </h1>
          <h2 className="text-base text-white">Opening Cash</h2>
          {/* Opening Cash */}
          <label className="form-control w-full ">
            {/* <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">Opening Cash</span>
            </div> */}
            <CurrencyInput
              onBlur={getFieldProps('openingPettyCash').onBlur}
              name={getFieldProps('openingPettyCash').name}
              value={getFieldProps('openingPettyCash').value}
              type="text"
              tabIndex={3}
              className="input input-bordered w-full focus:border-teal-500"
              prefix={'₱'}
              onValueChange={(value) => {
                setFieldValue('openingPettyCash', value)
              }}
              inputMode="decimal"
              allowNegativeValue={false}
            />

            {errors.openingPettyCash && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.openingPettyCash}
                </span>
              </div>
            )}
          </label>

          {/* Notes */}
          <h2 className="text-base text-white">Notes</h2>
          <label className="form-control w-full ">
            {/* <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">Notes</span>
            </div> */}
            <textarea
              {...getFieldProps('notes')}
              className="textarea textarea-bordered focus:border-teal-500"
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
            onClick={submitForm}
            className="btn btn-secondary mb-9 mb-auto mt-2"
          >
            Open
          </button>
        </div>
      </div>
    </>
  )
}

export default StartShift
