import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function AddPawn() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({
    pawn_date: "",
    return_date: "",
    expiration_date: "",
    fee_rate: 0,
    total_amount: 0,
    status: "A",
    epe_id: "",
    ctr_id: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("http://localhost:4000/api/customers")
      .then(res => res.json())
      .then(setCustomers)
      .catch(err => console.error("Error al cargar clientes:", err))

    fetch("http://localhost:4000/api/employees")
      .then(res => res.json())
      .then(setEmployees)
      .catch(err => console.error("Error al cargar empleados:", err))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("http://localhost:4000/api/pawns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fee_rate: parseFloat(form.fee_rate),
          total_amount: parseFloat(form.total_amount)
        })
      })

      if (!res.ok) throw new Error("Error al guardar el empeño")
      navigate("/dashboard/pawns")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Nuevo Empeño</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente</label>
          <select
            required
            name="ctr_id"
            value={form.ctr_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Selecciona --</option>
            {customers.map(c => (
              <option key={c.customer_id} value={c.customer_id}>
                {`${c.first_name} ${c.middle_name ? c.middle_name + " " : ""}${c.last_name}`}
              </option>
            ))}
          </select>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Fecha del empeño</label>
            <input type="date" name="pawn_date" value={form.pawn_date} onChange={handleChange}
              required className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Fecha de devolución</label>
            <input type="date" name="return_date" value={form.return_date} onChange={handleChange}
              required className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Fecha de expiración</label>
            <input type="date" name="expiration_date" value={form.expiration_date} onChange={handleChange}
              required className="w-full border rounded px-2 py-1" />
          </div>
        </div>

        {/* Valores */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Tasa</label>
            <input type="number" step="0.01" name="fee_rate" value={form.fee_rate} onChange={handleChange}
              required className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Monto total</label>
            <input type="number" step="0.01" name="total_amount" value={form.total_amount} onChange={handleChange}
              required className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Empleado</label>
            <select
              required
              name="epe_id"
              value={form.epe_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">-- Selecciona --</option>
              {employees.map(emp => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {`${emp.first_name} ${emp.middle_name ? emp.middle_name + " " : ""}${emp.last_name}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="text-right">
          <button type="submit" disabled={loading}
            className="bg-[#FF5E0A] text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50">
            {loading ? "Guardando..." : "Guardar Empeño"}
          </button>
        </div>
      </form>
    </div>
  )
}
