type DropdownItemProps = {
  icon?: React.ReactNode
  text: string
  onClick?: () => void
  disabled?: boolean
}

const DropdownButtonItem = (props: DropdownItemProps) => {
  const { disabled, icon, text, onClick } = props

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn btn-ghost flex flex-row items-center justify-center gap-1 rounded-none text-gray-900"
    >
      {icon}
      {text}
    </button>
  )
}

export default DropdownButtonItem
