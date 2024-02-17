import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as API from 'api/order'
import { FulFillOrderValidationSchema } from 'api/order/fulfillOrder'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

const useFulfillOrder = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: API.fulfillOrder,
    retry: 0,
    onError: (error) => {
      let errorMessage = "We're sorry, we've encountered an issue. "
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response?.data?.message
        }
      }
      toast.error(errorMessage, {
        autoClose: 1000,
        theme: 'colored',
      })
      setError(error)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['productCollection'])
      await queryClient.invalidateQueries(['products'])
    },
  })

  const fulfillOrder = async (param: unknown) => {
    const validation = FulFillOrderValidationSchema.safeParse(param)

    if (!validation.success) {
      const error = validation.error.issues[0].message
      console.error(validation.error)
      setError(error)
      return
    }

    const requestBody = validation.data

    return await mutateAsync(requestBody)
  }

  return {
    fulfillOrder,
    isLoading,
    error,
  }
}

export default useFulfillOrder
