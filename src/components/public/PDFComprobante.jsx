import PDFService from '../../services/pdfService';

/**
 * Componente helper para generar PDFs de comprobantes
 * Este no es un componente React visual, sino una clase de utilidad
 */
class PDFComprobante {
  /**
   * Generar comprobante individual para un participante
   * @param {Object} respuesta - Objeto de respuesta con folio, data, etc.
   * @param {Object} quiniela - Objeto de quiniela con nombre, partidos, etc.
   */
  static async generar(respuesta, quiniela) {
    try {
      await PDFService.generarComprobanteIndividual(respuesta, quiniela);
      return { success: true };
    } catch (error) {
      console.error('Error al generar comprobante PDF:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generar reporte completo para admin
   * @param {Object} quiniela - Objeto de quiniela
   * @param {Array} participantes - Array de participantes
   */
  static async generarReporte(quiniela, participantes) {
    try {
      await PDFService.generarReporteCompleto(quiniela, participantes);
      return { success: true };
    } catch (error) {
      console.error('Error al generar reporte PDF:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generar reporte detallado con todas las predicciones
   * @param {Object} quiniela - Objeto de quiniela
   * @param {Array} participantes - Array de participantes
   */
  static async generarReporteDetallado(quiniela, participantes) {
    try {
      await PDFService.generarReporteDetallado(quiniela, participantes);
      return { success: true };
    } catch (error) {
      console.error('Error al generar reporte detallado PDF:', error);
      return { success: false, error: error.message };
    }
  }
}

export default PDFComprobante;
