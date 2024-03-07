import { z } from 'zod'
import { ProductSchema } from './product.types'

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
  id: z.string(),
  quantity: z.number(),
  cost: z.number(),
  orderItem: z.string(), // assuming OrderItem's id is a string
  deletedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const OrderSchema = z.object({
  id: z.string(),
  orderNo: z.string(),
  number: z.string(),
  sale: z.string(), // assuming Sale's id is a string
  status: z.enum(['pending', 'completed', 'cancelled', 'voided']),
  business: z.string(), // assuming Business's id is a string
  shift: z.string(), // assuming Shift's id is a string
  orderItems: z
    .array(OrderItemSchema)
    .min(1, { message: 'Order items are required' }),
  deletedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  totalGross: z.number(),
  totalDiscount: z.number(),
  totalNet: z.number(),
  totalCost: z.number(),
})

export type OrderSchema = z.infer<typeof OrderSchema>
export type OrderItem = z.infer<typeof OrderItemSchema>
export type PricingOption = z.infer<typeof PricingOptionSchema>
