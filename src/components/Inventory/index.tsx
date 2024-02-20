import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, PhotoIcon } from '@heroicons/react/24/solid'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import MiddleTruncateText from 'components/MiddleTruncatedText'
import useMediaQuery, { ScreenSize } from 'hooks/useMediaQuery'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Product } from 'types/product.types'
import { isWithinExpiration } from 'util/data'
import GetStarted from './components/GetStarted'
import { formatToPeso } from 'util/currency'

type InventoryProps = {
  showAddProduct?: boolean
  onProductSelect?: (product: Product) => void
  onBack?: () => void
  products: Product[]
  isLoading?: boolean
}

const Inventory = (props: InventoryProps) => {
  const {
    products = [],
    isLoading,
    onProductSelect,
    showAddProduct = false,
  } = props
  const navigate = useNavigate()
  const { currentBreakpoint } = useMediaQuery({ updateOnResize: true })

  const [nameFilter, setNameFilter] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(nameFilter.toLowerCase()),
    )
  }, [nameFilter, products])

  const numberOfNearExpirationProducts = products.filter((product) =>
    isWithinExpiration(product.activeBatch.expirationDate),
  ).length

  return (
    <div className="screen gap-0 pb-[100px]">
      <Toolbar
        items={[
          <ToolbarButton
            key={'negative'}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={() => {
              if (props.onBack) {
                props.onBack()
              } else {
                // navigate(AppPath.Products)
              }
            }}
          />,

          <ToolbarTitle key="title" title="Inventory" />,
          showAddProduct && (
            <ToolbarButton
              key={'postive'}
              label="postive"
              // onClick={() => navigate(AppPath.AddProduct)}
            />
          ),
        ]}
      />

      {isLoading ? <Skeleton /> : null}
      {!isLoading && products.length === 0 && <GetStarted />}
      {!isLoading && products.length > 0 && (
        <div className="relative flex flex-col gap-0">
          <div className="shadow-xs sticky top-[49px] z-[10] space-y-4 border-b border-b-slate-100 bg-base-100 py-4 ">
            {numberOfNearExpirationProducts > 0 && (
              <div
                role="alert"
                className="1 alert alert-warning flex flex-row gap-2 rounded-md p-2 text-primary-content"
              >
                <InformationCircleIcon className="w-4" />
                <span className="text-xs">
                  <strong>{numberOfNearExpirationProducts}</strong> item(s) are
                  about to expire
                </span>
              </div>
            )}
            <input
              className="input input-bordered w-full "
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Search Product by Name"
            />
          </div>

          <div className="flex w-full flex-row justify-between bg-gray-200 p-2">
            <p className="uppercase">PRODUCT</p>
            <p className="uppercase">COST</p>
          </div>
          <ul className="menu w-full border-b p-0 [&_li>*]:rounded-md [&_li>*]:border-b">
            {filteredProducts.map((product) => (
              <li
                onClick={() => onProductSelect?.(product)}
                key={product.id}
                className="w-full"
              >
                <a className="flex">
                  <div className="flex w-full flex-row justify-between gap-4">
                    <div className="flex flex-row items-center gap-2">
                      {product?.images.length === 0 && (
                        <div className="rounded-md bg-base-300 p-2">
                          <PhotoIcon className="w-5  " />
                        </div>
                      )}
                      {product?.images.length > 0 && (
                        <img
                          src={product.images[0]}
                          className="bg h-9 w-9 rounded-md"
                        />
                      )}
                      <div className="flex flex-col ">
                        <h1
                          className={[
                            'text-base',
                            isWithinExpiration(
                              product.activeBatch.expirationDate,
                            )
                              ? 'text-orange-400'
                              : '',
                          ].join(' ')}
                        >
                          <MiddleTruncateText
                            text={`${product.name}`}
                            maxLength={getTruncateSize(currentBreakpoint)}
                          />
                        </h1>
                        {product.trackStock && product.outOfStock === false ? (
                          <p className="text-xs">{product.availability}</p>
                        ) : (
                          <p className="text-xs text-red-500">Out of stock</p>
                        )}
                      </div>
                    </div>
                    {product.isBulkCost && (
                      <div className="text-right">
                        <p className="text-base font-medium">
                          {formatToPeso(product.activeBatch.costPerUnit ?? 0)}
                        </p>
                        <p className="text-xs">
                          / {product.activeBatch.unitOfMeasurement}
                        </p>
                      </div>
                    )}

                    {!product.isBulkCost && (
                      <div className="text-right">
                        <p className="text-base font-medium">
                          {formatToPeso(product.activeBatch.cost)}
                        </p>
                      </div>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const Skeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="skeleton h-[48px] rounded-md" />

      <div className="skeleton h-[40px] rounded-md" />

      <div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
        <div className=" px-4 py-2">
          <div className="skeleton h-[40px] rounded-md" />
        </div>
      </div>
    </div>
  )
}

const getTruncateSize = (size: ScreenSize) => {
  switch (size) {
    case 'xs':
      return 10
    case 'sm':
      return 20
    case 'md':
      return 200
    case 'lg':
      return 200
    default:
      return 500
  }
}

export default Inventory
