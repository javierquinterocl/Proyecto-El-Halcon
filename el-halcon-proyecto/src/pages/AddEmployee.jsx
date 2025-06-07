import { useState } from "react"
import { PlusIcon } from "@heroicons/react/24/outline"
import { Link, useNavigate } from "react-router-dom"

export default function AddEmployee() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
    salary: "",
    experience_years: "",
    expertise_level: "",
    speciality: "",
    certification: "",
    emp_type: "",
    mgr_id: "",
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          salary: parseFloat(formData.salary),
          experience_years: parseInt(formData.experience_years),
          expertise_level: parseInt(formData.expertise_level),
          mgr_id: formData.mgr_id ? parseInt(formData.mgr_id) : null,
        }),
      })

      if (!res.ok) throw new Error("Error al crear el empleado")
      navigate("/dashboard/employees")
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
        <h1 className="text-xl text-gray-700">Añadir Empleado</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-6">Crear un nuevo empleado</h2>
        <form onSubmit={handleSubmit}>
          {/* Nombres */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Nombre<span className="text-red-500">*</span></label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Segundo Nombre</label>
              <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>

          {/* Apellido y Teléfono */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Apellido<span className="text-red-500">*</span></label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Celular<span className="text-red-500">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
          </div>

          {/* Correo y Dirección */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Correo electrónico</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Dirección<span className="text-red-500">*</span></label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
          </div>

          {/* Salario, Experiencia y Nivel */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Salario<span className="text-red-500">*</span></label>
              <input type="number" name="salary" value={formData.salary} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Años de experiencia<span className="text-red-500">*</span></label>
              <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Nivel de experticia (1-5)<span className="text-red-500">*</span></label>
              <input type="number" name="expertise_level" value={formData.expertise_level} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" min="1" max="5" required />
            </div>
          </div>

          {/* Especialización y Certificación */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Especialización</label>
              <input type="text" name="speciality" value={formData.speciality} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Certificación</label>
              <input type="text" name="certification" value={formData.certification} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>

          {/* Tipo de empleado y jefe */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Tipo de Empleado</label>
              <input type="text" name="emp_type" value={formData.emp_type} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">ID del Jefe</label>
              <input type="number" name="mgr_id" value={formData.mgr_id} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>

          {/* Errores */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <Link to="/dashboard/employees" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Cancelar</Link>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-1 disabled:opacity-50">
              {loading ? "Añadiendo..." : "Añadir Empleado"}
              {!loading && <PlusIcon className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
