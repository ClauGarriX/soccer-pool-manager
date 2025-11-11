import React, { useState } from 'react';
import { CheckCircle2, Download, RefreshCw, X, Lightbulb, Calendar, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Confetti from 'react-confetti';
import { useWindowSize } from '@uidotdev/usehooks';
import PDFComprobante from './PDFComprobante';

const SuccessScreen = ({ respuesta, quiniela, onNuevaQuiniela }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const { width, height } = useWindowSize();

  // Detener confetti después de 5 segundos
  React.useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDescargarPDF = async () => {
    setGenerandoPDF(true);
    try {
      await PDFComprobante.generar(respuesta, quiniela);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta de nuevo.');
    } finally {
      setGenerandoPDF(false);
    }
  };

  const formatearFecha = () => {
    if (!respuesta.data.timestamp) return '';

    try {
      const fecha = respuesta.data.timestamp.toDate();
      return format(fecha, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Confetti */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header con animación de éxito */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="bg-white rounded-full p-4 animate-bounce">
                <CheckCircle2 size={64} className="text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              ¡Quiniela Enviada Exitosamente!
            </h1>
            <p className="text-lg text-white/90">
              Gracias <span className="font-bold">{respuesta.data.participante.nombre}</span>,
              tu participación ha sido registrada
            </p>
          </div>

          {/* Contenido */}
          <div className="p-8 space-y-6">
            {/* Información del registro */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h2 className="font-bold text-xl text-gray-800 mb-4 text-center">
                Resumen de tu Registro
              </h2>

              <div className="space-y-3">
                {/* Folio */}
                <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Hash className="text-blue-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">Folio Único</p>
                      <p className="font-bold text-lg text-gray-800">{respuesta.folio}</p>
                    </div>
                  </div>
                </div>

                {/* Fecha */}
                <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-purple-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">Fecha de Registro</p>
                      <p className="font-semibold text-gray-800">{formatearFecha()}</p>
                    </div>
                  </div>
                </div>

                {/* Total predicciones */}
                <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">Total de Predicciones</p>
                      <p className="font-semibold text-gray-800">
                        {respuesta.data.predicciones.length} partidos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensaje importante */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex items-start gap-3">
              <Lightbulb className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">
                  Importante: Conserva tu comprobante
                </p>
                <p className="text-sm text-yellow-800">
                  Te recomendamos descargar el comprobante en PDF para verificar tus predicciones
                  y tener un registro permanente de tu participación.
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              {/* Descargar PDF */}
              <button
                onClick={handleDescargarPDF}
                disabled={generandoPDF}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generandoPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <Download size={24} />
                    Descargar mi Comprobante (PDF)
                  </>
                )}
              </button>

              {/* Enviar otra quiniela */}
              <button
                onClick={onNuevaQuiniela}
                className="w-full py-4 px-6 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
              >
                <RefreshCw size={20} />
                Enviar Otra Quiniela
              </button>

              {/* Cerrar */}
              <button
                onClick={() => window.close()}
                className="w-full py-3 px-6 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <X size={20} />
                Cerrar
              </button>
            </div>

            {/* Pie de página */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                ¡Buena suerte con tus predicciones! 🍀
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
