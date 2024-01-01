/* eslint-disable react-refresh/only-export-components */
import useAllProductionCollection from 'hooks/useAllProductionCollection'
import { ReactNode, createContext, useContext, useReducer } from 'react'
import { Order, OrderItem } from 'types/order.types'
import { ProductCollection } from 'types/productCollection.types'

export enum ProductMenuActiveScreen {
  None = '',
  ProductSelection = 'productSelection',
  OrderSelection = 'orderSelection',
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
  order: Order | null
}

const initialState: State = {
  activeScreen: ProductMenuActiveScreen.None,
  productCollectionState: {
    activeCollection: null,
    productCollections: [],
    isLoading: false,
    error: '',
  },
  order: null,
}

export enum ProductMenuActionType {
  UpdateActiveScreen = 'UPDATE_ACTIVE_SCREEN',
  UpdateActiveCollection = 'UPDATE_ACTIVE_COLLECTION',
  UpdateProductCollectionState = 'UPDATE_PRODUCT_COLLECTION_STATE',
  AddOrderItem = 'ADD_ORDER_ITEM',
  UpdateOrderItem = 'UPDATE_ORDER_ITEM',
  DeleteOrderItem = 'DELETE_ORDER_ITEM',
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
  | {
      type: ProductMenuActionType.AddOrderItem
      payload: OrderItem
    }
  | {
      type: ProductMenuActionType.UpdateOrderItem
      payload: {
        index: number
        item: OrderItem
      }
    }
  | {
      type: ProductMenuActionType.DeleteOrderItem
      payload: number
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
    case ProductMenuActionType.AddOrderItem: {
      if (state.order === null) {
        return {
          ...state,
          order: {
            net: 0,
            gross: 0,
            orderItems: [action.payload],
          },
        }
      }
      return {
        ...state,
        order: {
          ...state.order,
          orderItems: [...state.order.orderItems, action.payload],
        },
      }
    }
    case ProductMenuActionType.UpdateOrderItem:
      if (!state.order) {
        return state
      }
      return {
        ...state,
        order: {
          ...state.order,
          orderItems: state.order.orderItems.map((item, index) =>
            index === action.payload.index ? action.payload.item : item,
          ),
        },
      }
    case ProductMenuActionType.DeleteOrderItem:
      if (!state.order) {
        return state
      }
      return {
        ...state,
        order: {
          ...state.order,
          orderItems: state.order.orderItems.filter(
            (_, index) => index !== action.payload,
          ),
        },
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
