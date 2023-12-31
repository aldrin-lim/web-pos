import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import { useCallback, useEffect, useState } from 'react'
import {
  Product,
  ProductSchema,
  ProductVariantSchema,
} from 'types/product.types'
import { useFormik } from 'formik'
import { z } from 'zod'
import SlidingTransition from 'components/SlidingTransition'
import OrderSelectionDiscount from './OrderSelectionDiscount'
import ImageLoader from 'components/ImageLoader'
import MiddleTruncateText from 'components/MiddleTruncatedText'
import { toFormikValidationSchema } from 'zod-formik-adapter'

// This component lets you pick product to be inlcuded in the main screen of the POS
// TODO: Break the components down
// TODO: Check if product has allow selling when out of stock
enum ActiveScreen {
  None = 'none',
  DiscountList = 'list',
}

type OrderSelectionProps = {
  onBack: () => void
  product: Product
}

const OrderSelection = (props: OrderSelectionProps) => {
  const { onBack, product } = props
  const hasVariants = product.variants && product.variants.length > 0

  const { setFieldValue, values, setErrors, errors } = useFormik({
    onSubmit: () => {},
    initialValues: {
      quantity: 1,
      selectedProduct:
        product.variants && product.variants[0] ? product.variants[0] : product,
    },
    validationSchema: toFormikValidationSchema(ProductOrderSchema),
  })

  const { selectedProduct } = values

  const [activeScreen, setActiveScreen] = useState(ActiveScreen.None)
  const goBackToOrderSelectionScreen = useCallback(() => {
    setActiveScreen(ActiveScreen.None)
  }, [])

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
        setFieldValue('selectedProduct', variant)
      }
      setFieldValue('quantity', 1)
    }
  }

  useEffect(() => {
    if (selectedProduct) {
      if (values.quantity > selectedProduct?.quantity) {
        setErrors({
          ...errors,
          quantity: 'Quantity must not be greater than the available',
        })
      }
    }
  }, [values.quantity, selectedProduct, setErrors, errors])

  return (
    <div
      className={`OrderSelection main-screen ${
        activeScreen === ActiveScreen.None ? 'h-full' : 'h-screen'
      }`}
    >
      <div className="section sub-screen">
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

          {!selectedProduct && hasVariants && (
            <p className="font-bold">
              ₱ {Math.min(...variantPrices)} - {Math.max(...variantPrices)}
            </p>
          )}

          {selectedProduct && (
            <p className="font-bold">
              ₱ {(values.quantity * selectedProduct.price).toFixed(2)}
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
                  selectedProduct && variant.id === selectedProduct.id
                    ? ' bg-purple-400 text-white'
                    : 'btn-outline'
                }`}
              >
                {variant.name}
              </button>
            )
          })}
        </div>
        {errors.selectedProduct && (
          <p className="form-control-error">Select a variant first</p>
        )}
        {selectedProduct.quantity === 0 && (
          <p className="mt-4 w-full text-center text-xl font-bold">
            Out of stock
          </p>
        )}
        {selectedProduct.quantity > 0 && (
          <div className="flex flex-col gap-1">
            <div className="label">
              <span className="label-text-alt">Quantity</span>
            </div>
            <input
              type="text"
              disabled={!selectedProduct}
              placeholder="Quantity"
              value={values.quantity}
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

            {selectedProduct && <>{selectedProduct.quantity} available </>}
          </div>
        )}
      </div>

      {/* Discount Component */}
      <SlidingTransition
        direction="right"
        isVisible={activeScreen === ActiveScreen.DiscountList}
        zIndex={11}
      >
        <OrderSelectionDiscount onBack={goBackToOrderSelectionScreen} />
      </SlidingTransition>
    </div>
  )
}

const ProductOrVariantSchema = z.union([ProductSchema, ProductVariantSchema])

const ProductOrderSchema = z.object({
  quantity: z.number().min(1),
  selectedProduct: ProductOrVariantSchema,
})

export default OrderSelection
