/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext, useReducer } from 'react'

export enum ProductMenuActiveScreen {
  None = '',
  ProductSelection = 'productSelection',
  OrderItemDetail = 'orderItemDetail',
  OrderCart = 'orderCart',
}

interface State {
  activeScreen: ProductMenuActiveScreen
}

const initialState: State = {
  activeScreen: ProductMenuActiveScreen.None,
}

export enum ProductMenuActionType {
  UpdateActiveScreen = 'UPDATE_ACTIVE_SCREEN',
}

type Action = {
  type: ProductMenuActionType.UpdateActiveScreen
  payload: {
    screen: ProductMenuActiveScreen
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ProductMenuActionType.UpdateActiveScreen:
      return {
        ...state,
        activeScreen: action.payload.screen,
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

  return (
    <ProductMenuContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductMenuContext.Provider>
  )
}
