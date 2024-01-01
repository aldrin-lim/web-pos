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

type OrderItemWithVariantFormProps = {
  product: Product
  onBack: () => void
}

const OrderItemWithVariantForm = (props: OrderItemWithVariantFormProps) => {
  const { product, onBack } = props
  const hasVariants = product.variants && product.variants.length > 0

  const { setFieldValue, values, setErrors, errors } = useFormik({
    onSubmit: () => {},
    initialValues: {
      quantity: 1,
      selectedVariant: null as ProductVariant | null,
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(ProductOrderSchema),
    validateOnMount: true,
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
      setFieldValue('quantity', 1)
    }
  }

  useEffect(() => {
    if (selectedVariant) {
      if (values.quantity > selectedVariant.quantity) {
        setErrors({
          ...errors,
          quantity: 'Quantity must not be greater than the available',
        })
      }
    }
  }, [values.quantity, selectedVariant, setErrors, errors])

  // useEffect(() => {
  //   if (selectedVariant === null) {
  //     setErrors({
  //       ...errors,
  //       selectedVariant: 'Select variant first',
  //     })
  //   }
  // }, [selectedVariant])

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
          <ToolbarButton
            key={3}
            disabled={Object.keys(errors).length > 0}
            label="Done"
            onClick={onBack}
          />,
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
      {selectedVariant?.quantity === 0 && (
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
          placeholder={!selectedVariant ? 'Select a variant first' : 'Quantity'}
          value={selectedVariant ? values.quantity : ''}
          onChange={(e) => {
            if (isNaN(+e.target.value)) {
              return
            }
            setFieldValue('quantity', +e.target.value)
          }}
          className="input input-bordered w-full max-w-xs"
        />
        {errors.quantity && (
          <p className="form-control-error">{errors.quantity}&nbsp;</p>
        )}

        {selectedVariant && <>{selectedVariant.quantity} available </>}
      </div>
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
