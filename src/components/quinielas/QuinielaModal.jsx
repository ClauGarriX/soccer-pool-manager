import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock } from 'lucide-react';

const QuinielaModal = ({ isOpen, onClose, onSave, quinielaInicial }) => {
  const [nombre, setNombre] = useState('');
  const [partidos, setPartidos] = useState([]);
  const [activa, setActiva] = useState(true);

  useEffect(() => {
    if (quinielaInicial) {
      setNombre(quinielaInicial.nombre || '');
      setPartidos(quinielaInicial.partidos || []);
      setActiva(quinielaInicial.activa !== undefined ? quinielaInicial.activa : true);
    } else {
      resetForm();
    }
  }, [quinielaInicial, isOpen]);

  const resetForm = () => {
    setNombre('');
    setPartidos([]);
    setActiva(true);
  };

  const agregarPartido = () => {
    setPartidos([
      ...partidos,
      {
        id: Date.now().toString(),
        local: '',
        visitante: '',
        fecha: '',
        hora: ''
      }
    ]);
  };

  const eliminarPartido = (id) => {
    setPartidos(partidos.filter(p => p.id !== id));
  };

  const actualizarPartido = (id, campo, valor) => {
    setPartidos(partidos.map(p =>
      p.id === id ? { ...p, [campo]: valor } : p
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('El nombre de la quiniela es requerido');
      return;
    }

    if (partidos.length === 0) {
      alert('Debes agregar al menos un partido');
      return;
    }

    const partidosValidos = partidos.every(p =>
      p.local.trim() && p.visitante.trim() && p.fecha && p.hora
    );

    if (!partidosValidos) {
      alert('Todos los partidos deben tener equipo local, visitante, fecha y hora');
      return;
    }

    onSave({
      nombre: nombre.trim(),
      partidos,
      activa
    });

    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {quinielaInicial ? 'Editar Quiniela' : 'Nueva Quiniela'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de la Quiniela
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Jornada 15 - Liga MX"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          {/* Estado */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activa}
                onChange={(e) => setActiva(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
            <span className="text-sm font-medium text-gray-700">
              Quiniela {activa ? 'Activa' : 'Inactiva'}
            </span>
          </div>

          {/* Partidos */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Partidos</h3>
              <button
                type="button"
                onClick={agregarPartido}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Plus size={18} />
                Agregar Partido
              </button>
            </div>

            <div className="space-y-4">
              {partidos.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No hay partidos. Agrega el primer partido.</p>
                </div>
              ) : (
                partidos.map((partido, index) => (
                  <div
                    key={partido.id}
                    className="bg-gray-50 rounded-lg p-4 space-y-3 border-2 border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">
                        Partido {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => eliminarPartido(partido.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={partido.local}
                        onChange={(e) => actualizarPartido(partido.id, 'local', e.target.value)}
                        placeholder="Equipo Local"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                      <input
                        type="text"
                        value={partido.visitante}
                        onChange={(e) => actualizarPartido(partido.id, 'visitante', e.target.value)}
                        placeholder="Equipo Visitante"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          value={partido.fecha}
                          onChange={(e) => actualizarPartido(partido.id, 'fecha', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                      </div>
                      <div className="relative">
                        <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="time"
                          value={partido.hora}
                          onChange={(e) => actualizarPartido(partido.id, 'hora', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            {quinielaInicial ? 'Actualizar' : 'Crear'} Quiniela
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuinielaModal;
