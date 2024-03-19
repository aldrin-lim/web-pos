import { useQuery } from '@tanstack/react-query'
import { PaginationOptions } from 'types/api.types'
import * as API from 'api/recipe'

const useAllRecipes = (param?: PaginationOptions) => {
  const {
    data,
    isFetching: isLoading,
    error,
  } = useQuery({
    queryKey: ['recipes', param],
    queryFn: () => API.getAllRecipe(param),
    retry: 0,
    refetchOnWindowFocus: true,
  })

  return {
    recipes: data,
    error,
    isLoading,
  }
}

export default useAllRecipes
