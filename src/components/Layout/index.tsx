import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <main className="flex w-full flex-col ">
      <Outlet />
    </main>
  )
}

export default Layout
