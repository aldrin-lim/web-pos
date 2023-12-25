interface ConfirmDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  message: string
  title: string
}

const ConfirmDialog = ({
  isOpen,
  onCancel,
  onConfirm,
  message,
  title,
}: ConfirmDialogProps) => {
  return (
    <dialog
      id="add_variant_dialog"
      className="modal absolute left-0 right-0 top-0 z-50 -ml-6 h-screen w-screen"
      style={{
        background: 'rgba(0,0,0,.4)',
      }}
      open={isOpen}
    >
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="py-4">{message}</p>
        <p className="py-4">
          Click <strong>Confirm</strong> to continue.
        </p>
        <div className="flex w-full flex-col gap-3">
          <button
            onClick={onConfirm}
            className="btn btn-error w-full text-white"
          >
            Confirm
          </button>
          <button onClick={onCancel} className="btn mx-0 w-full">
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
