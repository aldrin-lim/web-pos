import React from 'react'

type ToolbarProps = {
  items: Array<React.ReactNode>
}

const Toolbar: React.FC<ToolbarProps> = ({ items }) => {
  return (
    <div className="Toolbar relative grid grid-cols-3 items-end [&>*:nth-child(1)]:justify-start [&>*:nth-child(3)]:justify-end">
      {items}
    </div>
  )
}

export default Toolbar
