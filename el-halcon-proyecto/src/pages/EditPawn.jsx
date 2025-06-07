import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline"

function EditPawn() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [customers, setCustomers] = useState([])
  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState({
    pawn_id: "",
    pawn_date: "",
    return_date: "",
    expiration_date: "",
    fee_rate: "",
    total_amount: "",
    status: "",
    epe_id: "",
    ctr_id: "",
  })

  const apiUrl = "http://localhost:4000/api/pawns"

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "PAGADO", label: "Pagado" },
    { value: "VENCIDO", label: "Vencido" },
    { value: "REMATADO", label: "Rematado" }
  ]

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Cargar empeño, clientes y empleados en paralelo
        const [pawnRes, customersRes, employeesRes] = await Promise.all([
          fetch(`${apiUrl}/${id}`),
          fetch("http://localhost:4000/api/customers"),
          fetch("http://localhost:4000/api/employees")
        ])

        if (!pawnRes.ok) {
          throw new Error(`Error ${pawnRes.status}: No se pudo cargar el empeño`)
        }

        const [pawnData, customersData, employeesData] = await Promise.all([
          pawnRes.json(),
          customersRes.json(),
          employeesRes.json()
        ])

        setCustomers(customersData)
        setEmployees(employeesData)
        setFormData({
          pawn_id: pawnData.pawn_id || "",
          pawn_date: pawnData.pawn_date ? pawnData.pawn_date.split('T')[0] : "",
          return_date: pawnData.return_date ? pawnData.return_date.split('T')[0] : "",
          expiration_date: pawnData.expiration_date ? pawnData.expiration_date.split('T')[0] : "",
          fee_rate: pawnData.fee_rate || "",
          total_amount: pawnData.total_amount || "",
          status: pawnData.status || "",
          epe_id: pawnData.epe_id || "",
          ctr_id: pawnData.ctr_id || "",
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
          fee_rate: parseFloat(formData.fee_rate),
          total_amount: parseFloat(formData.total_amount),
          epe_id: parseInt(formData.epe_id),
          ctr_id: parseInt(formData.ctr_id),
          return_date: formData.return_date || null,
        }),
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudo actualizar el empeño`)
      }

      navigate("/dashboard/pawns")
    } catch (err) {
      console.error("Error updating pawn:", err)
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
          onClick={() => navigate("/dashboard/pawns")}
          className="mt-4 bg-[#FF5E0A] text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
        >
          Volver a Empeños
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Editar Empeño</h1>
        <Link
          to="/dashboard/pawns"
          className="flex items-center gap-1 text-gray-600 hover:text-[#FF5E0A] transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Volver a Empeños</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Información del Empeño</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* ID del Empeño */}
            <div>
              <label htmlFor="pawn_id" className="block text-sm font-medium text-gray-700 mb-1">
                ID del Empeño
              </label>
              <input
                type="text"
                id="pawn_id"
                name="pawn_id"
                value={formData.pawn_id}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="pawn_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha del Empeño
                </label>
                <input
                  type="date"
                  id="pawn_date"
                  name="pawn_date"
                  value={formData.pawn_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="expiration_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Vencimiento
                </label>
                <input
                  type="date"
                  id="expiration_date"
                  name="expiration_date"
                  value={formData.expiration_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="return_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Devolución
                </label>
                <input
                  type="date"
                  id="return_date"
                  name="return_date"
                  value={formData.return_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                />
              </div>
            </div>

            {/* Tasa de interés y Monto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fee_rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tasa de Interés (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  id="fee_rate"
                  name="fee_rate"
                  value={formData.fee_rate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Total
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="total_amount"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Estado del Empeño
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                required
              >
                <option value="">Seleccionar estado...</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cliente */}
            <div>
              <label htmlFor="ctr_id" className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <select
                id="ctr_id"
                name="ctr_id"
                value={formData.ctr_id}
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

            {/* Empleado */}
            <div>
              <label htmlFor="epe_id" className="block text-sm font-medium text-gray-700 mb-1">
                Empleado
              </label>
              <select
                id="epe_id"
                name="epe_id"
                value={formData.epe_id}
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
            to="/dashboard/pawns"
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

export default EditPawn 