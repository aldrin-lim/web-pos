import { useState, useEffect } from 'react'
import Select from 'react-select'

export type OptionsValue = {
  label: string
  value: string
}

export type AutoCompleteProps = {
  options: Array<string> | Array<OptionsValue>
  defaultValue?: string | OptionsValue
  maxMenuHeight?: number
  className?: string
  onChange?: (value: OptionsValue | null) => void
  value: string | OptionsValue
}

const AutocompleteSelect = (props: AutoCompleteProps) => {
  const { options, defaultValue, value, maxMenuHeight = 120 } = props

  // Function to transform a string or OptionsValue to the required format
  const transformOption = (option: string | OptionsValue) => {
    return typeof option === 'string'
      ? { label: option, value: option }
      : option
  }

  // Transforming all options
  const transformedOptions = options.map(transformOption)

  // Initializing the selectedOption state
  const [selectedOption, setSelectedOption] = useState<OptionsValue | null>(
    defaultValue ? transformOption(defaultValue) : null,
  )

  useEffect(() => {
    // Update the state if the defaultValue prop changes
    if (defaultValue) {
      setSelectedOption(transformOption(defaultValue))
    }
  }, [defaultValue])

  useEffect(() => {
    // Update the state if the value prop changes
    if (value) {
      setSelectedOption(transformOption(value))
    }
  }, [value])

  const handleChange = (newValue: OptionsValue | null) => {
    setSelectedOption(newValue)
    if (props.onChange) {
      props.onChange(newValue)
    }
  }

  const customStyles = {
    menuList: (provided: object) => ({
      ...provided,
      maxHeight: `${maxMenuHeight}px`, // Limiting the height of the menu list
      overflowY: 'auto', // Adding scroll to the menu list
    }),
  }

  return (
    <Select
      isClearable
      minMenuHeight={40}
      value={selectedOption}
      onChange={(option, actionMeta) => {
        if (actionMeta.action === 'select-option') {
          handleChange(option)
        }
      }}
      options={transformedOptions}
      styles={customStyles as object}
      className={props.className}
      getOptionValue={(option) => option.label}
      classNamePrefix="select"
      placeholder="Select "
      isSearchable
      menuPlacement="auto"
    />
  )
}

export default AutocompleteSelect
