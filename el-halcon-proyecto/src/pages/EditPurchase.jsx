import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline"

function EditPurchase() {
  const { invoiceId, lineItemId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [invoices, setInvoices] = useState([])
  const [formData, setFormData] = useState({
    line_item_id: "",
    quantity: "",
    price: "",
    sub_total: "",
    product_id: "",
    invoice_purchase_id: "",
  })

  const apiUrl = "http://localhost:4000/api/purchases/detail"

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Cargar detalle de compra, productos y facturas en paralelo
        const [purchaseRes, productsRes, invoicesRes] = await Promise.all([
          fetch(`${apiUrl}/${invoiceId}/${lineItemId}`),
          fetch("http://localhost:4000/api/products"),
          fetch("http://localhost:4000/api/purchaseinvoices")
        ])

        if (!purchaseRes.ok) {
          throw new Error(`Error ${purchaseRes.status}: No se pudo cargar el detalle de compra`)
        }

        const [purchaseData, productsData, invoicesData] = await Promise.all([
          purchaseRes.json(),
          productsRes.json(),
          invoicesRes.json()
        ])

        setProducts(productsData)
        setInvoices(invoicesData)
        setFormData({
          line_item_id: purchaseData.line_item_id || "",
          quantity: purchaseData.quantity || "",
          price: purchaseData.price || "",
          sub_total: purchaseData.sub_total || "",
          product_id: purchaseData.product_id || "",
          invoice_purchase_id: purchaseData.invoice_purchase_id || "",
        })
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (invoiceId && lineItemId) {
      fetchData()
    }
  }, [invoiceId, lineItemId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await fetch(`${apiUrl}/${invoiceId}/${lineItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price),
          sub_total: parseFloat(formData.sub_total),
          product_id: formData.product_id,
          invoice_purchase_id: parseInt(formData.invoice_purchase_id),
        }),
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudo actualizar el detalle de compra`)
      }

      navigate("/dashboard/Purchases")
    } catch (err) {
      console.error("Error updating purchase:", err)
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
          onClick={() => navigate("/dashboard/Purchases")}
          className="mt-4 bg-[#FF5E0A] text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
        >
          Volver a Compras
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Editar Detalle de Compra</h1>
        <Link
          to="/dashboard/Purchases"
          className="flex items-center gap-1 text-gray-600 hover:text-[#FF5E0A] transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Volver a Compras</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Información del Detalle de Compra</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* ID del Detalle */}
            <div>
              <label htmlFor="line_item_id" className="block text-sm font-medium text-gray-700 mb-1">
                ID del Detalle
              </label>
              <input
                type="text"
                id="line_item_id"
                name="line_item_id"
                value={formData.line_item_id}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            {/* Factura de Compra */}
            <div>
              <label htmlFor="invoice_purchase_id" className="block text-sm font-medium text-gray-700 mb-1">
                Factura de Compra
              </label>
              <select
                id="invoice_purchase_id"
                name="invoice_purchase_id"
                value={formData.invoice_purchase_id}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                required
              >
                <option value="">Seleccionar factura...</option>
                {invoices.map((invoice) => (
                  <option key={invoice.invoice_purchase_id} value={invoice.invoice_purchase_id}>
                    Factura #{invoice.invoice_purchase_id} - ${invoice.total}
                  </option>
                ))}
              </select>
            </div>

            {/* Producto */}
            <div>
              <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">
                Producto
              </label>
              <select
                id="product_id"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                required
              >
                <option value="">Seleccionar producto...</option>
                {products.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.product_name} - Stock: {product.stock}
                  </option>
                ))}
              </select>
            </div>

            {/* Cantidad y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Unitario
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Subtotal */}
            <div>
              <label htmlFor="sub_total" className="block text-sm font-medium text-gray-700 mb-1">
                Subtotal
              </label>
              <input
                type="number"
                step="0.01"
                id="sub_total"
                name="sub_total"
                value={formData.sub_total}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF5E0A] focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            to="/dashboard/Purchases"
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

export default EditPurchase 