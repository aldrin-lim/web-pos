import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { httpClient } from 'util/http'

const useVoidOrder = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async (param: {
      orderId: string
      shiftId: string
      voidPin: string
    }) => {
      const { orderId, shiftId, voidPin } = param
      const url = `/orders/${orderId}/void?shiftId=${encodeURIComponent(
        shiftId,
      )}`

      const result = await httpClient
        .post(url, { voidPin })
        .then((res) => res.data)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders'])
    },
    retry: 0,
    onError: (error) => {
      let errorMessage = "We're sorry, we've encountered an issue."
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response?.data?.message
        }
      }
      toast.error(errorMessage, {
        autoClose: 500,
        theme: 'colored',
      })
      setError(error)
    },
  })

  return {
    isLoading,
    voidOrder: mutateAsync,
    error: error,
  }
}

export default useVoidOrder
