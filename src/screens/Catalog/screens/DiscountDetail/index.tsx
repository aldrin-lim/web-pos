import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { useNavigate, useLocation, useResolvedPath } from 'react-router-dom'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import CurrencyInput from 'react-currency-input-field'
import { Discount, DiscountSchema } from 'screens/Catalog'

type DiscountDetailProps = {
  onApplyDiscount?: (discount: Discount) => void
  value?: Discount
}

const DiscountDetail = (props: DiscountDetailProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolvePath = useResolvedPath('')
  const isParentScreen = location.pathname === resolvePath.pathname

  const { values, errors, submitForm, setFieldValue, getFieldProps } =
    useFormik({
      initialValues:
        props.value ??
        ({
          name: '',
          type: 'percentage',
          amount: 0,
        } as Discount),
      validateOnBlur: false,
      validateOnChange: false,
      validationSchema: toFormikValidationSchema(DiscountSchema),
      onSubmit: (values) => {
        props.onApplyDiscount?.(values)
      },
    })
  return (
    <>
      <div
        className={['screen h-full pb-9', !isParentScreen ? 'hidden' : ''].join(
          ' ',
        )}
      >
        <Toolbar
          items={[
            <ToolbarButton
              key={'negative'}
              icon={<XMarkIcon className="w-6 text-white" />}
              onClick={() => navigate(-1)}
            />,
            <ToolbarTitle key="title" title="Discount" />,
          ]}
        />
        <div className="flex h-full flex-col gap-4">
          {/* Discount Name */}
          {/* <h2 className="text-base text-white">Discount Name</h2> */}
          <label className="form-control relative w-full">
            {/* <div className="form-control-label  ">
              <span className="label-text-alt text-gray-400">
                Discount Name
              </span>
            </div> */}
            <input
              {...getFieldProps('name')}
              type="text"
              placeholder="Optional"
              className="input input-bordered w-full border-neutral text-white"
              tabIndex={1}
            />
            <ChevronDownIcon className="t- absolute right-[0.5rem] top-[15px] w-6 text-white" />

            {errors.name && (
              <div className="label py-0">
                <span className="label-text-alt text-xs text-red-400">
                  {errors.name}
                </span>
              </div>
            )}
          </label>

          <div className="grid grid-cols-12 gap-2 text-sm">
            {/* Discount Amount */}
            <div className="col-span-6">
              <label className="form-control w-full ">
                {/* <div className="form-control-label  ">
                  <span className="label-text-alt text-gray-400">Amount</span>
                </div> */}
                <CurrencyInput
                  onBlur={getFieldProps('amount').onBlur}
                  name={getFieldProps('amount').name}
                  value={getFieldProps('amount').value}
                  type="text"
                  tabIndex={3}
                  className="input input-bordered w-full border-neutral text-white"
                  prefix={values.type === 'fixed' ? '₱' : undefined}
                  onValueChange={(value) => {
                    setFieldValue('amount', value)
                  }}
                  inputMode="decimal"
                  allowNegativeValue={false}
                />

                {errors.amount && (
                  <div className="label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {errors.amount}
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* Discount Type */}
            <div className="col-span-6">
              <label className="form-control relative w-full">
                {/* <div className="form-control-label  ">
                  <span className="label-text-alt text-gray-400">Type</span>
                </div> */}
                <select
                  {...getFieldProps('type')}
                  className="select select-bordered w-full border-neutral bg-none text-white"
                  tabIndex={2}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount(₱)</option>
                </select>
                <ChevronDownIcon className="t- absolute right-[0.5rem] top-[15px] w-6 text-white" />
                {errors.type && (
                  <div className="label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {errors.type}
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button onClick={submitForm} className="btn btn-primary mt-auto">
            {props.value ? 'Update' : 'Apply'}
          </button>
        </div>
      </div>
    </>
  )
}

export default DiscountDetail
