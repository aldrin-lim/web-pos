import { AxiosResponse } from 'axios'
import { PaginationOptions } from 'types/api.types'
import { Product } from 'types/product.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (
  param?: PaginationOptions & GetAllProductFilterSchema,
) => {
  let url = '/products'

  if (param && Object.keys(param).length > 0) {
    url = `${url}?${new URLSearchParams(param as string).toString()}`
  }

  const result = await httpClient
    .get<unknown, AxiosResponse<Array<Product>>>(url)
    .then((res) => res.data)
  return result || []
}

// Schema and Types
export type GetAllProductSchema = z.infer<typeof GetProductSchema>

export type GetAllProductFilterSchema = z.infer<
  typeof GetAllProductsFilterSchema
>

const GetProductSchema = z.object({
  id: z.string().optional(),
  name: z.string({
    required_error: 'Product name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
  cost: z.number({
    required_error: 'Cost is required',
    invalid_type_error: 'Cost must be a number',
  }),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }),
  images: z.array(z.string()).optional(),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int(),
  measurement: z
    .string({
      required_error: 'Measurement is required',
      invalid_type_error: 'Measurement must be a string',
    })
    .optional(),
  category: z
    .string({
      invalid_type_error: 'Category must be a string',
    })
    .optional(),
  allowBackOrder: z
    .boolean({
      invalid_type_error: 'Allow back order must be a boolean',
    })
    .optional(),
  expiryDate: z.coerce.date().nullable().optional(),
  profit: z.number({
    required_error: 'Profit is required',
    invalid_type_error: 'Profit must be a number',
  }),
})

const GetAllProductsFilterSchema = z.object({
  outOfStock: z.boolean().optional(),
})
