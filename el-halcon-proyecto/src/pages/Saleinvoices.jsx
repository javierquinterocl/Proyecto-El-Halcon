import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline"
import Pagination from "./PaginationComp"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import { formatDate } from "../utils/dateUtils"
import { generateSaleInvoicePDF } from "../utils/pdfUtils"

function SalesInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const navigate = useNavigate()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState(null)

  const apiUrl = "http://localhost:4000/api/saleinvoices"

  useEffect(() => {
    fetchInvoices()
  }, [])

  async function fetchInvoices() {
    try {
      setLoading(true)
      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setInvoices(data)
    } catch (err) {
      console.error("Error al obtener las facturas de venta:", err)
    } finally {
      setLoading(false)
    }
  }

  function openDeleteModal(invoice) {
    setInvoiceToDelete(invoice)
    setIsDeleteModalOpen(true)
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false)
    setInvoiceToDelete(null)
  }

  async function confirmDelete() {
    if (!invoiceToDelete) return
    try {
      const res = await fetch(`${apiUrl}/${invoiceToDelete.invoice_sale_id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      setInvoices(invoices.filter(i => i.invoice_sale_id !== invoiceToDelete.invoice_sale_id))
      closeDeleteModal()
    } catch (err) {
      console.error("Error al eliminar factura:", err)
      closeDeleteModal()
    }
  }

  function handleEdit(id) {
    navigate(`/dashboard/saleinvoices/edit/${id}`)
  }

  async function generatePDF(invoice) {
    try {
      // Obtener datos adicionales en paralelo
      const [detailsRes, providerRes, employeeRes] = await Promise.all([
        fetch(`http://localhost:4000/api/sales/${invoice.invoice_sale_id}`),
        fetch(`http://localhost:4000/api/providers/${invoice.provider_id}`),
        fetch(`http://localhost:4000/api/employees/${invoice.employee_id}`)
      ])

      const [details, provider, employee] = await Promise.all([
        detailsRes.ok ? detailsRes.json() : [],
        providerRes.ok ? providerRes.json() : {},
        employeeRes.ok ? employeeRes.json() : {}
      ])

      // Generar el PDF
      generateSaleInvoicePDF(invoice, details, provider, employee)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Inténtalo de nuevo.')
    }
  }

  const filteredInvoices = invoices.filter((inv) =>
    inv.invoice_sale_id?.toString().includes(searchTerm) ||
    inv.comment_sales?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.provider_id?.toString().includes(searchTerm)
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Facturas de Venta</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar facturas..."
              className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-[#FF5E0A] text-white px-4 py-2 rounded-full hover:bg-orange-600"
            onClick={() => navigate("/dashboard/saleinvoices/add")}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Nueva Venta</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={fetchInvoices} className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#FF5E0A]">
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
          <p className="mt-2 text-gray-600">Cargando facturas...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comentario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de pago</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado ID</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center px-6 py-12 text-gray-500">
                    No se encontraron facturas
                  </td>
                </tr>
              ) : (
                currentItems.map((inv) => (
                  <tr key={inv.invoice_sale_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{inv.invoice_sale_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(inv.date)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">${inv.total}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{inv.comment_sales || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{inv.provider_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{inv.payment_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{inv.employee_id}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => generatePDF(inv)}
                          className="text-gray-600 hover:text-[#FF5E0A]"
                          title="Generar PDF"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(inv.invoice_sale_id)}
                          className="text-gray-600 hover:text-[#FF5E0A]"
                          title="Editar"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(inv)}
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

          {filteredInvoices.length > 0 && (
            <Pagination
              totalItems={filteredInvoices.length}
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
        itemName={invoiceToDelete ? `Factura #${invoiceToDelete.invoice_sale_id}` : ""}
        itemType="la factura"
      />
    </div>
  )
}

export default SalesInvoices
