import { PhotoIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

type ImageLoaderProps = {
  src?: string
  iconClassName: string
}

const ImageLoader = ({ src, iconClassName }: ImageLoaderProps) => {
  // State to track if the image has failed to load
  const [isImageBroken, setIsImageBroken] = useState(false)

  // Function to call when the image fails to load
  const handleImageError = () => {
    setIsImageBroken(true)
  }

  return src && !isImageBroken ? (
    <img src={src} alt="Product picture" onError={handleImageError} />
  ) : (
    <PhotoIcon className={iconClassName} />
  )
}

export default ImageLoader
