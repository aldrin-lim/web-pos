import { useEffect } from 'react'
import {
  Product,
  ProductVariant,
  ProductVariantSchema,
} from 'types/product.types'
import { useFormik } from 'formik'
import { z } from 'zod'
import ImageLoader from 'components/ImageLoader'
import MiddleTruncateText from 'components/MiddleTruncatedText'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { OrderFormValues } from '../screens/OrderSelection'

type OrderItemWithVariantFormProps = {
  product: Product
  onBack: () => void
  quantity?: number
  onComplete: (values: OrderFormValues) => void
}

const OrderItemWithVariantForm = (props: OrderItemWithVariantFormProps) => {
  const { product, onBack, onComplete, quantity = 1 } = props
  const hasVariants = product.variants && product.variants.length > 0

  const schema =
    product.allowBackOrder === false
      ? z.object({
          quantity: z.number().min(1),
          selectedVariant: ProductVariantSchema.refine((v) => v !== null, {
            message: 'Select a variant first',
          }),
        })
      : ProductOrderSchema

  const { setFieldValue, values, setErrors, errors, submitForm } = useFormik({
    onSubmit: (value) => {
      if (value.selectedVariant === null) {
        console.log('no variant selected')
        return
      }
      onComplete({
        productVariant: value.selectedVariant,
        price: value.selectedVariant.price,
        quantity: value.quantity,
      })
    },
    initialValues: {
      quantity,
      selectedVariant: null as ProductVariant | null,
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(schema),
  })

  const { selectedVariant } = values

  const variants = (product.variants ?? []).map((variant) => ({
    id: variant.id,
    name: variant.variantOptions.map((variant) => variant.value).join('/'),
  }))

  const variantPrices = (product.variants ?? []).map((v) => v.price)

  const image = product.images && product.images[0]

  const onVariantSelect = (variantId?: string) => {
    if (variantId) {
      const variant = (product.variants ?? []).find((v) => v.id === variantId)
      if (variant) {
        setFieldValue('selectedVariant', variant)
      }
      setFieldValue('quantity', quantity ?? 1)
    }
  }

  useEffect(() => {
    if (selectedVariant) {
      if (
        values.quantity > selectedVariant.quantity &&
        product.allowBackOrder === false
      ) {
        setErrors({
          ...errors,
          quantity: 'Quantity must not be greater than the available',
        })
      }
    }
  }, [
    values.quantity,
    selectedVariant,
    setErrors,
    errors,
    product.allowBackOrder,
  ])

  const renderForm = () => {
    if (
      product.allowBackOrder ||
      (product.allowBackOrder === false && product.quantity > 0)
    ) {
      return (
        <>
          <h1 className="font-bold">Variants</h1>
          <div className="flex flex-row flex-wrap gap-4">
            {variants.map((variant, i) => {
              return (
                <button
                  key={i}
                  onClick={() => onVariantSelect(variant.id)}
                  className={`btn w-0 min-w-min ${
                    selectedVariant && variant.id === selectedVariant.id
                      ? ' bg-purple-400 text-white'
                      : 'btn-outline'
                  }`}
                >
                  {variant.name}
                </button>
              )
            })}
          </div>
          {errors.selectedVariant && (
            <p className="form-control-error">Select a variant first</p>
          )}
          {selectedVariant?.allowBackOrder === false &&
            selectedVariant?.quantity === 0 && (
              <p className="mt-4 w-full text-center text-xl font-bold">
                Out of stock
              </p>
            )}

          <div className="flex flex-col gap-1">
            <div className="label">
              <span className="label-text-alt">Quantity</span>
            </div>
            <input
              type="text"
              disabled={!selectedVariant}
              placeholder={
                !selectedVariant ? 'Select a variant first' : 'Quantity'
              }
              value={selectedVariant ? values.quantity : ''}
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

            {selectedVariant && product.allowBackOrder === false && (
              <>{selectedVariant.quantity} available </>
            )}
          </div>
        </>
      )
    }
    return (
      <p className="mt-4 w-full text-center text-xl font-bold">Out of stock</p>
    )
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
          <ToolbarButton key={3} label="Done" onClick={submitForm} />,
        ]}
      />
      <div className="flex h-[120px] justify-center overflow-hidden bg-gray-200 align-middle ">
        <div className={`${image ? 'scale-150' : ''}`}>
          <ImageLoader src={image} iconClassName="w-24 text-gray-400" />
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <MiddleTruncateText maxLength={20} text={product.name} />

        {!selectedVariant && hasVariants && (
          <p className="font-bold">
            ₱ {Math.min(...variantPrices)} - {Math.max(...variantPrices)}
          </p>
        )}

        {selectedVariant && (
          <p className="font-bold">
            ₱ {(values.quantity * selectedVariant.price).toFixed(2)}
          </p>
        )}
      </div>
      {renderForm()}
    </>
  )
}

const ProductOrderSchema = z.object({
  quantity: z.number().min(1),
  selectedVariant: ProductVariantSchema.refine((v) => v !== null, {
    message: 'Select a variant first',
  }),
})

export default OrderItemWithVariantForm
