import { PencilIcon } from '@heroicons/react/24/outline'
import Big from 'big.js'
import { toNumber } from 'lodash'
import { useMemo } from 'react'
import { Order } from 'screens/Catalog'
import { formatToPeso } from 'util/currency'

type OrderCartItemProps = {
  order: Order
  onClick?: () => void
}

const OrderCartItem = (props: OrderCartItemProps) => {
  const { order, onClick } = props
  const { discount, quantity, product } = order
  const { price, name } = product

  const totalNetPrice = useMemo(() => {
    let price = order.product.price

    if (order.discount && order.discount.type === 'fixed') {
      price = toNumber(
        new Big(order.product.price)
          .sub(new Big(order.discount.amount))
          .round(2)
          .toFixed(2),
      )
    }
    if (order.discount && order.discount.type === 'percentage') {
      price = toNumber(
        new Big(order.product.price)
          .sub(
            new Big(order.product.price).times(
              new Big(order.discount.amount).div(100),
            ),
          )
          .round(2)
          .toFixed(2),
      )
    }
    return price * order.quantity
  }, [order.discount, order.product.price, order.quantity])

  const totalGrossPrice = useMemo(() => {
    return price * quantity
  }, [price, quantity])

  const formatDiscountAmount = useMemo(() => {
    if (!discount) {
      return ''
    }

    if (discount.type === 'fixed') {
      return formatToPeso(discount.amount)
    }

    return `${discount.amount}%`
  }, [discount])

  return (
    <div
      onClick={onClick}
      className="flex flex-row justify-between bg-base-300 p-2 "
    >
      <div className="flex flex-row items-center">
        <button className="btn btn-ghost btn-primary btn-sm">
          <PencilIcon className="w-6 text-primary" />
        </button>
        <div className="flex flex-col">
          <p>{name}</p>
          <p>
            {quantity} x {formatToPeso(price)}{' '}
            {formatDiscountAmount && `(-${formatDiscountAmount})`}
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        {discount && (
          <p className="line-through">{formatToPeso(totalGrossPrice)}</p>
        )}
        <p className="font-bold">{formatToPeso(totalNetPrice)}</p>
      </div>
    </div>
  )
}

export default OrderCartItem
