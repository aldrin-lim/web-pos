import * as htmlToImage from 'html-to-image'
import { ShareIcon } from '@heroicons/react/24/solid'

type ShareButtonProps = {
  elementToShare?: HTMLDivElement | null
}

const ShareButton = (props: ShareButtonProps) => {
  const { elementToShare } = props

  const shareScreenshot = async () => {
    if (!elementToShare) return null

    try {
      const dataUrl = await htmlToImage.toPng(elementToShare)

      // Convert dataUrl to Blob for sharing
      const blob = await (await fetch(dataUrl)).blob()
      const filesArray = [
        new File([blob], 'screenshot.png', { type: blob.type }),
      ]

      // Download blob
      // const url = URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = 'screenshot.png'
      // a.click()

      if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        await navigator.share({
          files: filesArray,
          title: 'Screenshot',
          text: 'Check out this screenshot!',
        })
      } else {
        alert("This browser doesn't support sharing files.")
      }
    } catch (error) {
      alert(error)
      console.error('Could not share the screenshot', error)
    }
  }

  return (
    <button
      onClick={shareScreenshot}
      className="btn btn-ghost flex flex-row items-center gap-3"
    >
      <ShareIcon className="w-4" />
      Send Receipt
    </button>
  )
}

export default ShareButton
