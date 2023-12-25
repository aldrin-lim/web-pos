type ToolbarButtonProps = {
  label?: string
  onClick?: () => void
  icon?: React.ReactNode
  disabled?: boolean
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  label,
  onClick,
  icon,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-link px-0 normal-case text-blue-400 no-underline disabled:bg-transparent disabled:text-gray-400"
      disabled={disabled}
    >
      {label}
      {icon}
    </button>
  )
}

export default ToolbarButton
