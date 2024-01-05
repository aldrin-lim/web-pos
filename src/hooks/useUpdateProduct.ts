import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as API from 'api/product'
import { UpdateProductSchema } from 'api/product/updateProductById'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Product } from 'types/product.types'

const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isUpdating } = useMutation({
    mutationFn: API.updateProductById,
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
    onSuccess: (_, param) => {
      toast.success('Product successfully updated! ', {
        autoClose: 2000,
        theme: 'colored',
      })
      queryClient.invalidateQueries(['product', param.id])
    },
  })

  const updateProduct = async (param: Product) => {
    const validation = UpdateProductSchema.safeParse(param)

    if (!validation.success) {
      const error = validation.error.issues[0].message
      console.log(error)
      return
    }

    const requestBody = validation.data
    await mutateAsync({ id: requestBody.id, product: requestBody })
  }

  return {
    updateProduct,
    isUpdating,
    updateProductError: error,
  }
}

export default useUpdateProduct
