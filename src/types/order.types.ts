import { z } from 'zod'
import { ProductSchema, ProductVariantSchema } from './product.types'

export const PricingOptionSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  type: z.union([z.literal('fixed'), z.literal('percentage')], {
    required_error: 'Type is required',
  }),
  amount: z.coerce.number({ required_error: 'Amount is required' }).min(1),
})

const OrderItem = z.object({
  product: z.union(
    [
      ProductSchema.partial().required({ id: true, price: true }),
      ProductVariantSchema.partial().required({ id: true, price: true }),
    ],
    { required_error: 'Product is required' },
  ),
  quantity: z.number({ required_error: 'Quantity is required' }),
  discounts: z.array(PricingOptionSchema),
  gross: z.number({ required_error: 'Gross is required' }),
  net: z.number({ required_error: 'Net is required' }),
})

const OrderSchema = z.object({
  gross: z.number({ required_error: 'Gross is required' }),
  net: z.number({ required_error: 'Net is required' }),
  orderItems: z
    .array(OrderItem)
    .min(1, { message: 'Order items are required' }),
})

export type Order = z.infer<typeof OrderSchema>
export type OrderItem = z.infer<typeof OrderItem>
export type PricingOption = z.infer<typeof PricingOptionSchema>
