import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as API from 'api/productCollection'
import { UpdateProductCollectionSchema } from 'api/productCollection/updateDefaultProductCollection'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'

const useUpdateProductCollection = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isUpdating } = useMutation({
    mutationFn: API.updateDefaultProductCollection,
    retry: 0,
    onError: (error) => {
      let errorMessage = "We're sorry, we've encountered an issue. "
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response?.data?.message
        }
      }
      toast.error(errorMessage, {
        autoClose: 3000,
        theme: 'colored',
      })
      setError(error)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['productCollection', 'default'])
    },
  })

  const updateProductCollection = async (
    param: z.infer<typeof UpdateProductCollectionSchema>,
  ) => {
    await mutateAsync(param)
  }

  return {
    updateProductCollection,
    isUpdating,
    updateProductCollectionError: error,
  }
}

export default useUpdateProductCollection
