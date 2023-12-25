import { AxiosResponse } from 'axios'
import { Business, UpdateUserBusinessSchema } from 'types/business.type'
import { User } from 'types/user.type'
import { httpClient } from 'util/http'

export const getUser = async (email: string) => {
  const result = await httpClient
    .post<{ email: string }, AxiosResponse<User>>(`/users/me`, { email })
    .then((res) => res.data)
  return result
}

export type UpdateUserRequestParam = {
  firstName?: string
  lastName?: string
}

export const updateUser = async (param: UpdateUserRequestParam) => {
  const result = await httpClient
    .patch(`/users/me`, param)
    .then((res) => res.data)
  return result
}

export const updateUserBussiness = async (param: UpdateUserBusinessSchema) => {
  const {
    id,
    description,
    name,
    address,
    closingTime,
    openingTime,
    contactNumber,
  } = param
  const result = await httpClient
    .patch<Partial<Business>, AxiosResponse<Business>>(
      `/users/me/businesses/${id}`,
      { description, name, address, closingTime, openingTime, contactNumber },
    )
    .then((res) => res.data)
  return result
}
