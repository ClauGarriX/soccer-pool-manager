import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock } from 'lucide-react';

const PredictionCard = ({ partido, prediccion, onPrediccionChange }) => {
  const [justSelected, setJustSelected] = useState(false);
  const [wasCompleted, setWasCompleted] = useState(false);

  // Detectar cuando se completa el partido (primera vez que se selecciona)
  useEffect(() => {
    if (prediccion && !wasCompleted) {
      setWasCompleted(true);
      setJustSelected(true);
      const timer = setTimeout(() => setJustSelected(false), 300);
      return () => clearTimeout(timer);
    }
  }, [prediccion, wasCompleted]);
  const predicciones = [
    { valor: 'local', label: 'Local', color: 'blue' },
    { valor: 'empate', label: 'Empate', color: 'gray' },
    { valor: 'visitante', label: 'Visita', color: 'green' }
  ];

  const getColorClasses = (color, isSelected) => {
    const baseClasses = 'flex-1 min-h-[56px] rounded-xl font-bold transition-all duration-200 active:scale-95 touch-manipulation flex flex-col items-center justify-center gap-1';

    if (color === 'blue') {
      return isSelected
        ? `${baseClasses} bg-blue-600 text-white shadow-lg ring-2 ring-blue-400 ring-offset-2`
        : `${baseClasses} glass-button-blue text-blue-700 hover:bg-blue-100/80 active:bg-blue-200/80 border border-blue-200/50`;
    }
    if (color === 'gray') {
      return isSelected
        ? `${baseClasses} bg-gray-600 text-white shadow-lg ring-2 ring-gray-400 ring-offset-2`
        : `${baseClasses} glass-button-gray text-gray-700 hover:bg-gray-100/80 active:bg-gray-200/80 border border-gray-200/50`;
    }
    if (color === 'green') {
      return isSelected
        ? `${baseClasses} bg-green-600 text-white shadow-lg ring-2 ring-green-400 ring-offset-2`
        : `${baseClasses} glass-button-green text-green-700 hover:bg-green-100/80 active:bg-green-200/80 border border-green-200/50`;
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
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-all duration-200 ${justSelected ? 'match-completed' : ''}`}>
      {/* Fecha y Hora - Header */}
      {(formatearFecha() || partido.hora) && (
        <div className="flex items-center justify-center gap-3 mb-4 pb-3 border-b border-gray-100">
          {formatearFecha() && (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 font-medium">
              <Calendar size={16} className="text-gray-400" />
              <span>{formatearFecha()}</span>
            </div>
          )}
          {partido.hora && (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 font-medium">
              <Clock size={16} className="text-gray-400" />
              <span>{partido.hora}</span>
            </div>
          )}
        </div>
      )}

      {/* Equipos */}
      <div className="flex items-center justify-between mb-5">
        {/* Equipo Local */}
        <div className="flex-1 text-center">
          <span className="inline-block px-2 py-0.5 mb-2 text-xs font-bold text-blue-700 bg-blue-100 rounded-md">
            LOCAL
          </span>
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-xl sm:text-2xl font-bold text-blue-700">
              {partido.local?.substring(0, 3).toUpperCase()}
            </span>
          </div>
          <p className="font-bold text-gray-800 text-xs sm:text-sm leading-tight px-1">
            {partido.local}
          </p>
        </div>

        {/* VS */}
        <div className="px-3 sm:px-4">
          <span className="text-gray-300 font-black text-lg sm:text-xl">VS</span>
        </div>

        {/* Equipo Visitante */}
        <div className="flex-1 text-center">
          <span className="inline-block px-2 py-0.5 mb-2 text-xs font-bold text-green-700 bg-green-100 rounded-md">
            VISITA
          </span>
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-xl sm:text-2xl font-bold text-green-700">
              {partido.visitante?.substring(0, 3).toUpperCase()}
            </span>
          </div>
          <p className="font-bold text-gray-800 text-xs sm:text-sm leading-tight px-1">
            {partido.visitante}
          </p>
        </div>
      </div>

      {/* Botones de predicción */}
      <div className="flex gap-2 sm:gap-3">
        {predicciones.map((opcion) => (
          <button
            key={opcion.valor}
            type="button"
            onClick={() => {
              onPrediccionChange(partido.id, opcion.valor);
              setJustSelected(true);
              setTimeout(() => setJustSelected(false), 300);
            }}
            className={`${getColorClasses(opcion.color, prediccion === opcion.valor)} ${prediccion === opcion.valor ? 'prediction-selected' : ''}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span className="text-sm sm:text-base font-bold">{opcion.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PredictionCard;
