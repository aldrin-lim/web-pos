import { toNumber } from 'lodash'
import CurrencyInput from 'react-currency-input-field'

type QuantityInputProps = {
  disabled?: boolean
  className: string
  value?: string
  onChange?: (string?: string) => void
  onAdd?: (string?: string) => void
  onSubtract?: (string?: string) => void
}

const QuantityInput = (props: QuantityInputProps) => {
  const { value = 0, onChange, onAdd, onSubtract } = props
  return (
    <div className="join flex  border  border-secondary">
      <button
        disabled={props.disabled}
        className="join-itm  btn"
        onClick={() => {
          if (toNumber(value) > 0) {
            onChange && onChange(`${+value - 1}`)
          }
          onSubtract && onSubtract(`${+value - 1}`)
        }}
      >
        -
      </button>
      <CurrencyInput
        decimalsLimit={40}
        value={value}
        onValueChange={(value) => {
          if (onChange) {
            onChange(value)
          }
        }}
        disableGroupSeparators={true}
        inputMode="decimal"
        className={`join-item text-center text-base ${props.className} bg-base-100`}
      />
      <button
        disabled={props.disabled}
        className="btn join-item"
        onClick={() => {
          onChange && onChange(`${+value + 1}`)
          onAdd && onAdd(`${+value + 1}`)
        }}
      >
        +
      </button>
    </div>
  )
}

export default QuantityInput
