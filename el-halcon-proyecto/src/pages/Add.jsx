import { useState } from "react"
import { PlusIcon, ChevronDownIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import { Link, useNavigate } from "react-router-dom"

export default function Add() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    product_id: "",
    product_name: "",
    stock: "",
    brand: "",
    status: "A",      
    image: "",
    jewelry_id: "",    
    non_jewelry_id: "" 
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      )
      if (!res.ok) throw new Error("Error al crear el producto")
      // on success, navigate back to dashboard or list
      navigate("/dashboard")
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
        <h1 className="text-xl text-gray-700">Add Product</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-6">Create a new product</h2>
        <form onSubmit={handleSubmit}>
          {/* ROW 1: ID & Name */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Product ID<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                placeholder="e.g. P001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* ROW 2: Stock & Brand */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Stock<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Quantity in stock"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Brand<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Brand Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* ROW 3: Status & Image URL */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="A">Active</option>
                <option value="I">Inactive</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* ROW 4: Jewelry & Non-Jewelry IDs */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Jewelry ID<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jewelry_id"
                value={formData.jewelry_id}
                onChange={handleChange}
                placeholder="e.g. J001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Non-Jewelry ID<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="non_jewelry_id"
                value={formData.non_jewelry_id}
                onChange={handleChange}
                placeholder="e.g. N001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <Link
              type="button"
              to="/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-1 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add'}
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}




  