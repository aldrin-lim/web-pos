import * as htmlToImage from 'html-to-image'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

type ShareButtonProps = {
  elementToShare?: HTMLDivElement | null
  fileName?: string
}

const ShareButton = (props: ShareButtonProps) => {
  const { elementToShare, fileName } = props

  const shareScreenshot = async () => {
    const recipetContainer = document.getElementById('receipt-container')
    console.log(recipetContainer)
    if (!recipetContainer) return null

    try {
      const dataUrl = await htmlToImage.toPng(recipetContainer)

      // Convert dataUrl to Blob for sharing
      const blob = await (await fetch(dataUrl)).blob()

      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.download = fileName || 'receipt.png'
      a.click()
    } catch (error) {
      console.error('Could not share the screenshot', error)
    }
  }

  return (
    <button
      onClick={shareScreenshot}
      className="btn btn-ghost flex flex-row items-center gap-3"
    >
      <ArrowDownTrayIcon className="w-4" />
      Download Receipt
    </button>
  )
}

export default ShareButton
