import { useState, useEffect } from "react"
import { PlusIcon } from "@heroicons/react/24/outline"
import { Link, useNavigate } from "react-router-dom"

export default function AddSaleInvoice() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    date: "",
    total: "",
    comment_sales: "",
    provider_id: "",
    payment_id: "",
    employee_id: "",
  })
  const [providers, setProviders] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000"
        const [provRes, empRes] = await Promise.all([
          fetch(`${baseUrl}/api/providers`),
          fetch(`${baseUrl}/api/employees`),
        ])
        const [provData, empData] = await Promise.all([
          provRes.json(),
          empRes.json(),
        ])
        setProviders(provData)
        setEmployees(empData)
      } catch (err) {
        console.error("Error al cargar opciones:", err)
      }
    }
    fetchOptions()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/saleinvoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Error al crear la factura de venta")
      navigate("/dashboard/saleinvoices")
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-orange-500 p-1 rounded">
          <PlusIcon className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl text-gray-700">Añadir Factura de Venta</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-6">Crear una nueva factura</h2>
        <form onSubmit={handleSubmit}>
          {/* Fecha y Total */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Fecha<span className="text-red-500">*</span></label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Total<span className="text-red-500">*</span></label>
              <input
                type="number"
                step="0.01"
                name="total"
                value={formData.total}
                onChange={handleChange}
                required
                placeholder="Total"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Comentario */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Comentario</label>
            <input
              type="text"
              name="comment_sales"
              value={formData.comment_sales}
              onChange={handleChange}
              placeholder="Comentario"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              maxLength={255}
            />
          </div>

          {/* Selects de proveedor y empleado */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Proveedor<span className="text-red-500">*</span></label>
              <select
                name="provider_id"
                value={formData.provider_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="">Selecciona un proveedor</option>
                {providers.map((prov) => (
                  <option key={prov.provider_id} value={prov.provider_id}>
                    {prov.first_name} {prov.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Empleado<span className="text-red-500">*</span></label>
              <select
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="">Selecciona un empleado</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ID de Pago */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">ID Pago<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="payment_id"
              value={formData.payment_id}
              onChange={handleChange}
              required
              maxLength={3}
              placeholder="Código de pago"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Mensaje de error */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <Link
              to="/dashboard/invoice-sales"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-1 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Factura"}
              {!loading && <PlusIcon className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
