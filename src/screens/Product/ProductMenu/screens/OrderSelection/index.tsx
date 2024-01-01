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
import { toFormikValidationSchema } from 'zod-formik-adapter'
import OrderItemForm from '../../components/OrderItemForm'
import OrderItemWithVariantForm from '../../components/OrderItemWithVariantForm'

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
  quantity?: number
}

const OrderSelection = (props: OrderSelectionProps) => {
  const { onBack, product, quantity = 1 } = props
  const hasVariants = product.variants && product.variants.length > 0

  const { values, setErrors, errors } = useFormik({
    onSubmit: () => {},
    initialValues: {
      quantity,
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
        {!hasVariants && (
          <OrderItemForm
            quantity={quantity}
            onBack={onBack}
            product={product}
          />
        )}
        {hasVariants && (
          <OrderItemWithVariantForm onBack={onBack} product={product} />
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
