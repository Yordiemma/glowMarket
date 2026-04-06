import Homepage from "./pages/Homepage"
import Cart from "./pages/Cart"
import Shop from "./pages/Shop"
import MainLayout from "./layout/MainLayout"
import NotFound from "./pages/NotFound"
import Product from "./pages/Product"
import { ShopProvider } from "./context/ShopContext"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "shop/:slug",
        element: <Product />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])

function App() {
  return (
    <ShopProvider>
      <RouterProvider router={router} />
    </ShopProvider>
  )
}

export default App
