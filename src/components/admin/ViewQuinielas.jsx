import React from 'react';
import { Home, Download, Trophy } from 'lucide-react';

const ViewQuinielas = ({
  quinielas,
  onNavigate,
  onExportarExcel
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home size={24} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quinielas Recibidas</h2>
            <p className="text-gray-600 text-sm">{quinielas.length} quinielas en total</p>
          </div>
        </div>

        <button
          onClick={onExportarExcel}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <Download size={18} />
          Exportar Excel
        </button>
      </div>

      <div className="space-y-3">
        {quinielas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Trophy className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg">Aún no hay quinielas enviadas</p>
          </div>
        ) : (
          quinielas.map((q) => (
            <div key={q.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xl font-bold text-gray-800">{q.nombre}</p>
                  <p className="text-sm text-gray-600">Jornada {q.jornada} • {q.fecha}</p>
                </div>
                <Trophy className="text-yellow-500" size={24} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {q.predicciones.map((pred, idx) => (
                  <span key={idx} className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    pred === 'L' ? 'bg-blue-100 text-blue-800' :
                    pred === 'E' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {pred}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewQuinielas;