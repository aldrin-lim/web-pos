import { ChevronLeftIcon, UserIcon } from '@heroicons/react/24/outline'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import { Field, FieldProps, FormikProvider, useFormik } from 'formik'
import useGetCustomers from 'hooks/useGetCustomers'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from '@uidotdev/usehooks'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useQueryClient } from '@tanstack/react-query'
import { Customer, customerSchema } from 'types/customer.types'

type CustomerDetailProps = {
  customer?: Customer
  setCustomer?: (customer: Customer | undefined) => void
}

const CustomerDetail = (props: CustomerDetailProps) => {
  const { customer, setCustomer } = props
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: customer ?? {
      name: '',
      location: '',
      email: '',
      contact: '',
    },
    enableReinitialize: true,
    onSubmit: async (values) => {},
    validationSchema: toFormikValidationSchema(customerSchema),
  })

  const { values, setValues } = formik

  const debouncedSearchTerm = useDebounce(values.name, 500)

  const { customers, isLoading } = useGetCustomers(debouncedSearchTerm)

  const onCustomerSelect = (customer: Customer) => {
    const elem = document.activeElement as HTMLElement
    if (elem) {
      setTimeout(() => {
        elem.blur()
      }, 150)
    }
    if (customer) {
      setValues(customer)
    }
  }

  useEffect(() => {
    if (setCustomer) {
      if (Object.values(values).every((v) => v === '')) {
        setCustomer(undefined)
      } else {
        setCustomer(values)
      }
    }
  }, [setCustomer, values])

  useEffect(() => {
    queryClient.invalidateQueries(['customers'])
  }, [queryClient, values.name])

  return (
    <div className="screen">
      <Toolbar
        items={[
          <ToolbarButton
            key={'negative'}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => navigate('../')}
          />,
          <ToolbarTitle key="title" title="Customer " />,
        ]}
      />

      <div className="flex h-full flex-col gap-4 pb-4">
        <FormikProvider value={formik}>
          <div className="dropdown w-full bg-transparent">
            <div tabIndex={0}>
              <Field name="name">
                {({
                  field, // { name, value, onChange, onBlur }
                  meta,
                }: FieldProps) => (
                  <label className="form-control w-full ">
                    <div className="">
                      <span className="label-text-alt text-gray-400">Name</span>
                    </div>
                    <input
                      {...field}
                      autoComplete="off"
                      type="text"
                      className="input input-bordered w-full pr-10"
                      tabIndex={1}
                      placeholder="Customer Name"
                    />
                    {isLoading && (
                      <span className="loading loading-dots absolute bottom-3 right-2" />
                    )}

                    {meta.touched && meta.error && (
                      <div className="form-field-error label py-0">
                        <span className="label-text-alt text-xs text-red-400">
                          {meta.error}
                        </span>
                      </div>
                    )}
                  </label>
                )}
              </Field>
            </div>
            {customers && customers.length > 0 && (
              <ul
                tabIndex={0}
                className="menu dropdown-content z-[1]  w-full rounded-box bg-base-300 p-2 shadow"
              >
                <li className="mb-2 text-xs"> Customers: </li>
                {customers.map((customer) => {
                  return (
                    <li key={customer.id}>
                      <a onClick={() => onCustomerSelect(customer)}>
                        <UserIcon className="w-4 text-white" /> &nbsp;
                        {customer.name ||
                          `Guest (${customer.contact || customer.email || customer.location})`}
                      </a>
                    </li>
                  )
                })}
                {/* <li>
                  <a onClick={handleClick}>
                    <UserIcon className="w-4 text-white" /> &nbsp;Aldrin Lim asd
                    a
                  </a>
                </li>
                <li>
                  <a onClick={handleClick}>
                    <UserIcon className="w-4 text-white" /> &nbsp;Belle Fabito
                  </a>
                </li> */}
              </ul>
            )}
          </div>

          {/* Contact */}
          <Field name="contact">
            {({
              field, // { name, value, onChange, onBlur }
              meta,
            }: FieldProps) => (
              <label className="form-control w-full ">
                <div className="">
                  <span className="label-text-alt text-gray-400">
                    Contact # (optional)
                  </span>
                </div>
                <input
                  {...field}
                  autoComplete="off"
                  type="text"
                  className="input input-bordered w-full"
                  tabIndex={3}
                />

                {meta.touched && meta.error && (
                  <div className="form-field-error label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {meta.error}
                    </span>
                  </div>
                )}
              </label>
            )}
          </Field>

          {/* Email */}
          <Field name="email">
            {({
              field, // { name, value, onChange, onBlur }
              meta,
            }: FieldProps) => (
              <label className="form-control w-full ">
                <div className="">
                  <span className="label-text-alt text-gray-400">
                    Email (optional)
                  </span>
                </div>
                <input
                  {...field}
                  autoComplete="off"
                  type="email"
                  className="input input-bordered w-full"
                  tabIndex={4}
                />

                {meta.touched && meta.error && (
                  <div className="form-field-error label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {meta.error}
                    </span>
                  </div>
                )}
              </label>
            )}
          </Field>

          {/* Location */}
          <Field name="location">
            {({
              field, // { name, value, onChange, onBlur }
              meta,
            }: FieldProps) => (
              <label className="form-control w-full ">
                <div className="">
                  <span className="label-text-alt text-gray-400">
                    Location (optional)
                  </span>
                </div>
                <input
                  {...field}
                  autoComplete="off"
                  type="text"
                  className="input input-bordered w-full"
                  tabIndex={2}
                />

                {meta.touched && meta.error && (
                  <div className="form-field-error label py-0">
                    <span className="label-text-alt text-xs text-red-400">
                      {meta.error}
                    </span>
                  </div>
                )}
              </label>
            )}
          </Field>

          {/* <div className="mt-4 flex w-full flex-col gap-2">
            <button type="submit" className="btn btn-primary ">
              Save
            </button>
          </div> */}
        </FormikProvider>
      </div>
    </div>
  )
}

export default CustomerDetail
