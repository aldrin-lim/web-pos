import { AxiosResponse } from 'axios'
import { MaterialSchema, RecipeSchema } from 'types/recipe.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (
  param: CreateRecipeRequestSchema,
): Promise<CreateRecipeResponseSchema> => {
  const result = await httpClient
    .post<CreateRecipeRequestSchema, AxiosResponse<CreateRecipeResponseSchema>>(
      `/recipes`,
      param,
    )
    .then((res) => res.data)
  return CreateRecipeResponseSchema.parse(result)
}

// Schema and Types
export type CreateRecipeRequestSchema = z.infer<
  typeof CreateRecipeRequestSchema
>
type CreateRecipeResponseSchema = z.infer<typeof CreateRecipeResponseSchema>

export const CreateRecipeRequestSchema = z.object({
  name: z.string({
    required_error: 'Recipe name is required',
    invalid_type_error: 'Recipe name is must be a string',
  }),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  measurement: z.string({
    required_error: 'Measurement is required',
    invalid_type_error: 'Measurement is must but a string',
  }),
  cost: z.number({
    required_error: 'Cost is required',
    invalid_type_error: 'Cost is must be a number',
  }),
  quantity: z.number({
    required_error: 'Quantity is required',
  }),
  materials: z
    .array(
      MaterialSchema.pick({
        cost: true,
        measurement: true,
        product: true,
        quantity: true,
      }),
    )
    .min(1, 'Materials must have at least 1 item'),
})

export const CreateRecipeResponseSchema = RecipeSchema
