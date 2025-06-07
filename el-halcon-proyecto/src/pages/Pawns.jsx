import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import Pagination from "./PaginationComp"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import { formatDate } from "../utils/dateUtils"

function PawnItems() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const apiUrl = "http://localhost:4000/api/pawns"

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      setLoading(true)
      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error("Error al obtener empeños:", err)
    } finally {
      setLoading(false)
    }
  }

  function openDeleteModal(item) {
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
  }

  async function confirmDelete() {
    if (!itemToDelete) return
    try {
      const res = await fetch(`${apiUrl}/${itemToDelete.pawn_id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      setItems(items.filter(i => i.pawn_id !== itemToDelete.pawn_id))
      closeDeleteModal()
    } catch (err) {
      console.error("Error al eliminar empeño:", err)
      closeDeleteModal()
    }
  }

  function handleEdit(item) {
    navigate(`/dashboard/pawns/edit/${item.pawn_id}`)
  }

  const filteredItems = items.filter((item) => {
    const search = searchTerm.toLowerCase()
    return (
      item.customer_name?.toLowerCase().includes(search) ||
      item.employee_name?.toLowerCase().includes(search) ||
      item.status?.toLowerCase().includes(search)
    )
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Empeños</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, empleado o estado..."
              className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-[#FF5E0A] text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
            onClick={() => navigate("/dashboard/pawns/add")}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Nuevo Empeño</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={fetchItems} className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#FF5E0A]">
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
          <ArrowPathIcon className="h-8 w-8 text-[#FF5E0A] animate-spin" />
          <p className="mt-2 text-gray-600">Cargando empeños...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interés</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center px-6 py-12 text-gray-500">
                    No se encontraron empeños
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.pawn_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{item.pawn_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.employee_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(item.pawn_date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(item.expiration_date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">${Number(item.total_amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{Number(item.fee_rate).toFixed(2)}%</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.status}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-gray-600 hover:text-[#FF5E0A]"
                          title="Editar"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="text-gray-600 hover:text-red-600"
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

          {filteredItems.length > 0 && (
            <Pagination
              totalItems={filteredItems.length}
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
        itemName={itemToDelete ? `#${itemToDelete.pawn_id}` : ""}
        itemType="el empeño"
      />
    </div>
  )
}

export default PawnItems
