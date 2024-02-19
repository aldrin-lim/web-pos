import { useMutation } from '@tanstack/react-query'
import * as API from 'api/product'
import axios from 'axios'
import { toast } from 'react-toastify'

const useDeleteProduct = () => {
  const {
    mutateAsync: deleteProduct,
    isLoading: isDeleting,
    error: deleteProductError,
  } = useMutation({
    mutationFn: API.deleteProductById,
    retry: 0,
    onError: (error) => {
      let errorMessage = "We're sorry, we've encountered an issue. "
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response?.data?.message
        }
      }
      toast.error(errorMessage, {
        autoClose: 500,
        theme: 'colored',
      })
    },
    onSuccess: () => {
      toast.success('Product successfully deleted ', {
        autoClose: 500,
        theme: 'colored',
      })
    },
  })

  return {
    deleteProduct,
    isDeleting,
    deleteProductError,
  }
}

export default useDeleteProduct
