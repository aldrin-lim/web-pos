import { z } from 'zod'
import { ProductSchema, ProductVariantSchema } from './product.types'

export const PricingOptionSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  type: z.union([z.literal('fixed'), z.literal('percentage')], {
    required_error: 'Type is required',
  }),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .min(1),
})

export const OrderItemSchema = z.object({
  product: ProductSchema,
  productVariant: ProductVariantSchema.optional(),
  quantity: z.number({ required_error: 'Quantity is required' }),
  discount: PricingOptionSchema.nullable(),
  gross: z.number({ required_error: 'Gross is required' }),
  net: z.number({ required_error: 'Net is required' }),
})

const OrderSchema = z.object({
  gross: z.number({ required_error: 'Gross is required' }),
  net: z.number({ required_error: 'Net is required' }),
  orderItems: z
    .array(OrderItemSchema)
    .min(1, { message: 'Order items are required' }),
})

export type Order = z.infer<typeof OrderSchema>
export type OrderItem = z.infer<typeof OrderItemSchema>
export type PricingOption = z.infer<typeof PricingOptionSchema>
