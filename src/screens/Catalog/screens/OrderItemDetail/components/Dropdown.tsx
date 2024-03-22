import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

type DropdownProps = {
  onDiscountClick?: () => void
}

const Dropdown = (props: DropdownProps) => {
  const { onDiscountClick } = props
  const [open, setOpen] = useState(false)

  return (
    <div
      tabIndex={0}
      className={[
        'dropdown dropdown-end col-start-12 inline-flex w-auto',
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
        className={`btn btn-link px-0 normal-case text-blue-400 no-underline`}
      >
        <EllipsisVerticalIcon className="w-6" />
      </label>
      {open && (
        <div className="dop menu dropdown-content top-10 flex w-36 flex-col overflow-hidden rounded-md bg-neutral p-0 shadow">
          <button
            onClick={onDiscountClick}
            className="btn btn-ghost flex flex-row items-center justify-center gap-1 rounded-none "
          >
            Discount
          </button>
        </div>
      )}
    </div>
  )
}

export default Dropdown
