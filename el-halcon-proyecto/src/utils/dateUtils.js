/**
 * Formatea una fecha ISO a formato legible en español
 * @param {string} isoDate - Fecha en formato ISO (ej: "2004-02-06T05:00:00.000Z")
 * @returns {string} - Fecha formateada (ej: "6 Feb 2004")
 */
export function formatDate(isoDate) {
  if (!isoDate) return "—"
  
  try {
    const date = new Date(isoDate)
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return "—"
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error formateando fecha:', error)
    return "—"
  }
}

/**
 * Formatea una fecha ISO a formato de fecha simple (DD/MM/YYYY)
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {string} - Fecha formateada (ej: "06/02/2004")
 */
export function formatDateSimple(isoDate) {
  if (!isoDate) return "—"
  
  try {
    const date = new Date(isoDate)
    
    if (isNaN(date.getTime())) return "—"
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error formateando fecha:', error)
    return "—"
  }
} 