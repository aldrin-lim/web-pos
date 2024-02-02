import React, { useEffect, useRef, useState } from 'react'
import { PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid'

type ProductImagesProps = {
  images: Array<string>
  onImagesChange?: (images: Array<string>) => void
  disabled?: boolean
  size?: 'sm' | 'default'
  readOnly?: boolean
}

const defaultSize = '130px'
const smSize = '100px'

const ProductImages = (props: ProductImagesProps) => {
  const { size = 'default', readOnly = false } = props
  const imageSize = size === 'sm' ? smSize : defaultSize

  const [images, setImages] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onChange = (images: string[]) => {
    props.onImagesChange?.(images)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImageSrcs: string[] = []
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newImageSrcs.push(reader.result as string)
          if (newImageSrcs.length === files.length) {
            setImages((prev) => {
              onChange([...prev, ...newImageSrcs])
              return [...prev, ...newImageSrcs]
            })
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const onClick = () => {
    if (inputRef.current && !readOnly) {
      inputRef.current.click()
    }
  }

  const deleteImage = (indexToDelete: number) => {
    setImages((prev) => {
      if (onChange) {
        onChange(prev.filter((_, index) => index !== indexToDelete))
      }
      return prev.filter((_, index) => index !== indexToDelete)
    })
  }

  const showAddImageButton = images.length > 0 && images.length < 5
  const showInitialImageButton = images.length === 0 || readOnly

  useEffect(() => {
    if (props.images) {
      setImages(props.images)
    }
  }, [props.images])

  return (
    <div className={`flex w-full flex-row gap-5`}>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          id="fileInput"
          maxLength={5}
          disabled={images.length >= 5}
        />
        {showAddImageButton && (
          <button
            disabled={props.disabled}
            className={`btn btn-square mt-1 flex h-[100px] w-[100px] flex-col border-2 border-dashed border-gray-300`}
            onClick={onClick}
          >
            <PlusIcon className="w-8 text-success" />
          </button>
        )}
        {showInitialImageButton && (
          <button
            className={`btn btn-square mt-1 flex flex-col`}
            onClick={onClick}
            style={{
              width: imageSize,
              height: imageSize,
            }}
          >
            <PhotoIcon className="w-14 " />
            {!readOnly && <span className="text-xs ">Upload</span>}
          </button>
        )}
      </div>
      <div className="flex max-w-xs flex-row  gap-3 overflow-x-auto">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <div
              className={`flex justify-center overflow-hidden rounded-md border bg-gray-100`}
              style={{
                width: imageSize,
                height: imageSize,
              }}
            >
              <img src={image} alt="Uploaded preview" />
            </div>
            {!readOnly && (
              <button
                onClick={() => deleteImage(index)}
                className="btn btn-circle btn-ghost btn-xs absolute right-2 top-2 bg-purple-300"
              >
                <TrashIcon className="w-4 text-white" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImages
