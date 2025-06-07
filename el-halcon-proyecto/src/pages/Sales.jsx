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

function SaleItems() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const apiUrl = "http://localhost:4000/api/sales"

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
      console.error("Error al obtener los ítems de venta:", err)
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
      const res = await fetch(`${apiUrl}/${itemToDelete.line_item_id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      setItems(items.filter((i) => i.line_item_id !== itemToDelete.line_item_id))
      closeDeleteModal()
    } catch (err) {
      console.error("Error deleting item:", err)
      closeDeleteModal()
    }
  }

  function handleEdit(item) {
    navigate(`/dashboard/sales/edit/${item.line_item_id}`)
  }

  const filteredItems = items.filter((item) =>
    item.line_item_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.invoice_sale_id?.toString().includes(searchTerm)
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Ítems de Venta</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar ítems..."
              className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-[#FF5E0A] text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
            onClick={() => navigate("/dashboard/sales/add")}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Nueva Venta</span>
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
          <p className="mt-2 text-gray-600">Cargando ítems...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factura ID</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center px-6 py-12 text-gray-500">
                    No se encontraron ítems
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={`${item.invoice_sale_id}-${item.line_item_id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{item.line_item_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">${item.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">${item.sub_total}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.product_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.invoice_sale_id}</td>
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
        itemName={itemToDelete ? itemToDelete.product_id : ""}
        itemType="el ítem de venta"
      />
    </div>
  )
}

export default SaleItems
