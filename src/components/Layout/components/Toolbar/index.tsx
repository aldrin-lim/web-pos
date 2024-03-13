import React from 'react'

type ToolbarProps = {
  items: Array<React.ReactNode>
}

const Toolbar: React.FC<ToolbarProps> = ({ items }) => {
  return (
    <div className="ToolbarContainer border-b:bg-base-100 sticky left-0 top-0 z-10 w-full bg-base-100 shadow-sm">
      <div className="Toolbar grid w-full grid-cols-3 items-end bg-base-100 [&>*:nth-child(1)]:justify-start [&>*:nth-child(3)]:justify-end">
        {items}
      </div>
    </div>
  )
}

export default Toolbar
