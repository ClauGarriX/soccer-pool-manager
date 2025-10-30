import React from 'react';
import { Home, Plus } from 'lucide-react';

const CreateQuiniela = ({
  jornada,
  partidos,
  onNavigate,
  onSaveJornada,
  onAgregarPartido,
  onActualizarPartido,
  onEliminarPartido
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Home size={24} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Crear/Editar Quiniela</h2>
          <p className="text-gray-600 text-sm">Configura los partidos para la jornada actual</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold text-gray-800">Jornada {jornada}</h3>
            <button
              onClick={() => onSaveJornada(jornada + 1)}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Nueva Jornada
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {partidos.map((partido) => (
            <div key={partido.id} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <input
                type="text"
                placeholder="Equipo Local"
                value={partido.local}
                onChange={(e) => onActualizarPartido(partido.id, 'local', e.target.value)}
                className="col-span-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="col-span-1 text-center font-bold text-gray-600">vs</span>
              <input
                type="text"
                placeholder="Equipo Visitante"
                value={partido.visitante}
                onChange={(e) => onActualizarPartido(partido.id, 'visitante', e.target.value)}
                className="col-span-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                value={partido.fecha}
                onChange={(e) => onActualizarPartido(partido.id, 'fecha', e.target.value)}
                className="col-span-2 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => onEliminarPartido(partido.id)}
                className="col-span-1 bg-red-500 text-white px-2 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onAgregarPartido}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          + Agregar Partido
        </button>
      </div>
    </div>
  );
};

export default CreateQuiniela;