import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useRegisterSW } from 'virtual:pwa-register/react'

function ReloadPrompt() {
  const [isLoading, setIsLoading] = useState(false)
  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker at: ${swUrl}`)
      console.log('SW Registered: ' + r)
      r &&
        setInterval(() => {
          console.log('Checking for sw update')
          r.update()
        }, 20000 /* 20s for testing purposes */)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  useEffect(() => {
    offlineReady &&
      toast.info('App is ready to work offline', {
        autoClose: 1000,
      })
  }, [offlineReady])

  if (needRefresh) {
    return (
      <dialog
        id="add_variant_dialog"
        className="modal absolute left-0 right-0 top-0 z-50 h-screen w-screen"
        style={{
          background: 'rgba(0,0,0,.4)',
        }}
        open={true}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">New app version available</h3>
          <p className="py-4">
            Its recommended to update the app. Please click update now
          </p>

          <div className="flex w-full flex-col gap-3">
            <button
              disabled={isLoading}
              onClick={() => {
                setIsLoading(true)
                updateServiceWorker()
              }}
              className="btn btn-error w-full text-white"
            >
              Update Now
            </button>
          </div>
        </div>
      </dialog>
    )
  }
}

export default ReloadPrompt
