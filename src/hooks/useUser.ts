import { useQuery } from '@tanstack/react-query'
import { getUser } from 'api/users.api'
import { useAuth } from 'contexts/AuthContext'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { Business } from 'types/business.type'

const useUser = () => {
  const { user } = useAuth()
  const [taxRate, setTaxRate] = useState<number | null>(null)
  const [tax, setTax] = useState<Business['tax'] | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(user?.email ?? ''),
    retry: 0,
    refetchOnWindowFocus: true,
  })

  useEffect(() => {
    const business = get(data, 'businesses[0]') as Business | undefined
    if (business && business.tax?.amount) {
      setTax(business.tax)
      setTaxRate(business.tax.amount)
    }
  }, [data])

  return {
    tax,
    taxRate,
    user: data,
    error,
    isLoading,
  }
}

export default useUser
