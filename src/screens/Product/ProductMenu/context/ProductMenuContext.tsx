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
        original: OrderItem
        updated: OrderItem
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
    }
    case ProductMenuActionType.UpdateOrderItem: {
      const { original, updated } = action.payload

      if (!state.order || !state.productCollectionState.activeCollection) {
        return state
      }

      // PATH: Remove item from the order if the quantity is zero
      if (updated.quantity === 0) {
        // Remove the order item that matches the original from the order
        const updatedOrderItems = cloneDeep(state.order.orderItems).filter(
          (item) => {
            if (item.productVariant && original.productVariant) {
              return (
                item.product.id !== original.product.id ||
                item.productVariant.id !== original.productVariant.id
              )
            }
            return item.product.id !== original.product.id
          },
        )

        // Find the product and its variant and add the quantity back
        const updatedActiveCollection = cloneDeep(
          state.productCollectionState.activeCollection,
        )

        const productFromCollectionIndex =
          updatedActiveCollection.products.findIndex(
            (p) => p.id === original.product.id,
          )

        const targetProduct = cloneDeep(
          updatedActiveCollection.products[productFromCollectionIndex],
        )

        if (original.productVariant) {
          // Find the variant and add the quantity back
          const targetVariantIndex = targetProduct.variants.findIndex(
            (v) => v.id === original.productVariant?.id,
          )

          targetProduct.variants[targetVariantIndex] = {
            ...targetProduct.variants[targetVariantIndex],
            quantity:
              targetProduct.variants[targetVariantIndex].quantity +
              original.quantity,
          }
        } else {
          // Add the quantity back to the product
          targetProduct.quantity = targetProduct.quantity + original.quantity
        }

        // Update the product in the active collection
        updatedActiveCollection.products[productFromCollectionIndex] =
          targetProduct

        const updatedOrder = {
          ...state.order,
          orderItems: updatedOrderItems,
          // Recompute the gross and net
          gross: state.order.gross - original.gross,
          net: state.order.net - original.net,
        }

        return {
          ...state,
          order: updatedOrder,
          productCollectionState: {
            ...state.productCollectionState,
            activeCollection: updatedActiveCollection,
          },
        }
      }

      const isUpdateSameOrderItem =
        JSON.stringify({ ...original, quantity: undefined }) ===
        JSON.stringify({ ...updated, quantity: undefined })

      if (isUpdateSameOrderItem) {
        // STEP 1: Update the order item in the order
        // Find the order item that matches the original
        const targetOrderItemIndex = state.order.orderItems.findIndex(
          (item) => {
            if (item.productVariant && original.productVariant) {
              return (
                item.product.id === original.product.id &&
                item.productVariant.id === original.productVariant.id &&
                JSON.stringify(item.discount) ===
                  JSON.stringify(original.discount)
              )
            }
            return (
              item.product.id === original.product.id &&
              JSON.stringify(item.discount) ===
                JSON.stringify(original.discount)
            )
          },
        )

        const targetOrderItem = cloneDeep(
          state.order.orderItems[targetOrderItemIndex],
        )

        // Update the quantity of the order item
        targetOrderItem.quantity = updated.quantity

        // Update the order item
        const updatedOrderItems = cloneDeep(state.order.orderItems)
        updatedOrderItems[targetOrderItemIndex] = targetOrderItem

        // Recompute the gross and net
        const updatedGross = updatedOrderItems.reduce(
          (acc, item) => acc + item.gross,
          0,
        )
        const updatedNet = updatedOrderItems.reduce(
          (acc, item) => acc + item.net,
          0,
        )

        // Update the order state
        const updatedOrder = {
          ...state.order,
          orderItems: updatedOrderItems,
          gross: updatedGross,
          net: updatedNet,
        }

        // STEP 2: Update the product and its variant in the active collection
        // Find the product and its variant
        const activeCollection = cloneDeep(
          state.productCollectionState.activeCollection,
        )

        const productFromCollectionIndex = activeCollection.products.findIndex(
          (p) => p.id === original.product.id,
        )

        const targetProduct = cloneDeep(
          activeCollection.products[productFromCollectionIndex],
        )

        // Add the quantity back to the product and its variant
        if (original.productVariant) {
          // Update the quantity of the product variant in the active collection
          const targetVariantIndex = targetProduct.variants.findIndex(
            (v) => v.id === original.productVariant?.id,
          )

          // If original quantity is greater than updated quantity, add the difference to the product variant
          if (original.quantity > updated.quantity) {
            targetProduct.variants[targetVariantIndex] = {
              ...targetProduct.variants[targetVariantIndex],
              quantity:
                targetProduct.variants[targetVariantIndex].quantity +
                (original.quantity - updated.quantity),
            }
          } else {
            // If original quantity is less than updated quantity, subtract the difference from the product variant
            targetProduct.variants[targetVariantIndex] = {
              ...targetProduct.variants[targetVariantIndex],
              quantity:
                targetProduct.variants[targetVariantIndex].quantity -
                (updated.quantity - original.quantity),
            }
          }
        } else {
          // If original quantity is greater than updated quantity, add the difference to the product
          if (original.quantity > updated.quantity) {
            targetProduct.quantity =
              targetProduct.quantity + (original.quantity - updated.quantity)
          } else {
            // If original quantity is less than updated quantity, subtract the difference from the product
            targetProduct.quantity =
              targetProduct.quantity - (updated.quantity - original.quantity)
          }
        }

        activeCollection.products[productFromCollectionIndex] = targetProduct

        return {
          ...state,
          order: updatedOrder,
          productCollectionState: {
            ...state.productCollectionState,
            activeCollection: activeCollection,
          },
        }
      } else {
        // Replace the original order item with the updated order item

        // STEP 1: Remove the original order item from the order
        const updatedOrderItems = cloneDeep(state.order.orderItems).filter(
          (item) => {
            if (item.productVariant && original.productVariant) {
              return (
                item.product.id !== original.product.id ||
                (item.productVariant.id !== original.productVariant.id &&
                  JSON.stringify(item.discount) ===
                    JSON.stringify(original.discount))
              )
            }
            return (
              item.product.id !== original.product.id &&
              JSON.stringify(item.discount) ===
                JSON.stringify(original.discount)
            )
          },
        )

        // STEP 2: Return the quantity of the original order item to the product and its variant in the active collection
        const updatedActiveCollection = cloneDeep(
          state.productCollectionState.activeCollection,
        )

        const originalProductFromCollectionIndex =
          updatedActiveCollection.products.findIndex(
            (p) => p.id === original.product.id,
          )

        const originalProduct = cloneDeep(
          updatedActiveCollection.products[originalProductFromCollectionIndex],
        )

        if (original.productVariant) {
          // Find the variant and add the quantity back
          const targetVariantIndex = originalProduct.variants.findIndex(
            (v) => v.id === original.productVariant?.id,
          )

          originalProduct.variants[targetVariantIndex] = {
            ...originalProduct.variants[targetVariantIndex],
            quantity:
              originalProduct.variants[targetVariantIndex].quantity +
              original.quantity,
          }
        } else {
          // Add the quantity back to the product
          originalProduct.quantity =
            originalProduct.quantity + original.quantity
        }

        updatedActiveCollection.products[originalProductFromCollectionIndex] =
          originalProduct

        // STEP 3: Subtract the quantity of the updated order item from the product and its variant in the active collection
        const updatedProductFromCollectionIndex =
          updatedActiveCollection.products.findIndex(
            (p) => p.id === updated.product.id,
          )

        const updatedProduct = cloneDeep(
          updatedActiveCollection.products[updatedProductFromCollectionIndex],
        )

        if (updated.productVariant) {
          // Find the variant and add the quantity back
          const targetVariantIndex = updatedProduct.variants.findIndex(
            (v) => v.id === updated.productVariant?.id,
          )

          updatedProduct.variants[targetVariantIndex] = {
            ...updatedProduct.variants[targetVariantIndex],
            quantity:
              updatedProduct.variants[targetVariantIndex].quantity -
              updated.quantity,
          }
        } else {
          // Add the quantity back to the product
          updatedProduct.quantity = updatedProduct.quantity - updated.quantity
        }

        updatedActiveCollection.products[updatedProductFromCollectionIndex] =
          updatedProduct

        // STEP 4: Find if the updated order item already exists in the order
        const targetOrderItemIndex = state.order.orderItems.findIndex(
          (item) => {
            if (item.productVariant && updated.productVariant) {
              return (
                item.product.id === updated.product.id &&
                item.productVariant.id === updated.productVariant.id &&
                JSON.stringify(item.discount) ===
                  JSON.stringify(updated.discount)
              )
            }
            return (
              item.product.id === updated.product.id &&
              JSON.stringify(item.discount) === JSON.stringify(updated.discount)
            )
          },
        )

        if (targetOrderItemIndex !== -1) {
          // If the updated order item already exists in the order, update the quantity
          const targetOrderItem = cloneDeep(
            state.order.orderItems[targetOrderItemIndex],
          )

          targetOrderItem.quantity = targetOrderItem.quantity + updated.quantity
          targetOrderItem.gross = targetOrderItem.gross + updated.gross
          targetOrderItem.net = targetOrderItem.net + updated.net
          updatedOrderItems[targetOrderItemIndex] = targetOrderItem
        } else {
          // If the updated order item does not exist in the order, add the order item
          updatedOrderItems.push(updated)
        }

        // Recompute the gross and net

        const updatedGross = updatedOrderItems.reduce(
          (acc, item) => acc + item.gross,
          0,
        )
        const updatedNet = updatedOrderItems.reduce(
          (acc, item) => acc + item.net,
          0,
        )

        // Update the order state

        const updatedOrder = {
          ...state.order,
          orderItems: updatedOrderItems,
          gross: updatedGross,
          net: updatedNet,
        }

        return {
          ...state,
          order: updatedOrder,
          productCollectionState: {
            ...state.productCollectionState,
            activeCollection: updatedActiveCollection,
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
