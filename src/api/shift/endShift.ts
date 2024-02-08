import { AxiosResponse } from 'axios'
import { Shift } from 'types/shift.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (
  param: z.infer<typeof EndShiftValidationSchema>,
): Promise<Shift> => {
  const url = `/shifts/end`

  const result = await httpClient
    .post<unknown, AxiosResponse<Shift>>(url, param)
    .then((res) => res.data)

  return result
}

export const EndShiftValidationSchema = z.object({
  closingPettyCash: z
    .number({
      coerce: true,
      required_error: 'Closing petty cash is required',
    })
    .default(0),
  closedBy: z.string({
    required_error: 'Opened by is required',
  }),
})
