import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline"
import  DeleteConfirmationModal  from "./DeleteConfirmationModal"
import Pagination from "./PaginationComp"

function Providers() {
  const navigate = useNavigate()
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const apiUrl = "http://localhost:4000/api/providers"


  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [providerToDelete, setProviderToDelete] = useState(null)

  useEffect(() => {
    fetchProviders()
  }, [])

  async function fetchProviders() {
    try {
      setLoading(true)
      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setProviders(data)
    } catch (err) {
      console.error("Error fetching providers:", err)
    } finally {
      setLoading(false)
    }
  }

  function openDeleteModal(provider) {
    setProviderToDelete(provider)
    setIsDeleteModalOpen(true)
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false)
    setProviderToDelete(null)
  }

  async function confirmDelete() {
    if (!providerToDelete) return

    try {
      const res = await fetch(`${apiUrl}/${providerToDelete.provider_id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error(`Error ${res.status}`)

     
      setProviders(providers.filter((p) => p.provider_id !== providerToDelete.provider_id))

    
      closeDeleteModal()
    } catch (err) {
      console.error("Error deleting provider:", err)
      closeDeleteModal()
    }
  }

  function handleEdit(id) {
    navigate(`/dashboard/providers/edit/${id}`)
  }


  const filteredProviders = providers.filter(
    (provider) =>
      provider.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.provider_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

 
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProviders.slice(indexOfFirstItem, indexOfLastItem)


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Listado de Proveedores</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar proveedores..."
              className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-[#FF5E0A] text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
            onClick={() => navigate("/dashboard/providers/add")}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Nuevo Proveedor</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={fetchProviders} className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#FF5E0A]">
          <ArrowPathIcon className="h-4 w-4" />
          <span>Actualizar</span>
        </button>

        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#FF5E0A]">
          <FunnelIcon className="h-4 w-4" />
          <span>Filtrar</span>
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <ArrowPathIcon className="h-8 w-8 text-[#FF5E0A] animate-spin" />
            <p className="mt-2 text-gray-600">Cargando proveedores...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nombre
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Teléfono
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dirección
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ciudad
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                      No se encontraron proveedores
                    </td>
                  </tr>
                ) : (
                  currentItems.map((p) => (
                    <tr key={p.provider_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.provider_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {`${p.first_name} ${p.middle_name ? p.middle_name + " " : ""}${p.last_name}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.email || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.city_id || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(p.provider_id)}
                            className="text-gray-600 hover:text-[#FF5E0A] transition-colors"
                            title="Editar"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(p)}
                            className="text-gray-600 hover:text-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        
          {filteredProviders.length > 0 && (
            <Pagination
              totalItems={filteredProviders.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}

    
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={providerToDelete ? `${providerToDelete.first_name} ${providerToDelete.last_name}` : ""}
        itemType="el proveedor"
      />
    </div>
  )
}

export default Providers
