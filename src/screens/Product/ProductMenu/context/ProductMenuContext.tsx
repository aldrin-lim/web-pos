/* eslint-disable react-refresh/only-export-components */
import useAllProductionCollection from 'hooks/useAllProductionCollection'
import { ReactNode, createContext, useContext, useReducer } from 'react'
import { ProductCollection } from 'types/productCollection.types'

export enum ProductMenuActiveScreen {
  None = '',
  ProductSelection = 'productSelection',
  OrderItemDetail = 'orderItemDetail',
  OrderCart = 'orderCart',
}

interface State {
  activeScreen: ProductMenuActiveScreen
  productCollectionState: {
    activeCollection: ProductCollection | null
    productCollections: ProductCollection[]
    isLoading: boolean
    error: unknown
  }
}

const initialState: State = {
  activeScreen: ProductMenuActiveScreen.None,
  productCollectionState: {
    activeCollection: null,
    productCollections: [],
    isLoading: false,
    error: '',
  },
}

export enum ProductMenuActionType {
  UpdateActiveScreen = 'UPDATE_ACTIVE_SCREEN',
  UpdateActiveCollection = 'UPDATE_ACTIVE_COLLECTION',
  UpdateProductCollectionState = 'UPDATE_PRODUCT_COLLECTION_STATE',
}

type Action =
  | {
      type: ProductMenuActionType.UpdateActiveScreen
      payload: {
        screen: ProductMenuActiveScreen
      }
    }
  | {
      type: ProductMenuActionType.UpdateActiveCollection
      payload: ProductCollection
    }
  | {
      type: ProductMenuActionType.UpdateProductCollectionState
      payload: State['productCollectionState']
    }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ProductMenuActionType.UpdateActiveScreen:
      return {
        ...state,
        activeScreen: action.payload.screen,
      }
    case ProductMenuActionType.UpdateActiveCollection:
      return {
        ...state,
        productCollectionState: {
          ...state.productCollectionState,
          activeCollection: action.payload,
        },
      }
    case ProductMenuActionType.UpdateProductCollectionState:
      return {
        ...state,
        productCollectionState: action.payload,
      }
    default:
      return state
  }
}

const ProductMenuContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => {},
})

export const useProductMenuContext = () => useContext(ProductMenuContext)

type ProductMenuProviderProps = {
  children: ReactNode
}

export const ProductMenuContextProvider: React.FC<ProductMenuProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const { error, isLoading, productCollections } = useAllProductionCollection()

  const updatedState: State = {
    ...state,
    productCollectionState: {
      ...state.productCollectionState,
      error,
      isLoading,
      productCollections,
      activeCollection: productCollections[0] ?? null,
    },
  }

  return (
    <ProductMenuContext.Provider value={{ state: updatedState, dispatch }}>
      {children}
    </ProductMenuContext.Provider>
  )
}
