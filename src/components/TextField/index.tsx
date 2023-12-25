import { useRef, useState } from 'react'
import { InputProps } from './Input.types'

import styles from './styles.module.css'

const TextField: React.FC<InputProps> = (props) => {
  const { label, placeholder } = props
  const [isFocused, setIsFocused] = useState(false)
  const ref = useRef<HTMLInputElement | null>(null)

  return (
    <div className="relative w-full">
      <input
        {...props}
        ref={ref}
        type="text"
        placeholder={placeholder || ' '}
        className={[
          styles.TextField,
          label ? styles.TextField___withLabel : '',
        ].join(' ')}
        onFocus={(e) => {
          setIsFocused(true)
          if (props.onFocus) {
            props.onFocus(e)
          }
        }}
        onBlur={(e) => {
          if (props.onBlur) {
            props.onBlur(e)
          }
          ;``
          setIsFocused(false)
        }}
      />
      <label
        htmlFor="email"
        className={[
          styles.TextField_Label,
          isFocused ? styles.TextField_Label___inputFocused : '',
          ref.current?.value ? styles.TextField_Label___inputValue : '',
        ].join(' ')}
      >
        {label}
      </label>
    </div>
  )
}

export default TextField
