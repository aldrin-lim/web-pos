import { useRef } from 'react'
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
  productVariant?: ProductVariant
  onBack: () => void
  quantity?: number
  onComplete: (values: OrderFormValues) => void
  editMode?: boolean
}

const OrderItemWithVariantForm = (props: OrderItemWithVariantFormProps) => {
  const {
    product,
    onBack,
    onComplete,
    productVariant,
    quantity = 1,
    editMode = false,
  } = props
  const hasVariants = product.variants && product.variants.length > 0

  const quantityInputRef = useRef<HTMLInputElement>(null)

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
      selectedVariant: productVariant ?? null,
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(ProductOrderSchema),
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
    // TODO: Fix this why it only focus on the second time
    setTimeout(() => {
      quantityInputRef.current?.focus()
    }, 100)
  }

  const onSubmit = async () => {
    if (selectedVariant) {
      const maxQuantityAllowed = quantity + selectedVariant.quantity

      if (selectedVariant.allowBackOrder === false) {
        if (editMode === false) {
          if (values.quantity > selectedVariant.quantity) {
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
    }
    submitForm()
  }

  const renderForm = () => {
    // if allowed back order is false
    //    - show available quantity on add mode
    //      - validate available quantity, show quantity input
    //      - show of of stock when nothing is avialable, hide quantity input
    //    - show available quantity on edit mode
    //      - validate max quantity
    // if allowed back order is true
    //    - no quantity checking

    if (selectedVariant) {
      // When selling product when out of stock is not allowed
      if (selectedVariant.allowBackOrder === false) {
        // Adding item on the cart
        if (editMode === false) {
          if (selectedVariant.quantity === 0) {
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
                ref={quantityInputRef}
                type="text"
                disabled={!selectedVariant}
                placeholder={
                  !selectedVariant ? 'Select a variant first' : 'Quantity'
                }
                value={selectedVariant ? values.quantity : ''}
                onChange={async (e) => {
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

              <>{selectedVariant.quantity} available </>
            </div>
          )
        } else {
          return (
            <div className="flex flex-col gap-1">
              <div className="label">
                <span className="label-text-alt">Quantity</span>
              </div>
              <input
                ref={quantityInputRef}
                type="text"
                disabled={!selectedVariant}
                placeholder={
                  !selectedVariant ? 'Select a variant first' : 'Quantity'
                }
                value={selectedVariant ? values.quantity : ''}
                onChange={async (e) => {
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

              <>{selectedVariant.quantity} available </>
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
              ref={quantityInputRef}
              type="text"
              disabled={!selectedVariant}
              placeholder={
                !selectedVariant ? 'Select a variant first' : 'Quantity'
              }
              value={selectedVariant ? values.quantity : ''}
              onChange={async (e) => {
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
    } else {
      return (
        <div className="flex flex-col gap-1">
          <div className="label">
            <span className="label-text-alt">Quantity</span>
          </div>
          <input
            ref={quantityInputRef}
            type="text"
            disabled={!selectedVariant}
            placeholder={
              !selectedVariant ? 'Select a variant first' : 'Quantity'
            }
            value={selectedVariant ? values.quantity : ''}
            onChange={async (e) => {
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
      {renderForm()}
    </>
  )
}

const ProductOrderSchema = z.object({
  quantity: z.number(),
  selectedVariant: ProductVariantSchema.refine((v) => v !== null, {
    message: 'Select a variant first',
  }),
})

export default OrderItemWithVariantForm
