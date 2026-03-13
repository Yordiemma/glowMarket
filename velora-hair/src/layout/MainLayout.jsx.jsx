import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout