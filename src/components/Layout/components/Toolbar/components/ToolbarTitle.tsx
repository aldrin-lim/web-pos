type ToolbarTitleProps = {
  title: string
  description?: string
}

const ToolbarTitle: React.FC<ToolbarTitleProps> = ({ title, description }) => {
  return (
    <div className="col-span-8 col-start-3 flex flex-col gap-0 self-center py-3 text-center capitalize">
      <h1 className="font-bold text-white">{title}</h1>
      {description && <p className="text-xs">{description}</p>}
    </div>
  )
}

export default ToolbarTitle
