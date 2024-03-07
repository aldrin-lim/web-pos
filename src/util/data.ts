import { EXPIRATION } from 'constants/product'
import moment from 'moment'
// Expiration time in seconds (one week)

export function isWithinExpiration(inputDate?: Date | null) {
  // Check if the input date is null
  if (!inputDate) {
    return false
  }

  // Parse the input date using Moment.js
  const date = moment(inputDate)

  // Check if the input date is valid
  if (!date.isValid()) {
    return false
  }

  // Get the current date and time
  const now = moment()

  // Calculate the expiration date from the input date
  const expirationDate = moment(inputDate).add(EXPIRATION, 'seconds')

  // Check if the current date is before the expiration date
  return now.isBefore(expirationDate)
}

export const isExpired = (expirationDate: Date | null) => {
  if (!expirationDate) {
    return false
  }

  const date = moment(expirationDate)
  const now = moment()

  return now.isAfter(date)
}
