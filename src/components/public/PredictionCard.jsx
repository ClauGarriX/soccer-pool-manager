import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock } from 'lucide-react';

const PredictionCard = ({ partido, prediccion, onPrediccionChange }) => {
  const predicciones = [
    { valor: 'local', label: 'Gana Local', color: 'blue' },
    { valor: 'empate', label: 'Empate', color: 'yellow' },
    { valor: 'visitante', label: 'Gana Visitante', color: 'green' }
  ];

  const getColorClasses = (color, isSelected) => {
    const baseClasses = 'flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform';

    if (color === 'blue') {
      return isSelected
        ? `${baseClasses} bg-blue-600 text-white shadow-lg scale-105`
        : `${baseClasses} bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-md`;
    }
    if (color === 'yellow') {
      return isSelected
        ? `${baseClasses} bg-yellow-500 text-white shadow-lg scale-105`
        : `${baseClasses} bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:shadow-md`;
    }
    if (color === 'green') {
      return isSelected
        ? `${baseClasses} bg-green-600 text-white shadow-lg scale-105`
        : `${baseClasses} bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-md`;
    }
    return baseClasses;
  };

  // Formatear fecha si existe
  const formatearFecha = () => {
    if (!partido.fecha) return null;

    try {
      let fecha;
      if (partido.fecha.toDate) {
        // Es un Timestamp de Firestore
        fecha = partido.fecha.toDate();
      } else if (typeof partido.fecha === 'string') {
        // Es una string
        fecha = new Date(partido.fecha);
      } else {
        fecha = partido.fecha;
      }

      return format(fecha, "d 'de' MMMM", { locale: es });
    } catch (error) {
      return partido.fecha;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header con equipos */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          {/* Equipo Local */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-700">
                {partido.local?.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <p className="font-bold text-gray-800 text-sm md:text-base">
              {partido.local}
            </p>
          </div>

          {/* VS */}
          <div className="px-4">
            <span className="text-gray-400 font-bold text-xl">VS</span>
          </div>

          {/* Equipo Visitante */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-green-700">
                {partido.visitante?.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <p className="font-bold text-gray-800 text-sm md:text-base">
              {partido.visitante}
            </p>
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          {formatearFecha() && (
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatearFecha()}</span>
            </div>
          )}
          {partido.hora && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{partido.hora}</span>
            </div>
          )}
        </div>
      </div>

      {/* Botones de predicción */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
          Tu predicción:
        </p>
        <div className="flex gap-2">
          {predicciones.map((opcion) => (
            <button
              key={opcion.valor}
              onClick={() => onPrediccionChange(partido.id, opcion.valor)}
              className={getColorClasses(opcion.color, prediccion === opcion.valor)}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      {/* Indicador de selección */}
      {prediccion && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            ✓ Predicción registrada
          </span>
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
