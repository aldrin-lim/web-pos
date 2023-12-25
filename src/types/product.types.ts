import { uniqueVariantCombinations } from 'util/products'
import { z } from 'zod'

export type ProductVariantAttribute = {
  option: string
  values: Array<string>
}

export enum ProductType {
  Material = 'material',
  Regular = 'regular',
}

export const OptionSchema = z.object({
  option: z.string({
    required_error: 'Variant Option name is required',
    invalid_type_error: 'Variant Option name must be a string',
  }),
  value: z.string({
    required_error: 'Variant Option value is required',
    invalid_type_error: 'Variant Option value must be a string',
  }),
})

export const ProductBatchSchema = z.object({
  id: z.string().optional(),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  cost: z.number({
    required_error: 'Cost is required',
    invalid_type_error: 'Cost must be a number',
  }),
  quantity: z.number({
    required_error: 'Quantity is required',
    invalid_type_error: 'Quantity must be a number',
  }),
  measurement: z.string({
    required_error: 'Measurement is required',
    invalid_type_error: 'Measurement must be a number',
  }),
  expiryDate: z.coerce.date().nullable().optional(),
  purchasedDate: z.coerce.date().nullable().optional(),
})

export const BaseProductSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    })
    .optional(),
  cost: z.number({
    required_error: 'Cost is required',
    invalid_type_error: 'Cost must be a number',
  }),
  profit: z.number({
    required_error: 'Profit is required',
    invalid_type_error: 'Profit must be a number',
  }),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int(),
  measurement: z.string({
    required_error: 'Measurement is required',
    invalid_type_error: 'Measurement must be a string',
  }),
  images: z.array(z.string()).optional(),
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
  productType: z
    .nativeEnum(ProductType, {
      required_error: 'Product type is required',
      invalid_type_error: 'Product type must be a valid enum value',
    })
    .default(ProductType.Regular)
    .optional(),
  batches: z
    .array(ProductBatchSchema)
    .min(1, 'Batches must have at least 1 item')
    .optional(),
  expiryDate: z.coerce.date().nullable().optional(),
})

export const ProductVariantSchema = BaseProductSchema.extend({
  id: z
    .string({
      invalid_type_error: 'Product Variant ID must be a string',
    })
    .optional(),
  variantOptions: z
    .array(OptionSchema)
    .min(1, 'Variant options must have at least 1 item'),
})

export const ProductSchema = BaseProductSchema.extend({
  variants: z
    .array(ProductVariantSchema)
    .optional()
    .refine(uniqueVariantCombinations, {
      message:
        'Product variants must have unique combinations of options and values',
    }),
})

const PartialBaseProductSchema = BaseProductSchema.partial()

type BaseProductType = z.infer<typeof PartialBaseProductSchema>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withProductTypeValidation<
  O extends BaseProductType,
  T extends z.ZodTypeDef,
  I,
>(schema: z.ZodType<O, T, I>) {
  return schema
    .refine(
      (data) => {
        if (data.productType === ProductType.Regular && data.batches) {
          return false
        }
        return true
      },
      {
        message: 'Batches are not allowed when productType is non material',
      },
    )
    .refine(
      (data) => {
        if (
          data.productType === ProductType.Regular &&
          data.measurement &&
          !['pieces', 'pcs', 'pc', 'piece'].includes(
            data.measurement.toLowerCase(),
          )
        ) {
          return false
        }
        return true
      },
      {
        message:
          'Measurement should only be piece(s) for non material products',
      },
    )
}

export type Product = z.infer<typeof ProductSchema>
export type ProductVariant = z.infer<typeof ProductVariantSchema>
