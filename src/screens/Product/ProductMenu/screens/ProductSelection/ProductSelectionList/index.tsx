import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid'
import { useInfiniteQuery } from '@tanstack/react-query'
import ImageLoader from 'components/ImageLoader'
import Toolbar from 'components/Layout/components/Toolbar'
import ToolbarButton from 'components/Layout/components/Toolbar/components/ToolbarButton'
import ToolbarTitle from 'components/Layout/components/Toolbar/components/ToolbarTitle'
import MiddleTruncateText from 'components/MiddleTruncatedText'
import useMediaQuery, { ScreenSize } from 'hooks/useMediaQuery'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { FixedSizeList as List } from 'react-window'
import getAllProducts from 'api/product/getAllProducts'
import {
  useProductMenuContext,
  ProductMenuActionType,
  ProductMenuActiveScreen,
} from 'screens/Product/ProductMenu/context/ProductMenuContext'
import useUpdateProductCollection from 'hooks/useUpdateProductCollection'

const getTruncateSize = (size: ScreenSize) => {
  switch (size) {
    case 'xs':
      return 10
    case 'sm':
      return 25
    case 'md':
      return 200
    case 'lg':
      return 200
    default:
      return 500
  }
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

type ProductSelectionListProps = {
  onBack: () => void
}

const ProductSelectionList = (props: ProductSelectionListProps) => {
  const { onBack } = props

  const { updateProductCollection, isUpdating } = useUpdateProductCollection()

  const {
    state: {
      productCollectionState: { activeCollection },
    },
    dispatch,
  } = useProductMenuContext()

  const goBackToMainScreen = useCallback(() => {
    dispatch({
      type: ProductMenuActionType.UpdateActiveScreen,
      payload: {
        screen: ProductMenuActiveScreen.None,
      },
    })
  }, [dispatch])

  const [searchParams] = useSearchParams()
  const [page] = useState(0)

  const { currentBreakpoint } = useMediaQuery({ updateOnResize: true })

  const [enableFilter, setEnableFilter] = useState(false)
  const [outOfStockFilter, setOutOfStockFilter] = useState<
    boolean | undefined
  >()
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 100)

  const { data, isLoading, error } = useInfiniteQuery(
    ['products'],
    ({ pageParam = 1 }) => getAllProducts({ limit: 100, page: pageParam }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (page > 1 && lastPage.length < 10) return undefined
        return pages.length + 1
      },
      retry: 2,
    },
  )

  const filteredProducts = useMemo(() => {
    let items = data?.pages.flatMap((page) => page) || []

    const productInCollectionIds =
      activeCollection?.products.map((p) => p.id) ?? []

    // Apply out-of-stock filter
    if (enableFilter && typeof outOfStockFilter === 'boolean') {
      items = items.filter((item) =>
        outOfStockFilter ? item.quantity === 0 : item.quantity > 0,
      )
    }

    // Apply search filter
    if (debouncedSearchTerm) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      )
    }

    return items.filter((p) => !productInCollectionIds.includes(p.id ?? ''))
  }, [
    data?.pages,
    activeCollection?.products,
    enableFilter,
    outOfStockFilter,
    debouncedSearchTerm,
  ])

  useEffect(() => {
    const paramsObject = Object.fromEntries(searchParams) as {
      outOfStock?: boolean
    }

    const queryParamsSchema = z.object({
      outOfStock: z.enum(['true', 'false']),
    })

    const queryParamValidation = queryParamsSchema.safeParse(paramsObject)

    if (queryParamValidation.success) {
      setEnableFilter(true)
      setOutOfStockFilter(
        Boolean(queryParamValidation.data.outOfStock === 'true'),
      )
    }
  }, [searchParams])

  const onProductClick = async (productId: string) => {
    if (activeCollection) {
      await updateProductCollection({
        products: activeCollection.products
          .map((p) => ({ id: p.id }))
          .concat({ id: productId }),
      })
      dispatch({
        type: ProductMenuActionType.UpdateActiveScreen,
        payload: {
          screen: ProductMenuActiveScreen.None,
        },
      })
      goBackToMainScreen()
    }
  }

  return (
    <div className="section sub-screen relative">
      <Toolbar
        items={[
          <ToolbarButton
            key={1}
            icon={<ChevronLeftIcon className="w-6" />}
            onClick={onBack}
          />,
          <ToolbarTitle key={2} title="All Products" />,
        ]}
      />
      <div>
        <div className="join w-full border py-0">
          <button
            className="btn btn-ghost join-item !bg-transparent px-2 pr-1 !text-black"
            disabled
          >
            <MagnifyingGlassIcon className="w-5" />
          </button>
          <input
            type="text"
            placeholder="Search"
            className="input join-item w-full"
            disabled={isLoading}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-sm border border-gray-200 ">
        {!isLoading && Boolean(error) && (
          <div className="my-auto flex h-[400px] w-full items-center justify-center p-6 text-center">
            <p className="text-center text-xs text-gray-400">
              We&apos;re having a bit of trouble fetching your data. Hang tight,
              we&apos;re on it
            </p>
          </div>
        )}
        {isLoading && (
          <>
            <div className="flex flex-col">
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
              <div className="skeleton h-[47px] w-full rounded-none" />
            </div>
          </>
        )}

        {isUpdating && (
          <div className="absolute left-0 top-[35%] flex h-[30px] w-full justify-center px-6 align-middle">
            <span className="loading loading-bars loading-lg " />
          </div>
        )}
        {!error && !isLoading && (
          <List
            height={400} // adjust based on your layout
            itemCount={filteredProducts.length}
            itemSize={47} // adjust based on your item size
            width={'100%'} // adjust based on your layout
            className="ProductList"
          >
            {({ index, style }) => {
              const product = filteredProducts[index]
              const thumbnail = product.images && product.images[0]
              return (
                <div style={style} className="relative" key={product.name}>
                  <button
                    disabled={isUpdating}
                    onClick={() => onProductClick(product.id)}
                    className="rounded-row btn btn-ghost no-animation flex w-full flex-row justify-start rounded-none border-b-gray-200 bg-gray-100"
                  >
                    <figure className="h-[24px] w-[24px]">
                      <ImageLoader
                        src={thumbnail}
                        iconClassName="w-6 text-gray-400"
                      />
                    </figure>
                    <div className="flex flex-row gap-2 text-left">
                      <div>
                        <p>
                          <MiddleTruncateText
                            text={product.name}
                            maxLength={getTruncateSize(currentBreakpoint)}
                          />
                        </p>
                        <p className="ml-auto text-xs font-normal">
                          {product.quantity || 0} available
                        </p>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <div className="flex flex-row gap-3">
                        <p>₱ {product.price}</p>

                        <ChevronRightIcon className=" w-5" />
                      </div>
                    </div>
                  </button>
                </div>
              )
            }}
          </List>
        )}
      </div>
    </div>
  )
}

export default ProductSelectionList
