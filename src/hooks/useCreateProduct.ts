import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as API from 'api/product'
import { AddProductSchema } from 'api/product/createProduct'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppPath } from 'routes/AppRoutes.types'
import { Product } from 'types/product.types'

const useCreateProduct = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isCreating } = useMutation({
    mutationFn: API.createProduct,
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
    onSuccess: async (data) => {
      toast.success('Product successfully created! ', {
        autoClose: 2000,
        theme: 'colored',
      })
      await queryClient.invalidateQueries(['product', data.id])
      navigate(`${AppPath.Products}/${data.id}`)
    },
  })

  const createProduct = async (param: Product) => {
    const validation = AddProductSchema.safeParse(param)

    if (!validation.success) {
      const error = validation.error.issues[0].message
      setError(error)
      return
    }

    const requestBody = validation.data

    await mutateAsync(requestBody)
  }

  return {
    createProduct,
    isCreating,
    createProductError: error,
  }
}

export default useCreateProduct
