import { Product } from 'types/product.types'
import { useFormik } from 'formik'
import { z } from 'zod'
import ImageLoader from 'components/ImageLoader'
import MiddleTruncateText from 'components/MiddleTruncatedText'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import Toolbar from 'components/Layout/components/Toolbar'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { OrderFormValues } from '../screens/OrderSelection'

type OrderItemFormProps = {
  product: Product
  onBack: () => void
  quantity: number
  onComplete: (values: OrderFormValues) => void
  editMode?: boolean
}

const OrderItemForm = (props: OrderItemFormProps) => {
  const { product, onBack, quantity, onComplete, editMode = false } = props

  const { setFieldValue, values, setErrors, errors, submitForm } = useFormik({
    onSubmit: (value) => {
      onComplete({
        price: product.price,
        quantity: value.quantity,
      })
    },
    initialValues: {
      quantity,
    },
    validationSchema: toFormikValidationSchema(ProductOrderSchema),
    enableReinitialize: true,
    validateOnChange: false,
  })

  const image = product.images && product.images[0]

  const renderForm = () => {
    // When selling product when out of stock is not allowed
    if (product.allowBackOrder === false) {
      // Adding item on the cart
      if (editMode === false) {
        if (product.quantity === 0) {
          return (
            <p className="mt-4 w-full text-center text-xl font-bold">
              Out of stock
            </p>
          )
        }
        return (
          <div className="flex flex-col gap-1">
            <div className="label">
              <span className="label-text-alt">Quantity</span>
            </div>
            <input
              type="text"
              placeholder="Quantity"
              value={values.quantity}
              onChange={(e) => {
                if (isNaN(+e.target.value)) {
                  return
                }
                setFieldValue('quantity', +e.target.value)
              }}
              className="input input-bordered w-full"
            />
            {errors.quantity && (
              <p className="form-control-error">{errors.quantity}&nbsp;</p>
            )}

            <>{product.quantity} available </>
          </div>
        )
      } else {
        return (
          <div className="flex flex-col gap-1">
            <div className="label">
              <span className="label-text-alt">Quantity</span>
            </div>
            <input
              type="text"
              placeholder="Quantity"
              value={values.quantity}
              onChange={(e) => {
                if (isNaN(+e.target.value)) {
                  return
                }
                setFieldValue('quantity', +e.target.value)
              }}
              className="input input-bordered w-full"
            />
            {errors.quantity && (
              <p className="form-control-error">{errors.quantity}&nbsp;</p>
            )}

            <>{product.quantity} available </>
          </div>
        )
      }
    } else {
      return (
        <div className="flex flex-col gap-1">
          <div className="label">
            <span className="label-text-alt">Quantity</span>
          </div>
          <input
            type="text"
            placeholder="Quantity"
            value={values.quantity}
            onChange={(e) => {
              if (isNaN(+e.target.value)) {
                return
              }
              setFieldValue('quantity', +e.target.value)
            }}
            className="input input-bordered w-full"
          />
        </div>
      )
    }
  }

  const onSubmit = () => {
    const maxQuantityAllowed = quantity + product.quantity

    if (product.allowBackOrder === false) {
      if (editMode === false) {
        if (values.quantity > product.quantity) {
          setErrors({
            ...errors,
            quantity: 'Quantity must not be greater than the available',
          })
          return
        }
      } else {
        if (values.quantity > maxQuantityAllowed) {
          setErrors({
            ...errors,
            quantity: 'Maximum quantity allowed is ' + maxQuantityAllowed,
          })
          return
        }
      }
    }
    submitForm()
  }

  return (
    <>
      <Toolbar
        items={[
          <ToolbarButton
            key={1}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={onBack}
          />,
          <ToolbarTitle key={2} title="Order" />,
          <ToolbarButton key={3} label="Done" onClick={onSubmit} />,
        ]}
      />
      <div className="flex h-[120px] justify-center overflow-hidden bg-gray-200 align-middle ">
        <div className={`${image ? 'scale-150' : ''}`}>
          <ImageLoader src={image} iconClassName="w-24 text-gray-400" />
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <MiddleTruncateText maxLength={20} text={product.name} />
        {product && (
          <p className="font-bold">
            ₱ {(values.quantity * product.price).toFixed(2)}
          </p>
        )}
      </div>

      {renderForm()}
    </>
  )
}

const ProductOrderSchema = z.object({
  quantity: z.number(),
})

export default OrderItemForm
