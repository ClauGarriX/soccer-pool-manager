import React from 'react';
import { Calendar, Target } from 'lucide-react';

const Timeline = ({ quinielas }) => {
  // Mostrar las últimas 5 quinielas creadas
  const ultimasQuinielas = quinielas.slice(0, 5);

  const formatearFecha = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida';

    let fecha;
    if (timestamp.toDate) {
      fecha = timestamp.toDate();
    } else {
      fecha = new Date(timestamp);
    }

    return fecha.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Actividad Reciente</h3>

      {ultimasQuinielas.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay actividad reciente</p>
      ) : (
        <div className="space-y-4">
          {ultimasQuinielas.map((quiniela, index) => (
            <div key={quiniela.id} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="bg-blue-500 rounded-full p-2">
                  <Target size={16} className="text-white" />
                </div>
                {index < ultimasQuinielas.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-gray-900">{quiniela.nombre}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatearFecha(quiniela.fechaCreacion)}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>Admin</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {quiniela.partidos?.length || 0} partidos
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      quiniela.activa
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {quiniela.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;
