const MiddleTruncateText = ({
  text,
  maxLength,
}: {
  text: string
  maxLength: number
}) => {
  const truncateText = (str: string, max: number, endChars = 3) => {
    if (str.length <= max) return str
    const start = str.substring(0, max - endChars - 1)
    const end = str.substring(str.length - endChars)
    return `${start}...${end}`
  }

  return (
    <div className="overflow-hidden whitespace-nowrap">
      {truncateText(text, maxLength)}
    </div>
  )
}

export default MiddleTruncateText
