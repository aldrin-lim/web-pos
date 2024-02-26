import { z } from 'zod'

import { MaterialSchema, ProductSchema } from './product.types'

const OrderItemCostSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  cost: z.number(),
  materialUsed: MaterialSchema.nullable(),
})

const OrderItemSchema = z.object({
  id: z.string(),
  product: ProductSchema,
  quantity: z.number(),
  price: z.number(),
  discount: z
    .object({
      type: z.union([z.literal('percentage'), z.literal('fixed')]),
      amount: z.number(),
      name: z.string().optional(),
    })
    .optional(),
  costs: z.array(OrderItemCostSchema),
  order: z.string(),
  cost: z.number(),
  net: z.number(),
  gross: z.number(),
})

const ShiftSchema = z.object({
  name: z.string().optional(),
  notes: z.string().optional(),
  openingPettyCash: z.number({
    coerce: true,
    required_error: 'Opening petty cash is required',
  }),
  businessId: z.string({
    required_error: 'Business ID is required',
  }),
  openedBy: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
    })
    .optional(),
  closedBy: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
    })
    .optional(),
  openedTime: z.string(),
  closedTime: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const OrderSchema = z.object({
  id: z.string(),
  orderNo: z.string(),
  status: z.enum(['pending', 'completed', 'cancelled']),
  orderItems: z.array(OrderItemSchema),
  shift: ShiftSchema,
  totalGross: z.number(),
  totalDiscount: z.number(),
  totalNet: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const PaymentSchema = z.object({
  id: z.string(),
  method: z.enum([
    'cash',
    'banktransfer',
    'creditcard',
    'debitcard',
    'gcash',
    'paymaya',
  ]),
  amountReceived: z.number(),
  amountPayable: z.number(),
  change: z.number(),
})

export const SaleSchema = z.object({
  id: z.string(),
  totalAmount: z.number(),
  totalDiscount: z.number(),
  payments: z.array(PaymentSchema),
  order: OrderSchema,
})

export const ReportSchema = z.object({
  shift: ShiftSchema,
  sales: z.array(SaleSchema),
})

export type Report = z.infer<typeof ReportSchema>
