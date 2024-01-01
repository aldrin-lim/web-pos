import { z } from 'zod'
import { ProductSchema, ProductVariantSchema } from './product.types'

const PricingOption = z.object({
  name: z.string({ required_error: 'Discount name is required' }),
  type: z.union([z.literal('fixed'), z.literal('percentage')], {
    required_error: 'Type is required',
  }),
  amount: z.number({ required_error: 'Amount is required' }),
})

const OrderItem = z.object({
  product: z.union(
    [
      ProductSchema.partial().required({ id: true }),
      ProductVariantSchema.partial().required({ id: true }),
    ],
    { required_error: 'Product is required' },
  ),
  quantity: z.number({ required_error: 'Quantity is required' }),
  discounts: z.array(PricingOption),
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
export type PricingOption = z.infer<typeof PricingOption>
