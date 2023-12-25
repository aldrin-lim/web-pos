import { Business } from './business.type'

export type User = {
  firstName: string
  lastName: string
  email: string
  businesses: Array<Business>
}
