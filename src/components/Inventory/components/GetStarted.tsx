import { AppPath } from 'routes/AppRoutes.types'
import { useNavigate } from 'react-router-dom'

const GetStarted = () => {
  const navigate = useNavigate()
  const onAddProduct = () => {
    localStorage.setItem('productAdded', 'true')
    navigate(AppPath.AddProduct)
  }
  return (
    <div className="section flex w-full flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-lg font-bold">Add your first product</h2>
      <p>
        Add physical and digital products to your inventory. It&apos;s super
        easy! 😊
      </p>
      <button
        onClick={onAddProduct}
        className="btn btn-success text-white"
        color="green"
      >
        Add Product
      </button>
      <div>
        <button className="btn btn-link btn-primary p-0 normal-case no-underline">
          Learn more
        </button>{' '}
        about adding products
      </div>
    </div>
  )
}

export default GetStarted
