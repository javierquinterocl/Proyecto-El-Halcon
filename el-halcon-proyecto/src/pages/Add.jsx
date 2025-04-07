"use client"

import { useState } from "react"
import { PlusIcon, ChevronDownIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"

function Add() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Jewelry",
    quantity: "",
    description: "",
  })

  //HANDLET BASE DE DATOS
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  //HANDLET BASE DE DATOS
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Producto agregado:", formData)
   
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

      {/* FORMULARIO BASE */}
      <div className="bg-white rounded-lg shadow-sm max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-6">Create a new product</h2>

        <form onSubmit={handleSubmit}>
          {/* PRIMERA FILA */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name Product"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Price<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price Product"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* SEGUNDA FILA*/}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Category</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="Jewelry">Jewelry</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home">Materials</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <div className="relative">
                <select
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="">Select quantity</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* TEXT AREA */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Maximum 255 Characters"
              maxLength={255}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            ></textarea>
          </div>

          {/* BOTONES LINK */}
          <div className="flex justify-end gap-3">
            <Link type="button" to="/dashboard" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              Cancel
            </Link>
            <Link
              type="submit"to="/dashboard"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-1"
            >
              Add
              <PlusIcon className="w-4 h-4" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Add



  