/* eslint-disable react-refresh/only-export-components */
import useAllProductionCollection from 'hooks/useAllProductionCollection'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react'
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
  ClearCart = 'CLEAR_ORDER_CART',
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
  | {
      type: ProductMenuActionType.ClearCart
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
      const productFromCollection =
        state.productCollectionState.activeCollection?.products.find(
          (p) => p.id === action.payload.product.id,
        )

      // Do nothing when quantity is zero

      if (action.payload.quantity === 0) {
        return state
      }

      // Check if the product exists in the active collection
      if (
        !productFromCollection ||
        !state.productCollectionState.activeCollection
      ) {
        return state
      }

      // Subtract the quantity from the product in the active collection
      const updatedActiveollectionProducts =
        state.productCollectionState.activeCollection.products.map((p) => {
          if (p.id === action.payload.product.id) {
            if (action.payload.productVariant) {
              return {
                ...p,
                variants: p.variants.map((v) => {
                  if (v.id === action.payload.productVariant?.id) {
                    return {
                      ...v,
                      quantity: v.quantity - action.payload.quantity,
                    }
                  }
                  return v
                }),
              }
            }
            return {
              ...p,
              quantity: p.quantity - action.payload.quantity,
            }
          }

          return p
        })

      // Check if the order is null then create a new order
      if (state.order === null) {
        return {
          ...state,
          productCollectionState: {
            ...state.productCollectionState,
            activeCollection: {
              ...state.productCollectionState.activeCollection,
              products: updatedActiveollectionProducts,
            },
          },
          order: {
            net: action.payload.net,
            gross: action.payload.gross,
            orderItems: [action.payload],
          },
        }
      }

      const gross = state.order.orderItems
        .map((item) => item.gross)
        .reduce((a, b) => a + b, 0)
      const net = state.order.orderItems
        .map((item) => item.net)
        .reduce((a, b) => a + b, 0)

      // Check if the product already exists in the order
      const existingOrderItemIndex = state.order.orderItems.findIndex(
        (item) => {
          if (item.productVariant && action.payload.productVariant) {
            return (
              item.product.id === action.payload.product.id &&
              item.productVariant.id === action.payload.productVariant.id &&
              JSON.stringify(item.discount) ===
                JSON.stringify(action.payload.discount)
            )
          }
          return (
            item.product.id === action.payload.product.id &&
            JSON.stringify(item.discount) ===
              JSON.stringify(action.payload.discount)
          )
        },
      )

      // If the product already exists in the order, update the quantity
      if (existingOrderItemIndex !== -1) {
        return {
          ...state,
          productCollectionState: {
            ...state.productCollectionState,
            activeCollection: {
              ...state.productCollectionState.activeCollection,
              products: updatedActiveollectionProducts,
            },
          },
          order: {
            ...state.order,
            gross: gross + action.payload.gross,
            net: net + action.payload.net,
            orderItems: state.order.orderItems.map((item, index) =>
              index === existingOrderItemIndex
                ? {
                    ...item,
                    quantity: item.quantity + action.payload.quantity,
                    gross: item.gross + action.payload.gross,
                    net: item.net + action.payload.net,
                  }
                : item,
            ),
          },
        }
      }

      return {
        ...state,
        productCollectionState: {
          ...state.productCollectionState,
          activeCollection: {
            ...state.productCollectionState.activeCollection,
            products: updatedActiveollectionProducts,
          },
        },
        order: {
          ...state.order,
          gross: gross + action.payload.gross,
          net: net + action.payload.net,
          orderItems: [...state.order.orderItems, action.payload],
        },
      }
    }
    case ProductMenuActionType.UpdateOrderItem: {
      if (!state.order) {
        return state
      }
      if (action.payload.item.quantity === 0) {
        return {
          ...state,
          order: {
            ...state.order,
            orderItems: state.order.orderItems.filter((item) => {
              if (item.productVariant && action.payload.item.productVariant) {
                return (
                  item.product.id === action.payload.item.product.id &&
                  item.productVariant.id ===
                    action.payload.item.productVariant.id
                )
              }
              return item.product.id === action.payload.item.product.id
            }),
          },
        }
      } else {
        return {
          ...state,
          order: {
            ...state.order,
            orderItems: state.order.orderItems.map((item, index) =>
              index === action.payload.index ? action.payload.item : item,
            ),
          },
        }
      }
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
    case ProductMenuActionType.ClearCart: {
      return initialState
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

  useEffect(() => {
    if (productCollections.length > 0) {
      dispatch({
        type: ProductMenuActionType.UpdateActiveCollection,
        payload: productCollections[0],
      })
    }
    console.log('pasok')
  }, [isLoading, error, productCollections])

  return (
    <ProductMenuContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductMenuContext.Provider>
  )
}
