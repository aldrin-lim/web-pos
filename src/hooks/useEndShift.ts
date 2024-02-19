import { useMutation } from '@tanstack/react-query'
import * as API from 'api/shift'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

const useEndShift = () => {
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isEnding } = useMutation({
    mutationFn: API.endShift,
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
    isEnding,
    endShift: mutateAsync,
    error: error,
  }
}

export default useEndShift
