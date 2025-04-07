import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom"
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
  
} from "@heroicons/react/24/outline";

const sections = [
  { name: "Products", icon: ShoppingCartIcon },
  { name: "Sales", icon: CreditCardIcon },
  { name: "Purchases", icon: ClipboardDocumentIcon },
  { name: "Pawns", icon: ShieldCheckIcon },
  { name: "Providers", icon: BuildingStorefrontIcon },
  { name: "Customers", icon: UsersIcon },
  { name: "Invoices", icon: DocumentDuplicateIcon },
  { name: "Employees", icon: UserCircleIcon },
];

function Dashboard() {
  return (
    // Contenedor principal horizontal
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-80 bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">EL HALCON</h1>
            <img src="/images/logoHalcon.png" alt="Logo" className="w-10 h-10" />
          </div>

          <p className="text-sm text-gray-500 mb-4">Menu</p>

          {/* Botón Dashboard */}
          <div className="flex items-center w-full justify-between bg-[#FF5E0A] text-white px-4 py-3 rounded-xl mb-4 shadow">
            <div className="flex items-center gap-3">
              <HomeIcon className="w-5 h-5" />
              <span className="text-sm font-medium">DashBoards</span>
            </div>
            <ChevronDownIcon className="w-4 h-4" />
          </div>

          {/* Secciones */}
          <div className="space-y-3">
            {sections.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white text-gray-700 px-4 py-3 rounded-xl shadow hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm text-gray-500">{item.name}</span>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
        <div className="pt-6">
          <Link to="/" className="w-full flex items-center justify-center gap-2 bg-[#FF5E0A] text-white hover:bg-orange-600 px-4 py-3 rounded-xl shadow transition">
            LogOut
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </Link>
        </div>
      </aside>

      {/* CONTENEDOR*/}
      <div className="flex flex-col flex-1">
        
        {/* NAVBAR  */}
        <header className="bg-[#FF5E0A] px-4">
          <div className="max-w-7xl mx-auto my-4 px-6 py-4 bg-white rounded-2xl shadow-md flex items-center justify-between">
            <div className="text-gray-800 text-lg font-semibold whitespace-nowrap">
              Welcome to El Halcon
            </div>

            {/* Buscador */}
            <div className="flex-1 mx-8">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 text-sm rounded-full border border-gray-200 focus:outline-none shadow-inner"
              />
            </div>

            {/* Elementos del navbar */}
            <div className="flex items-center gap-6 text-gray-800">
              <BellIcon className="w-5 h-5 cursor-pointer" />
              <FunnelIcon className="w-5 h-5 cursor-pointer" />
              <div className="flex items-center gap-2">
                <UserCircleIcon className="w-6 h-6" />
                <select className="bg-transparent text-sm focus:outline-none">
                  <option>Usuario</option>
                </select>
              </div>
              <ArrowRightOnRectangleIcon className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </header>

        {/* CONTENIDO REUTILIZABLE OUTLET */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-2xl shadow-md p-6 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;



