import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline"

function EditPurchaseInvoice() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [customers, setCustomers] = useState([])
  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState({
    invoice_purchase_id: "",
    date: "",
    total: "",
    comment_purchases: "",
    customer_id: "",
    payment_id: "",
    employee_id: "",
  })

  const apiUrl = "http://localhost:4000/api/purchaseinvoices"

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Cargar factura, clientes y empleados en paralelo
        const [invoiceRes, customersRes, employeesRes] = await Promise.all([
          fetch(`${apiUrl}/${id}`),
          fetch("http://localhost:4000/api/customers"),
          fetch("http://localhost:4000/api/employees")
        ])

        if (!invoiceRes.ok) {
          throw new Error(`Error ${invoiceRes.status}: No se pudo cargar la factura de compra`)
        }

        const [invoiceData, customersData, employeesData] = await Promise.all([
          invoiceRes.json(),
          customersRes.json(),
          employeesRes.json()
        ])

        setCustomers(customersData)
        setEmployees(employeesData)
        setFormData({
          invoice_purchase_id: invoiceData.invoice_purchase_id || "",
          date: invoiceData.date ? invoiceData.date.split('T')[0] : "",
          total: invoiceData.total || "",
          comment_purchases: invoiceData.comment_purchases || "",
          customer_id: invoiceData.customer_id || "",
          payment_id: invoiceData.payment_id || "",
          employee_id: invoiceData.employee_id || "",
        })
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          total: parseFloat(formData.total),
          customer_id: parseInt(formData.customer_id),
          payment_id: formData.payment_id,
          employee_id: parseInt(formData.employee_id),
        }),
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudo actualizar la factura de compra`)
      }

      navigate("/dashboard/purchaseinvoices")
    } catch (err) {
      console.error("Error updating purchase invoice:", err)
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5E0A]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => navigate("/dashboard/purchaseinvoices")}
          className="mt-4 bg-[#FF5E0A] text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
        >
          Volver a Facturas de Compra
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Editar Factura de Compra</h1>
        <Link
          to="/dashboard/purchaseinvoices"
          className="flex items-center gap-1 text-gray-600 hover:text-[#FF5E0A] transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Volver a Facturas de Compra</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Información de la Factura</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* ID de la Factura */}
            <div>
              <label htmlFor="invoice_purchase_id" className="block text-sm font-medium text-gray-700 mb-1">
                ID de la Factura
              </label>
              <input
                type="text"
                id="invoice_purchase_id"
                name="invoice_purchase_id"
                value={formData.invoice_purchase_id}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            {/* Fecha */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                required
              />
            </div>

            {/* Total */}
            <div>
              <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
                Total
              </label>
              <input
                type="number"
                step="0.01"
                id="total"
                name="total"
                value={formData.total}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                required
              />
            </div>

            {/* Comentarios */}
            <div>
              <label htmlFor="comment_purchases" className="block text-sm font-medium text-gray-700 mb-1">
                Comentarios
              </label>
              <textarea
                id="comment_purchases"
                name="comment_purchases"
                value={formData.comment_purchases}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
              />
            </div>

            {/* Cliente */}
            <div>
              <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                required
              >
                <option value="">Seleccionar cliente...</option>
                {customers.map((customer) => (
                  <option key={customer.customer_id} value={customer.customer_id}>
                    {customer.first_name} {customer.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* ID de Pago */}
            <div>
              <label htmlFor="payment_id" className="block text-sm font-medium text-gray-700 mb-1">
                ID de Método de Pago
              </label>
              <input
                type="text"
                id="payment_id"
                name="payment_id"
                value={formData.payment_id}
                onChange={handleChange}
                placeholder="ej: pse, efectivo, tarjeta"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                required
              />
            </div>

            {/* Empleado */}
            <div>
              <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-1">
                Empleado
              </label>
              <select
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                required
              >
                <option value="">Seleccionar empleado...</option>
                {employees.map((employee) => (
                  <option key={employee.employee_id} value={employee.employee_id}>
                    {employee.first_name} {employee.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            to="/dashboard/purchaseinvoices"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#FF5E0A] text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-70"
          >
            {saving ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPurchaseInvoice 