import { AxiosResponse } from 'axios'
import { Shift } from 'types/shift.types'
import { httpClient } from 'util/http'
import { z } from 'zod'

export default async (
  param: z.infer<typeof StartShiftValidationSchema>,
): Promise<Shift> => {
  const url = `/shifts/start`

  const result = await httpClient
    .post<unknown, AxiosResponse<Shift>>(url, param)
    .then((res) => res.data)

  return result
}

export const StartShiftValidationSchema = z.object({
  name: z.string().optional(),
  notes: z.string().optional(),
  openingPettyCash: z
    .number({
      coerce: true,
      required_error: 'Opening petty cash is required',
    })
    .nonnegative({
      message: 'Opening petty cash must be a positive number',
    }),
  openedBy: z.string({
    required_error: 'Opened by is required',
  }),
})
