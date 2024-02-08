import { useMutation } from '@tanstack/react-query'
import * as API from 'api/shift'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

const useStartShift = () => {
  const [error, setError] = useState<unknown | undefined | null>(null)

  const { mutateAsync, isLoading: isStarting } = useMutation({
    mutationFn: API.startShift,
    retry: 0,
    onError: (error) => {
      let errorMessage = "We're sorry, we've encountered an issue."
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
  })

  return {
    isStarting,
    startShift: mutateAsync,
    error: error,
  }
}

export default useStartShift
