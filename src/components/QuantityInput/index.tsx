type QuantityInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  value?: number
  onChange?: (value: number) => void
}

const QuantityInput = (props: QuantityInputProps) => {
  const { value = 0, onChange } = props
  return (
    <div className="join flex max-w-sm border  border-gray-300">
      <button
        disabled={props.disabled}
        className="join-itm  btn"
        onClick={() => {
          if (value > 0) {
            onChange && onChange(value - 1)
          }
        }}
      >
        -
      </button>
      <input
        {...props}
        onChange={(e) => {
          if (isNaN(+e.target.value)) {
            return
          }
          if (onChange) {
            onChange(+e.target.value)
          }
        }}
        inputMode="numeric"
        className={`join-item text-center ${props.className}`}
      />
      <button
        disabled={props.disabled}
        className="btn join-item"
        onClick={() => {
          onChange && onChange(value + 1)
        }}
      >
        +
      </button>
    </div>
  )
}

export default QuantityInput
