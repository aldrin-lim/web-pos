import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import PriceInput from 'components/PriceInput'
import { useFormik } from 'formik'
import { PricingOption, PricingOptionSchema } from 'types/order.types'
import { toFormikValidationSchema } from 'zod-formik-adapter'

type OrderSelectionDiscountProps = {
  onBack: () => void
  values?: Values | null
  onChange?: (values: Values) => void
}

type Values = PricingOption

const initialValues: Values = {
  name: '',
  type: 'percentage',
  amount: 0,
}

const OrderSelectionDiscount = (props: OrderSelectionDiscountProps) => {
  const { onBack, onChange, values = initialValues } = props

  const form = useFormik({
    onSubmit: async (value) => {
      if (onChange && value) {
        await onChange(value as Values)
      }
      onBack()
    },
    initialValues: values || initialValues,
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(PricingOptionSchema),
  })
  const { setFieldValue, getFieldProps, submitForm, errors } = form
  const { type } = form.values

  return (
    <div className={`OrderSelection main-screen `}>
      <div className="sub-screen">
        <Toolbar
          items={[
            <ToolbarButton
              key={1}
              icon={<ChevronLeftIcon className="w-6" />}
              onClick={onBack}
            />,
            <ToolbarTitle key={2} title="Discount" />,
            <ToolbarButton key={3} label="Done" onClick={submitForm} />,
          ]}
        />
        <div className="flex flex-row gap-2">
          <div className="form-control w-full">
            <div className="label">
              <span className="label-text-alt">Name</span>
            </div>
            <input
              {...getFieldProps('name')}
              type="text"
              className="input input-bordered w-full "
            />
            {errors.name && <p className="form-control-error">{errors.name}</p>}
          </div>
          <div className="form-control  w-full">
            <div className="label">
              <span className="label-text-alt">Type</span>
            </div>
            <select
              {...getFieldProps('type')}
              className="input input-bordered w-full "
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            {errors.type && <p className="form-control-error">{errors.type}</p>}
          </div>
        </div>
        <div className="form-control  w-full">
          <div className="label">
            <span className="label-text-alt">Amount</span>
          </div>
          <div className="flex flex-row justify-center gap-2 align-middle">
            <PriceInput
              {...getFieldProps('amount')}
              showDecimal={type === 'fixed'}
              onChange={(newValue) => {
                setFieldValue('amount', newValue)
              }}
              className="input input-bordered w-full"
            />
            <p className="relative top-2 w-[30px] text-lg font-bold">
              {type === 'percentage' ? '%' : '₱'}
            </p>
          </div>
          {errors.amount && (
            <p className="form-control-error">{errors.amount}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderSelectionDiscount
