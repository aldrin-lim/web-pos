import { useCallback, useState } from 'react'
import { ProductVariant } from 'types/product.types'
import { useFormik } from 'formik'
import SlidingTransition from 'components/SlidingTransition'
import OrderSelectionDiscount from './OrderSelectionDiscount'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import OrderItemForm from '../../components/OrderItemForm'
import OrderItemWithVariantForm from '../../components/OrderItemWithVariantForm'
import { OrderItem, OrderItemSchema, PricingOption } from 'types/order.types'

type Values = OrderItem

export type OrderFormValues = {
  price: number
  quantity: number
  productVariant?: ProductVariant
}

// This component lets you pick product to be inlcuded in the main screen of the POS
enum ActiveScreen {
  None = 'none',
  DiscountList = 'list',
}

type OrderSelectionProps = {
  onBack: () => void
  values: Values
  onComplete?: (values: Values) => void
}

const OrderSelection = (props: OrderSelectionProps) => {
  const { onBack, values } = props
  const hasVariants =
    'variants' in props.values.product &&
    props.values.product.variants.length > 0

  const [discount, setDiscount] = useState<PricingOption | null>(null)

  const {
    values: formValues,
    submitForm,
    setValues,
  } = useFormik({
    onSubmit: (value) => {
      props.onComplete && props.onComplete(value)
      onBack()
    },
    initialValues: {
      ...values,
      discount,
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(OrderItemSchema),
  })

  const { product, quantity } = formValues

  const [activeScreen, setActiveScreen] = useState(ActiveScreen.None)
  const goBackToOrderSelectionScreen = useCallback(() => {
    setActiveScreen(ActiveScreen.None)
  }, [])

  const onComplete = (orderFormValue: OrderFormValues) => {
    let discountAmount = 0
    const price = orderFormValue.price * orderFormValue.quantity

    if (discount) {
      if (discount.type === 'percentage') {
        discountAmount = price * (discount.amount / 100)
      } else {
        discountAmount = discount.amount || 0
      }
    }

    const net = price - discountAmount ?? 0
    const gross = price

    const updatedValues: OrderItem = {
      ...values,
      discount,
      gross,
      net,
      product,
      productVariant: orderFormValue.productVariant,
      quantity: orderFormValue.quantity,
    }

    console.log('updatedValues', updatedValues)
    setValues(updatedValues)
    submitForm()
  }

  return (
    <div
      className={`OrderSelection main-screen ${
        activeScreen === ActiveScreen.None ? 'h-full' : 'h-screen'
      }`}
    >
      <div className="sub-screen">
        {!hasVariants && (
          <OrderItemForm
            onComplete={onComplete}
            quantity={quantity}
            onBack={onBack}
            product={product}
          />
        )}
        {hasVariants && (
          <OrderItemWithVariantForm
            productVariant={values.productVariant}
            onComplete={onComplete}
            quantity={quantity}
            onBack={onBack}
            product={product}
          />
        )}

        {/* TODO: Allow editing of saved discount */}
        {!discount && (
          <button
            className="btn btn-primary mt-2"
            onClick={() => setActiveScreen(ActiveScreen.DiscountList)}
          >
            Add Discount
          </button>
        )}

        {discount && (
          <div className="flex flex-row justify-between gap-2">
            <p>Discount: {discount.name}</p>
            <p>
              {discount.type === 'percentage'
                ? `${discount.amount}%`
                : `₱ ${discount.amount}`}
            </p>
          </div>
        )}
      </div>

      {/* Discount Component */}
      <SlidingTransition
        direction="right"
        isVisible={activeScreen === ActiveScreen.DiscountList}
        zIndex={11}
      >
        <OrderSelectionDiscount
          onChange={(discount) => setDiscount(discount)}
          onBack={goBackToOrderSelectionScreen}
        />
      </SlidingTransition>
    </div>
  )
}

export default OrderSelection
