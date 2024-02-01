import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import DropdownButtonItem from './components/DropdownButtonItem'

type DropdownProps = {
  items: Array<{
    icon?: React.ReactNode
    text: string
    onClick?: () => void
  }>
  disabled?: boolean
  buttonClassName?: string
}

const DropdownButton = (props: DropdownProps) => {
  const { items, buttonClassName, disabled = false } = props
  const [open, setOpen] = useState(false)

  return (
    <div
      tabIndex={0}
      className={[
        'dropdown dropdown-end inline-flex w-auto',
        open ? 'dropdown-open' : '',
      ].join(' ')}
      onBlur={() => {
        setTimeout(() => {
          setOpen(false)
        }, 50)
      }}
    >
      <label
        onClick={() => setOpen((prev) => !prev)}
        className={`btn ${buttonClassName}`}
      >
        <EllipsisVerticalIcon className="w-6" />
      </label>
      {open && (
        <div className="dop menu dropdown-content top-10 flex w-36 flex-col overflow-hidden rounded-md bg-base-100 p-0 shadow">
          {items.map((item, index) => {
            return (
              <DropdownButtonItem key={index} {...item} disabled={disabled} />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DropdownButton
