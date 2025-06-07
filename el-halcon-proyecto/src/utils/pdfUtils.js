import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatDate } from './dateUtils'

/**
 * Genera un PDF para una factura de venta
 * @param {Object} invoice - Datos de la factura
 * @param {Array} details - Detalles de la factura
 * @param {Object} provider - Información del proveedor
 * @param {Object} employee - Información del empleado
 */
export function generateSaleInvoicePDF(invoice, details = [], provider = {}, employee = {}) {
  const doc = new jsPDF()
  
  // Configuración de colores
  const primaryColor = [255, 94, 10] // Color naranjo de la app
  const textColor = [51, 51, 51]
  
  // Encabezado de la empresa
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('EL HALCÓN', 20, 25)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Casa de Empeños', 20, 32)
  
  // Título de factura
  doc.setTextColor(...textColor)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('FACTURA DE VENTA', 120, 25)
  
  // Información de la factura
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Factura #: ${String(invoice.invoice_sale_id || 'N/A')}`, 120, 35)
  
  // Información principal
  let yPos = 60
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('INFORMACIÓN DE LA FACTURA', 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const invoiceInfo = [
    ['Fecha:', formatDate(invoice.date)],
    ['Total:', `$${Number(invoice.total || 0).toFixed(2)}`],
    ['Método de Pago:', String(invoice.payment_id || 'N/A')],
    ['Comentarios:', String(invoice.comment_sales || 'Ninguno')]
  ]
  
  invoiceInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(String(label), 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value), 60, yPos)
    yPos += 8
  })
  
  // Información del proveedor
  yPos += 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('PROVEEDOR', 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const providerInfo = [
    ['ID:', String(provider.provider_id || 'N/A')],
    ['Nombre:', `${String(provider.first_name || '')} ${String(provider.last_name || '')}`.trim() || 'N/A'],
    ['Email:', String(provider.email || 'N/A')],
    ['Teléfono:', String(provider.phone || 'N/A')]
  ]
  
  providerInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(String(label), 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value), 60, yPos)
    yPos += 8
  })
  
  // Información del empleado
  yPos += 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('EMPLEADO', 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const employeeInfo = [
    ['ID:', String(employee.employee_id || 'N/A')],
    ['Nombre:', `${String(employee.first_name || '')} ${String(employee.last_name || '')}`.trim() || 'N/A']
  ]
  
  employeeInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(String(label), 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value), 60, yPos)
    yPos += 8
  })
  
  // Tabla de detalles si existen
  if (details && details.length > 0) {
    yPos += 10
    
    const tableHeaders = ['Item', 'Cantidad', 'Precio Unit.', 'Subtotal', 'Producto']
    const tableData = details.map(detail => [
      String(detail.line_item_id || 'N/A'),
      String(detail.quantity || '0'),
      `$${Number(detail.price || 0).toFixed(2)}`,
      `$${Number(detail.sub_total || 0).toFixed(2)}`,
      String(detail.product_id || 'N/A')
    ])
    
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: yPos,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      margin: { left: 20, right: 20 }
    })
  }
  
  // Pie de página
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text('Generado por Sistema El Halcón', 20, pageHeight - 20)
  doc.text(`Fecha de generación: ${formatDate(new Date().toISOString())}`, 20, pageHeight - 15)
  
  // Descargar el PDF
  doc.save(`Factura_Venta_${invoice.invoice_sale_id}.pdf`)
}

/**
 * Genera un PDF para una factura de compra
 * @param {Object} invoice - Datos de la factura
 * @param {Array} details - Detalles de la factura
 * @param {Object} customer - Información del cliente
 * @param {Object} employee - Información del empleado
 */
export function generatePurchaseInvoicePDF(invoice, details = [], customer = {}, employee = {}) {
  const doc = new jsPDF()
  
  // Configuración de colores
  const primaryColor = [255, 94, 10]
  const textColor = [51, 51, 51]
  
  // Encabezado de la empresa
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('EL HALCÓN', 20, 25)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Casa de Empeños', 20, 32)
  
  // Título de factura
  doc.setTextColor(...textColor)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('FACTURA DE COMPRA', 120, 25)
  
  // Información de la factura
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Factura #: ${String(invoice.invoice_purchase_id || 'N/A')}`, 120, 35)
  
  // Información principal
  let yPos = 60
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('INFORMACIÓN DE LA FACTURA', 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const invoiceInfo = [
    ['Fecha:', formatDate(invoice.date)],
    ['Total:', `$${Number(invoice.total || 0).toFixed(2)}`],
    ['Método de Pago:', String(invoice.payment_id || 'N/A')],
    ['Comentarios:', String(invoice.comment_purchases || 'Ninguno')]
  ]
  
  invoiceInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(String(label), 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value), 60, yPos)
    yPos += 8
  })
  
  // Información del cliente
  yPos += 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENTE', 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const customerInfo = [
    ['ID:', String(customer.customer_id || 'N/A')],
    ['Nombre:', `${String(customer.first_name || '')} ${String(customer.last_name || '')}`.trim() || 'N/A'],
    ['Email:', String(customer.email || 'N/A')],
    ['Teléfono:', String(customer.phone || 'N/A')],
    ['Dirección:', String(customer.address || 'N/A')]
  ]
  
  customerInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(String(label), 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value), 60, yPos)
    yPos += 8
  })
  
  // Información del empleado
  yPos += 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('EMPLEADO', 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const employeeInfo = [
    ['ID:', String(employee.employee_id || 'N/A')],
    ['Nombre:', `${String(employee.first_name || '')} ${String(employee.last_name || '')}`.trim() || 'N/A']
  ]
  
  employeeInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(String(label), 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value), 60, yPos)
    yPos += 8
  })
  
  // Tabla de detalles si existen
  if (details && details.length > 0) {
    yPos += 10
    
    const tableHeaders = ['Item', 'Cantidad', 'Precio Unit.', 'Subtotal', 'Producto']
    const tableData = details.map(detail => [
      String(detail.line_item_id || 'N/A'),
      String(detail.quantity || '0'),
      `$${Number(detail.price || 0).toFixed(2)}`,
      `$${Number(detail.sub_total || 0).toFixed(2)}`,
      String(detail.product_id || 'N/A')
    ])
    
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: yPos,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      margin: { left: 20, right: 20 }
    })
  }
  
  // Pie de página
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text('Generado por Sistema El Halcón', 20, pageHeight - 20)
  doc.text(`Fecha de generación: ${formatDate(new Date().toISOString())}`, 20, pageHeight - 15)
  
  // Descargar el PDF
  doc.save(`Factura_Compra_${invoice.invoice_purchase_id}.pdf`)
} 