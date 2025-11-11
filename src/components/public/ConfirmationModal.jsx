import React from 'react';
import { X, Edit, CheckCircle, Target } from 'lucide-react';

const ConfirmationModal = ({ datosParticipante, predicciones, quiniela, onConfirm, onCancel }) => {
  // Función para obtener el texto legible de la predicción
  const getPrediccionTexto = (prediccion) => {
    switch (prediccion) {
      case 'local':
        return 'Gana Local';
      case 'empate':
        return 'Empate';
      case 'visitante':
        return 'Gana Visitante';
      default:
        return prediccion;
    }
  };

  // Función para obtener el color de la predicción
  const getPrediccionColor = (prediccion) => {
    switch (prediccion) {
      case 'local':
        return 'text-blue-600 bg-blue-50';
      case 'empate':
        return 'text-yellow-700 bg-yellow-50';
      case 'visitante':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Confirma tus Predicciones
              </h2>
              <p className="text-white/90">Revisa antes de enviar</p>
            </div>
            <button
              onClick={onCancel}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body - Scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Datos del participante */}
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-bold text-lg text-blue-900 mb-3 flex items-center gap-2">
              <CheckCircle size={20} />
              Tus Datos
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Nombre:</span> {datosParticipante.nombre}
              </p>
              {datosParticipante.email && (
                <p>
                  <span className="font-semibold">Email:</span> {datosParticipante.email}
                </p>
              )}
              {datosParticipante.telefono && (
                <p>
                  <span className="font-semibold">Teléfono:</span> {datosParticipante.telefono}
                </p>
              )}
            </div>
          </div>

          {/* Predicciones */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <Target size={20} />
              Tus Predicciones
            </h3>
            <div className="space-y-3">
              {predicciones.map((pred, index) => (
                <div
                  key={pred.partidoId}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-600 text-white font-bold text-sm px-3 py-1 rounded-full">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {pred.equipoLocal} vs {pred.equipoVisitante}
                        </p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-semibold ${getPrediccionColor(pred.prediccion)}`}>
                      {getPrediccionTexto(pred.prediccion)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-5 border border-green-200">
            <p className="text-center text-gray-700">
              <span className="font-bold text-lg">Total de predicciones:</span>{' '}
              <span className="text-2xl font-bold text-green-600">{predicciones.length}</span>{' '}
              partidos
            </p>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-6 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Edit size={20} />
              Editar Predicciones
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Confirmar y Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
