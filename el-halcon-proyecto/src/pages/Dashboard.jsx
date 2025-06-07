import { useState, useEffect } from "react"
import { Outlet, Link } from "react-router-dom"
import {
  HomeIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  ClipboardDocumentIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  DocumentDuplicateIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  BellIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline"

const sections = [
  { name: "Productos", icon: ShoppingCartIcon, path: "products" },
  { name: "Ventas", icon: CreditCardIcon, path: "sales" },
  { name: "Compras", icon: ClipboardDocumentIcon, path: "purchases" },
  { name: "Empeños", icon: ShieldCheckIcon, path: "pawns" },
  { name: "Proveedores", icon: BuildingStorefrontIcon, path: "providers" },
  { name: "Clientes", icon: UsersIcon, path: "customers" },
  {
    name: "Facturas",
    icon: DocumentDuplicateIcon,
    children: [
      { name: "Facturas de Compra", path: "purchaseinvoices" },
      { name: "Facturas de Venta", path: "saleinvoices" },
    ],
  },
  { name: "Empleados", icon: UserCircleIcon, path: "employees" },
]

function Dashboard() {
  const [openMenus, setOpenMenus] = useState({})
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const name = localStorage.getItem("userName")
    if (name) {
      setUserName(name)
    }
  }, [])

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-80 bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">EL HALCON</h1>
            <img src="/images/logoHalcon.png" alt="Logo" className="w-10 h-10" />
          </div>

          <p className="text-sm text-gray-500 mb-4">Menu</p>

          {/* Dashboard Button */}
          <Link
            to="/dashboard"
            className="flex items-center w-full justify-between bg-[#FF5E0A] text-white px-4 py-3 rounded-xl mb-4 shadow"
          >
            <div className="flex items-center gap-3">
              <HomeIcon className="w-5 h-5" />
              <span className="text-sm font-medium">DashBoards</span>
            </div>
            <ChevronDownIcon className="w-4 h-4" />
          </Link>

          {/* Sections with submenu */}
          <div className="space-y-3">
            {sections.map((item, idx) => {
              if (item.children) {
                return (
                  <div key={idx}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className="flex items-center justify-between w-full bg-white text-gray-700 px-4 py-3 rounded-xl shadow hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm text-gray-500">{item.name}</span>
                      </div>
                      <ChevronDownIcon
                        className={`w-4 h-4 text-gray-400 transform transition-transform ${
                          openMenus[item.name] ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openMenus[item.name] && (
                      <div className="mt-2 pl-4 border-l-2 border-orange-200 space-y-2">
                        {item.children.map((child, subIdx) => (
                          <Link
                            key={subIdx}
                            to={`/dashboard/${child.path}`}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-[#FF5E0A] px-3 py-2 rounded-lg transition"
                          >
                            <span className="w-2 h-2 bg-[#FF5E0A] rounded-full opacity-50 transition group-hover:opacity-100"></span>
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              } else {
                return (
                  <Link
                    key={idx}
                    to={`/dashboard/${item.path}`}
                    className="flex items-center justify-between bg-white text-gray-700 px-4 py-3 rounded-xl shadow hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm text-gray-500">{item.name}</span>
                    </div>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  </Link>
                )
              }
            })}
          </div>
        </div>

        <div className="pt-6">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-[#FF5E0A] text-white hover:bg-orange-600 px-4 py-3 rounded-xl shadow transition"
          >
            LogOut
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <header className="bg-[#FF5E0A] px-4">
          <div className="max-w-7xl mx-auto my-4 px-6 py-4 bg-white rounded-2xl shadow-md flex items-center justify-between">
            <div className="text-gray-800 text-lg font-semibold whitespace-nowrap">
              Bienvenido a El Halcon
            </div>
            {/* Search */}
            <div className="flex-1 mx-8">
              <input
                type="text"
                placeholder="Buscar"
                className="w-full px-4 py-2 text-sm rounded-full border border-gray-200 focus:outline-none shadow-inner"
              />
            </div>
            {/* Navbar Items */}
            <div className="flex items-center gap-6 text-gray-800">
              <BellIcon className="w-5 h-5 cursor-pointer" />
              <FunnelIcon className="w-5 h-5 cursor-pointer" />
              <div className="flex items-center gap-2">
                <UserCircleIcon className="w-6 h-6" />
                <select className="bg-transparent text-sm focus:outline-none">
                  <option>{userName || "Usuario"}</option>
                </select>
              </div>
              <ArrowRightOnRectangleIcon className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </header>

        {/* Outlet Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-2xl shadow-md p-6 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
