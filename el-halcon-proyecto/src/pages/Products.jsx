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
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import Pagination from "./PaginationComp"

function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const apiUrl = "http://localhost:4000/api/products"

 
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  function openDeleteModal(product) {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false)
    setProductToDelete(null)
  }

  async function confirmDelete() {
    if (!productToDelete) return

    try {
      const res = await fetch(`${apiUrl}/${productToDelete.product_id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error(`Error ${res.status}`)

    
      setProducts(products.filter((p) => p.product_id !== productToDelete.product_id))

    
      closeDeleteModal()
    } catch (err) {
      console.error("Error deleting product:", err)
      closeDeleteModal()
    }
  }

  function handleEdit(id) {
    navigate(`/dashboard/products/edit/${id}`)
  }

 
  const filteredProducts = products.filter(
    (product) =>
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()),
  )


  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  function getStatusBadge(status) {
    if (!status) return null

    const statusLower = status.toLowerCase()
    if (statusLower === "a" || statusLower === "active" || statusLower === "activo") {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Activo</span>
    } else if (statusLower === "i" || statusLower === "inactive" || statusLower === "inactivo") {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Inactivo</span>
    } else {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{status}</span>
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Listado de Productos</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-[#FF5E0A] text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
            onClick={() => navigate("/dashboard/Add")}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={fetchProducts} className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#FF5E0A]">
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
            <p className="mt-2 text-gray-600">Cargando productos...</p>
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
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Marca
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Joyería ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No-Joyería ID
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
                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                      No se encontraron productos
                    </td>
                  </tr>
                ) : (
                  currentItems.map((p) => (
                    <tr key={p.product_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.product_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.product_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {p.stock > 0 ? p.stock : <span className="text-red-500">0</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getStatusBadge(p.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.jewelry_id || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.non_jewelry_id || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(p.product_id)}
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

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <Pagination
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        productName={productToDelete?.product_name}
      />
    </div>
  )
}

export default Products
