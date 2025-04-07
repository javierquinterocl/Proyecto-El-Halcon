import {
    UsersIcon,
    NewspaperIcon,
    ClipboardDocumentIcon,
    UserCircleIcon,
    Squares2X2Icon,
    PlusIcon,
    Cog6ToothIcon,
    ChevronUpIcon,
    DocumentDuplicateIcon
  } from "@heroicons/react/24/outline"
  import { Link } from "react-router-dom"

  // DATOS STATS PARA MAP
  const stats = [
    { label: "New Customers", value: 24, icon: UsersIcon, percentage: 8 },
    { label: "New Orders", value: 53, icon: NewspaperIcon, percentage: 27 },
    { label: "New Products", value: 86, icon: ClipboardDocumentIcon, percentage: 8 },
    { label: "Providers Registered", value: 12, icon: UserCircleIcon, percentage: 5 },
  ]
  
  const additionalStats = [
    { label: "Providers Registered", value: 12, icon: UserCircleIcon },
    { label: "Pawns Registered", value: 25, icon: ClipboardDocumentIcon },
    { label: "Sales Registered", value: 87, icon: NewspaperIcon },
    { label: "Documents", value: 34, icon: DocumentDuplicateIcon },
  ]
  
  function DashboardContent() {
    return (
      <div className="flex flex-col space-y-6 p-4 md:p-6">

        {/* OVERVIEW Y ICONO */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-[#Fff] bg-[#FF5E0A] p-2 rounded">
              <Squares2X2Icon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-medium text-gray-700">Overview</h2>
          </div>
  
          <Link
          to="/dashboard/add"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          Create New
          <span className="bg-white/20 rounded p-0.5">
            <PlusIcon className="w-4 h-4" />
          </span>
        </Link>
        </div>

  
        {/* TARJETAS DE ESTADISTICAS USANDO STATS CON MAP */}
        <div className="flex flex-wrap gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-6 relative flex-1 min-w-[250px] sm:min-w-[200px]">
              <div className="flex justify-between items-start mb-4">
                <div className="text-[#F24822]">
                  <stat.icon className="w-6 h-6" />
                </div>
                <button className="text-[#F24822] ">
                  <Cog6ToothIcon className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-5xl font-bold mb-2">{stat.value}</h3>
              <p className="text-gray-500">{stat.label}</p>
             
               <div className="absolute bottom-6 right-6 bg-[#F24822] text-white text-xs px-2 py-1 rounded flex items-center">
                  {stat.percentage}% <ChevronUpIcon className="w-3 h-3 ml-1" />
               </div>
              
            </div>
          ))}
        </div>
  
        {/* SECION DE LA GRAFICA, TODAVIA NO HAY */}
        <div className="flex flex-col lg:flex-row gap-6 mt-12">
          {/* PLACEHOLDER*/}
          <div className="bg-white rounded-lg shadow-sm p-6 flex-1 lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium text-gray-700">Sale Orders</h3>
              <button className="text-[#F24822] hover:text-orange-600">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <p className="text-gray-500">Gráfico de ventas</p>
            </div>
          </div>
  
          {/* Otras estadísticas */}
          <div className="flex flex-col space-y-6 lg:w-1/4">
          {additionalStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#F24822] p-2 rounded">
                  <stat.icon className="w-5 h-5 text-[#Fff]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
              <div className="bg-[#F24822] text-white text-xs px-2 py-1 rounded flex items-center">
                Edit <ChevronUpIcon className="w-3 h-3 ml-1 rotate-90" />
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    )
  }
  
  export default DashboardContent
  
  