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
import { cloneDeep } from 'lodash'

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
      const productFromCollection = cloneDeep(
        state.productCollectionState.activeCollection?.products.find(
          (p) => p.id === action.payload.product.id,
        ),
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

      // Three flows here:
      // 1. The order is null: create a new order => add the product => set the order's gross and net from the incoming order item
      // 2. The product already exists in the order:
      //      => add the incoming order item's quantity to the existing order item's quantity
      //      => add the incoming order item's gross and net to the existing order item's gross and net
      //      => subtract the incoming order item's quantity from the product in the active collection

      // ============ New Order Flow ============
      if (state.order === null) {
        const productFromCollectionIndex =
          state.productCollectionState.activeCollection.products.findIndex(
            (p) => p.id === action.payload.product.id,
          )
        const updatedActiveCollection = cloneDeep(
          state.productCollectionState.activeCollection,
        )

        // Clone the product from the active collection
        const productToUpdate = cloneDeep(
          updatedActiveCollection.products[productFromCollectionIndex],
        )

        // Check if the product has variants
        if (action.payload.productVariant) {
          // Subtract the order item's quantity to the product variant in the active collection
          productToUpdate.variants = productToUpdate.variants.map((v) => {
            if (v.id === action.payload.productVariant?.id) {
              return {
                ...v,
                quantity: v.quantity - action.payload.quantity,
              }
            }
            return v
          })

          // Set the updated product to the active collection
          updatedActiveCollection.products[productFromCollectionIndex] =
            productToUpdate
        } else {
          const targetProduct = cloneDeep(productFromCollection)

          targetProduct.quantity =
            targetProduct.quantity - action.payload.quantity
          return {
            ...state,
            productCollectionState: {
              ...state.productCollectionState,
              activeCollection: {
                ...state.productCollectionState.activeCollection,
                products:
                  state.productCollectionState.activeCollection.products.map(
                    (p) => {
                      if (p.id === targetProduct.id) {
                        return targetProduct
                      }
                      return p
                    },
                  ),
              },
            },
            order: {
              net: action.payload.net,
              gross: action.payload.gross,
              orderItems: [action.payload],
            },
          }
        }

        return {
          ...state,
          order: {
            net: action.payload.net,
            gross: action.payload.gross,
            orderItems: [action.payload],
          },
          productCollectionState: {
            ...state.productCollectionState,
            activeCollection: updatedActiveCollection,
          },
        }
      }
      // ============ End of New Order Flow ============

      // ============ Existing Order Flow ============
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

      if (existingOrderItemIndex !== -1) {
        if (action.payload.productVariant) {
          const targetProduct = cloneDeep(productFromCollection)
          const targetVariantIndex = targetProduct.variants.findIndex(
            (v) => v.id === action.payload.productVariant?.id,
          )

          targetProduct.variants[targetVariantIndex] = {
            ...targetProduct.variants[targetVariantIndex],
            quantity:
              targetProduct.variants[targetVariantIndex].quantity -
              action.payload.quantity,
          }
          return {
            ...state,
            productCollectionState: {
              ...state.productCollectionState,
              activeCollection: {
                ...state.productCollectionState.activeCollection,
                products:
                  state.productCollectionState.activeCollection.products.map(
                    (p) => {
                      if (p.id === targetProduct.id) {
                        return targetProduct
                      }
                      return p
                    },
                  ),
              },
            },
            order: {
              gross: state.order.gross + action.payload.gross,
              net: state.order.net + action.payload.net,
              orderItems: state.order.orderItems.map((item, index) =>
                index === existingOrderItemIndex
                  ? // If the product already exists in the order, update the quantity
                    {
                      ...item,
                      quantity: item.quantity + action.payload.quantity,
                      gross: item.gross + action.payload.gross,
                      net: item.net + action.payload.net,
                    }
                  : // If the product does not exist in the order, add the product
                    item,
              ),
            },
          }
        } else {
          const targetProduct = cloneDeep(productFromCollection)

          targetProduct.quantity =
            targetProduct.quantity - action.payload.quantity
          return {
            ...state,
            productCollectionState: {
              ...state.productCollectionState,
              activeCollection: {
                ...state.productCollectionState.activeCollection,
                products:
                  state.productCollectionState.activeCollection.products.map(
                    (p) => {
                      if (p.id === targetProduct.id) {
                        return targetProduct
                      }
                      return p
                    },
                  ),
              },
            },
            order: {
              gross: state.order.gross + action.payload.gross,
              net: state.order.net + action.payload.net,
              orderItems: state.order.orderItems.map((item, index) =>
                index === existingOrderItemIndex
                  ? // If the product already exists in the order, update the quantity
                    {
                      ...item,
                      quantity: item.quantity + action.payload.quantity,
                      gross: item.gross + action.payload.gross,
                      net: item.net + action.payload.net,
                    }
                  : // If the product does not exist in the order, add the product
                    item,
              ),
            },
          }
        }
      }

      // ============ End of Existing Order Flow ============

      // Add order item to the existing order

      if (action.payload.productVariant) {
        const targetProduct = cloneDeep(productFromCollection)
        const targetVariantIndex = targetProduct.variants.findIndex(
          (v) => v.id === action.payload.productVariant?.id,
        )

        targetProduct.variants[targetVariantIndex] = {
          ...targetProduct.variants[targetVariantIndex],
          quantity:
            targetProduct.variants[targetVariantIndex].quantity -
            action.payload.quantity,
        }
        return {
          ...state,
          order: {
            gross: state.order.gross + action.payload.gross,
            net: state.order.net + action.payload.net,
            orderItems: [...state.order.orderItems, action.payload],
          },
          // Subtract the quantity from the product and its variant in the active collection
          productCollectionState: {
            ...state.productCollectionState,
            activeCollection: {
              ...state.productCollectionState.activeCollection,
              products:
                state.productCollectionState.activeCollection.products.map(
                  (p) => {
                    if (p.id === targetProduct.id) {
                      return targetProduct
                    }
                    return p
                  },
                ),
            },
          },
        }
      }

      return {
        ...state,
        order: {
          gross: state.order.gross + action.payload.gross,
          net: state.order.net + action.payload.net,
          orderItems: [...state.order.orderItems, action.payload],
        },
        // Subtract the quantity from the product in the active collection
        productCollectionState: {
          ...state.productCollectionState,
          activeCollection: {
            ...state.productCollectionState.activeCollection,
            products:
              state.productCollectionState.activeCollection.products.map(
                (p) => {
                  if (p.id === action.payload.product.id) {
                    return {
                      ...p,
                      quantity: p.quantity - action.payload.quantity,
                    }
                  }

                  return p
                },
              ),
          },
        },
      }

      // // Subtract the quantity from the product in the active collection
      // const updatedActiveollectionProducts =
      //   state.productCollectionState.activeCollection.products.map((p) => {
      //     if (p.id === action.payload.product.id) {
      //       if (action.payload.productVariant) {
      //         return {
      //           ...p,
      //           variants: p.variants.map((v) => {
      //             if (v.id === action.payload.productVariant?.id) {
      //               return {
      //                 ...v,
      //                 quantity: v.quantity - action.payload.quantity,
      //               }
      //             }
      //             return v
      //           }),
      //         }
      //       }
      //       return {
      //         ...p,
      //         quantity: p.quantity - action.payload.quantity,
      //       }
      //     }

      //     return p
      //   })

      // // Check if the order is null then create a new order
      // if (state.order === null) {
      //   return {
      //     ...state,
      //     productCollectionState: {
      //       ...state.productCollectionState,
      //       activeCollection: {
      //         ...state.productCollectionState.activeCollection,
      //         products: updatedActiveollectionProducts,
      //       },
      //     },
      //     order: {
      //       net: action.payload.net,
      //       gross: action.payload.gross,
      //       orderItems: [action.payload],
      //     },
      //   }
      // }

      // const gross = state.order.orderItems
      //   .map((item) => item.gross)
      //   .reduce((a, b) => a + b, 0)
      // const net = state.order.orderItems
      //   .map((item) => item.net)
      //   .reduce((a, b) => a + b, 0)

      // // // Check if the product already exists in the order
      // // const existingOrderItemIndex = state.order.orderItems.findIndex(
      // //   (item) => {
      // //     if (item.productVariant && action.payload.productVariant) {
      // //       return (
      // //         item.product.id === action.payload.product.id &&
      // //         item.productVariant.id === action.payload.productVariant.id &&
      // //         JSON.stringify(item.discount) ===
      // //           JSON.stringify(action.payload.discount)
      // //       )
      // //     }
      // //     return (
      // //       item.product.id === action.payload.product.id &&
      // //       JSON.stringify(item.discount) ===
      // //         JSON.stringify(action.payload.discount)
      // //     )
      // //   },
      // // )

      // // // If the product already exists in the order, update the quantity
      // // if (existingOrderItemIndex !== -1) {
      // //   return {
      // //     ...state,
      // //     productCollectionState: {
      // //       ...state.productCollectionState,
      // //       activeCollection: {
      // //         ...state.productCollectionState.activeCollection,
      // //         products: updatedActiveollectionProducts,
      // //       },
      // //     },
      // //     order: {
      // //       ...state.order,
      // //       gross: gross + action.payload.gross,
      // //       net: net + action.payload.net,
      // //       orderItems: state.order.orderItems.map((item, index) =>
      // //         index === existingOrderItemIndex
      // //           ? {
      // //               ...item,
      // //               quantity: item.quantity + action.payload.quantity,
      // //               gross: item.gross + action.payload.gross,
      // //               net: item.net + action.payload.net,
      // //             }
      // //           : item,
      // //       ),
      // //     },
      // //   }
      // // }

      // return {
      //   ...state,
      //   productCollectionState: {
      //     ...state.productCollectionState,
      //     activeCollection: {
      //       ...state.productCollectionState.activeCollection,
      //       products: updatedActiveollectionProducts,
      //     },
      //   },
      //   order: {
      //     ...state.order,
      //     gross: gross + action.payload.gross,
      //     net: net + action.payload.net,
      //     orderItems: [...state.order.orderItems, action.payload],
      //   },
      // }
    }
    case ProductMenuActionType.UpdateOrderItem: {
      const productFromCollection =
        state.productCollectionState.activeCollection?.products.find(
          (p) => p.id === action.payload.item.product.id,
        )

      // Check if the product exists in the active collection
      if (
        !state.order ||
        !productFromCollection ||
        !state.productCollectionState.activeCollection
      ) {
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
  }, [isLoading, error, productCollections])

  return (
    <ProductMenuContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductMenuContext.Provider>
  )
}
