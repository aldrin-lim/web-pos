import React, { useState, useEffect } from 'react'

type PriceInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  value?: number
  onChange: (value: number) => void
  showDecimal?: boolean
}

const PriceInput: React.FC<PriceInputProps> = (props) => {
  const { value = 0, onChange, showDecimal = true, ...rest } = props
  // Initialize the state with the value if it's not zero, else with an empty string
  const [inputValue, setInputValue] = useState<string>(
    value === 0 ? '' : value.toFixed(showDecimal ? 2 : 0).toString(),
  )

  useEffect(() => {
    // Update the inputValue only when the value prop changes externally
    setInputValue(value.toString())
  }, [value])

  useEffect(() => {
    setInputValue(
      value === 0 ? '0' : value.toFixed(showDecimal ? 2 : 0).toString(),
    )
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/[^0-9.]/g, '') // Remove non-numeric characters

    // Limit the number of decimal places to 2, if there's a decimal
    const parts = newValue.split('.')
    if (parts.length > 1 && parts[1].length > 2) {
      newValue = parts[0] + '.' + parts[1].slice(0, 2)
    }

    setInputValue(newValue)

    const numericValue = parseFloat(newValue)
    if (!isNaN(numericValue)) {
      onChange(numericValue)
    } else if (newValue === '') {
      onChange(0) // Handle the case when the input is cleared
    }
  }

  return (
    <input
      {...rest}
      type="text"
      inputMode="decimal"
      value={inputValue}
      onChange={handleChange}
    />
  )
}

export default PriceInput
