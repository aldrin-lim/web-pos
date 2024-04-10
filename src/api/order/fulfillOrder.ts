import { AxiosResponse } from 'axios'
import { customerSchema } from 'types/customer.types'
import { OrderSchema, SaleSchema } from 'types/report.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

const FulFillOrderReponseSchema = OrderSchema.extend({
  sale: SaleSchema.omit({ order: true }),
})

export default async (
  param: FulFillOrderValidationSchema,
): Promise<z.infer<typeof FulFillOrderReponseSchema>> => {
  const result = await httpClient
    .post<
      FulFillOrderValidationSchema,
      AxiosResponse<z.infer<typeof FulFillOrderReponseSchema>>
    >(`/orders/fulfill`, param)
    .then((res) => res.data)
  return result
}

// Schema and Types

export type FulFillOrderValidationSchema = z.infer<
  typeof FulFillOrderValidationSchema
>

export const FulFillOrderValidationSchema = z.object({
  orders: z.array(
    z.object({
      quantity: z.number({
        required_error: 'Quantity is required',
      }),
      product: z
        .object({
          id: z.string({
            required_error: 'Product ID is required',
          }),
        })
        .strip(),
      discount: z
        .object({
          type: z.enum(['percentage', 'fixed'], {
            required_error: 'Discount type is required',
            invalid_type_error: 'Must be either "percentage" or "amount"',
          }),
          amount: z.number({
            required_error: 'Discount amount is required',
            coerce: true,
          }),
          name: z.string().optional(),
        })
        .optional(),
    }),
  ),
  payments: z.array(
    z.object({
      method: z.string({
        required_error: 'Payment method is required',
      }),
      amountReceived: z.number({
        required_error: 'Amount received is required',
      }),
      amountPayable: z.number({
        required_error: 'Amount payable is required',
      }),
      change: z.number().default(0),
    }),
  ),
  shiftId: z.string({
    required_error: 'Shift ID is required',
  }),
  customer: customerSchema.optional(),
  status: z
    .enum(['pending', 'completed', 'cancelled'])
    .default('pending')
    .optional(),
})
