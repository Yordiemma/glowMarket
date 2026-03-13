import Homepage from "./pages/Homepage"
import Shop from "./pages/Shop"
import MainLayout from "./layout/MainLayout.jsx"
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
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App