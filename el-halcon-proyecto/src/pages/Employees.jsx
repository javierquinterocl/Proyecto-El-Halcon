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

function Employees() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const apiUrl = "http://localhost:4000/api/employees"

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  async function fetchEmployees() {
    try {
      setLoading(true)
      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setEmployees(data)
    } catch (err) {
      console.error("Error fetching employees:", err)
    } finally {
      setLoading(false)
    }
  }

  function openDeleteModal(emp) {
    setEmployeeToDelete(emp)
    setIsDeleteModalOpen(true)
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false)
    setEmployeeToDelete(null)
  }

  async function confirmDelete() {
    if (!employeeToDelete) return
    try {
      const res = await fetch(`${apiUrl}/${employeeToDelete.employee_id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      setEmployees(employees.filter((e) => e.employee_id !== employeeToDelete.employee_id))
      closeDeleteModal()
    } catch (err) {
      console.error("Error deleting employee:", err)
      closeDeleteModal()
    }
  }

  function handleEdit(id) {
    navigate(`/dashboard/employees/edit/${id}`)
  }

  const filteredEmployees = employees.filter(
    (e) =>
      e.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Listado de Empleados</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar empleados..."
              className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-[#FF5E0A] text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
            onClick={() => navigate("/dashboard/employees/add")}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Nuevo Empleado</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={fetchEmployees} className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#FF5E0A]">
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
          <p className="mt-2 text-gray-600">Cargando empleados...</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Gerente</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-sm text-gray-500">
                      No se encontraron empleados
                    </td>
                  </tr>
                ) : (
                  currentItems.map((e) => (
                    <tr key={e.employee_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.employee_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {`${e.first_name} ${e.middle_name ? e.middle_name + " " : ""}${e.last_name}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{e.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{e.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{e.address}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{e.speciality}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{e.certification}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{e.emp_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{e.mgr_id}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(e.employee_id)} className="text-gray-600 hover:text-[#FF5E0A]">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => openDeleteModal(e)} className="text-gray-600 hover:text-red-600">
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
          <Pagination
            totalItems={filteredEmployees.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={employeeToDelete ? `${employeeToDelete.first_name} ${employeeToDelete.last_name}` : ""}
        itemType="el empleado"
      />
    </div>
  )
}

export default Employees
