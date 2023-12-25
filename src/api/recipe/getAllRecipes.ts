import { AxiosResponse } from 'axios'
import { PaginationOptions } from 'types/api.types'
import { ProductSchema } from 'types/product.types'
import { RecipeSchema } from 'types/recipe.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (
  param?: PaginationOptions,
): Promise<GetAllRecipeResponseSchema> => {
  let url = '/recipes'

  if (param && Object.keys(param).length > 0) {
    url = `${url}?${new URLSearchParams(param as string).toString()}`
  }

  const result = await httpClient
    .get<unknown, AxiosResponse<null, GetAllRecipeResponseSchema>>(url)
    .then((res) => res.data)
  return GetAllRecipeResponseSchema.parse(result)
}

// Schema and Types
export type GetAllRecipeResponseSchema = z.infer<
  typeof GetAllRecipeResponseSchema
>

const GetAllRecipeResponseSchema = z.array(RecipeSchema)
