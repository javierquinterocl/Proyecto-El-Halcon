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
} from '@heroicons/react/24/outline';

const sections = [
  { name: 'PRODUCTS', icon: ShoppingCartIcon },
  { name: 'SALES', icon: CreditCardIcon },
  { name: 'PURCHASES', icon: ClipboardDocumentIcon },
  { name: 'PAWNS', icon: ShieldCheckIcon },
  { name: 'PROVIDERS', icon: BuildingStorefrontIcon },
  { name: 'CUSTOMERS', icon: UsersIcon },
  { name: 'INVOICES', icon: DocumentDuplicateIcon },
  { name: 'EMPLOYEES', icon: UserCircleIcon },
];

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100 items-start justify-start ">
      <aside className="w-90 bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between h-[100vh]">
        {/* titulo y logo */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">EL HALCON</h1>
            <img src="/images/logoHalcon.png" alt="Logo" className="w-10 h-10" />
          </div>

          <p className="text-sm text-gray-500 mb-4">Menu</p>

          {/* boton dashboard */}
          <div className="flex items-center justify-between bg-orange-500 text-white px-4 py-3 rounded-xl mb-4 shadow">
            <div className="flex items-center gap-3">
              <HomeIcon className="w-5 h-5" />
              <span className="text-sm font-medium">DashBoards</span>
            </div>
            <ChevronDownIcon className="w-4 h-4" />
          </div>

          {/* botones */}
          <div className="space-y-3">
            {sections.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white text-gray-700 px-4 py-3 rounded-xl shadow hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-light">{item.name}</span>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        
        <div className="pt-6">
          <button className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600 px-4 py-3 rounded-xl shadow transition">
            LogOut
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="ml-6 flex-1 p-6">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-4 text-gray-600">Bienvenido al panel de control.</p>
      </main>
    </div>
  );
}

export default Dashboard;
