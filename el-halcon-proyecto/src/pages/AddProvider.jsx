import { useState } from "react"
import { PlusIcon } from "@heroicons/react/24/outline"
import { Link, useNavigate } from "react-router-dom"

export default function AddProvider() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    provider_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
    country_id: "",
    department_id: "",
    city_id: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/providers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Error al crear el proveedor")
      // on success, navigate back to providers list
      navigate("/dashboard/providers")
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6">
      {/* ENCABEZADO */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-orange-500 p-1 rounded">
          <PlusIcon className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl text-gray-700">Añadir Proveedor</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-6">Crear un nuevo proveedor</h2>
        <form onSubmit={handleSubmit}>
          {/* ROW 1: ID & Nombre */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                ID Proveedor<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="provider_id"
                value={formData.provider_id}
                onChange={handleChange}
                placeholder="e.g. PROV001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Nombre<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* ROW 2: Segundo Nombre & Apellido */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Segundo Nombre</label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                placeholder="Segundo Nombre (opcional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Apellido<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Apellido"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* ROW 3: Teléfono & Email */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Teléfono<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email (opcional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* ROW 4: Dirección */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Dirección<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dirección"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              required
            />
          </div>

          {/* ROW 5: País, Departamento y Ciudad */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                País<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country_id"
                value={formData.country_id}
                onChange={handleChange}
                placeholder="Código de País"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
                maxLength={3}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Departamento<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                placeholder="Código de Departamento"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
                maxLength={3}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Ciudad<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                placeholder="Código de Ciudad"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
                maxLength={3}
              />
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <Link
              to="/dashboard/providers"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-1 disabled:opacity-50"
            >
              {loading ? "Añadiendo..." : "Añadir Proveedor"}
              {!loading && <PlusIcon className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
