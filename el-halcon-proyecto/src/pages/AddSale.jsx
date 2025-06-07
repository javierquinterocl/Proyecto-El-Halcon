import { useState, useEffect } from "react"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"

export default function AddSale() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [invoices, setInvoices] = useState([])
  const [saleItems, setSaleItems] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error("Error al cargar productos:", err))

    fetch("http://localhost:4000/api/saleinvoices")
      .then(res => res.json())
      .then(setInvoices)
      .catch(err => console.error("Error al cargar facturas:", err))
  }, [])

  const handleAddItem = () => {
    setSaleItems([...saleItems, { product_id: "", quantity: 1, price: 0 }])
  }

  const handleRemoveItem = (index) => {
    const updated = [...saleItems]
    updated.splice(index, 1)
    setSaleItems(updated)
  }

  const handleItemChange = (index, field, value) => {
    const updated = [...saleItems]
    updated[index][field] = field === "quantity" || field === "price" ? Number(value) : value
    setSaleItems(updated)
  }

  const subtotal = (item) => item.quantity * item.price

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const itemsToSend = saleItems.map((item, idx) => ({
        line_item_id: String.fromCharCode(65 + idx), // 'A', 'B', ...
        quantity: item.quantity,
        price: item.price,
        sub_total: item.quantity * item.price,
        product_id: item.product_id,
        invoice_sale_id: parseInt(selectedInvoice),
      }))

      const res = await fetch("http://localhost:4000/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemsToSend),
      })

      if (!res.ok) throw new Error("Error al guardar los ítems de venta")

      navigate("/dashboard/sales")
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Agregar Ítems de Venta</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selector de factura */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Selecciona una Factura de Venta <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={selectedInvoice}
            onChange={(e) => setSelectedInvoice(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Selecciona --</option>
            {invoices.map((inv) => (
              <option key={inv.invoice_sale_id} value={inv.invoice_sale_id}>
                #{inv.invoice_sale_id} - {inv.date} - ${inv.total}
              </option>
            ))}
          </select>
        </div>

        {/* Ítems de venta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Productos</label>
          <div className="space-y-3">
            {saleItems.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-6 gap-3 bg-gray-50 p-4 rounded-lg items-end">
                <div className="col-span-2">
                  <label className="text-xs text-gray-600">Producto</label>
                  <select
                    value={item.product_id}
                    onChange={(e) => handleItemChange(index, "product_id", e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">Seleccione</option>
                    {products.map((p) => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.product_name || p.product_id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-600">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Precio</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, "price", e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Subtotal</label>
                  <div className="text-gray-800 mt-1">${subtotal(item).toFixed(2)}</div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="mt-4 flex items-center gap-2 text-sm text-[#FF5E0A] hover:underline"
          >
            <PlusIcon className="w-4 h-4" /> Agregar producto
          </button>
        </div>

        {/* Error y guardar */}
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#FF5E0A] text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar Ítems"}
          </button>
        </div>
      </form>
    </div>
  )
}
