import React, { useState } from 'react';
import { X, Zap, Check, AlertCircle, Edit2, Calendar, Clock } from 'lucide-react';
import useLigaMX from '../../hooks/useLigaMX';

const CrearRapidoLigaMX = ({ isOpen, onClose, onConfirm }) => {
  const { loading, error, generarQuinielaLigaMX } = useLigaMX();
  const [quinielaGenerada, setQuinielaGenerada] = useState(null);
  const [editando, setEditando] = useState(false);
  const [quinielaEditada, setQuinielaEditada] = useState(null);
  const [fuente, setFuente] = useState(null);

  // Generar quiniela al abrir el modal
  const handleGenerar = async () => {
    const resultado = await generarQuinielaLigaMX();

    if (resultado.success) {
      setQuinielaGenerada(resultado.quiniela);
      setQuinielaEditada(resultado.quiniela);
      setFuente(resultado.fuente);
    }
  };

  // Confirmar y crear quiniela
  const handleConfirmar = () => {
    const quinielaFinal = editando ? quinielaEditada : quinielaGenerada;
    onConfirm(quinielaFinal);
    handleCerrar();
  };

  // Cerrar modal y resetear
  const handleCerrar = () => {
    setQuinielaGenerada(null);
    setQuinielaEditada(null);
    setEditando(false);
    setFuente(null);
    onClose();
  };

  // Actualizar campo de quiniela
  const actualizarCampo = (campo, valor) => {
    setQuinielaEditada({
      ...quinielaEditada,
      [campo]: valor
    });
  };

  // Actualizar partido
  const actualizarPartido = (index, campo, valor) => {
    const partidosActualizados = [...quinielaEditada.partidos];
    partidosActualizados[index] = {
      ...partidosActualizados[index],
      [campo]: valor
    };
    setQuinielaEditada({
      ...quinielaEditada,
      partidos: partidosActualizados
    });
  };

  // Eliminar partido
  const eliminarPartido = (index) => {
    const partidosActualizados = quinielaEditada.partidos.filter((_, i) => i !== index);
    setQuinielaEditada({
      ...quinielaEditada,
      partidos: partidosActualizados
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Zap className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Creación Rápida Liga MX</h2>
              <p className="text-green-100 text-sm">Quiniela automática con partidos de la jornada</p>
            </div>
          </div>
          <button
            onClick={handleCerrar}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Estado: Sin generar */}
          {!quinielaGenerada && !loading && !error && (
            <div className="text-center py-12">
              <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Zap className="text-green-600" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                ¿Listo para crear tu quiniela?
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Generaremos automáticamente una quiniela con los próximos partidos de Liga MX.
                Podrás revisarla y editarla antes de crearla.
              </p>
              <button
                onClick={handleGenerar}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
              >
                <Zap size={20} />
                Generar Quiniela Automática
              </button>
            </div>
          )}

          {/* Estado: Cargando */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Generando quiniela...
              </h3>
              <p className="text-gray-600">Obteniendo próximos partidos de Liga MX</p>
            </div>
          )}

          {/* Estado: Error */}
          {error && (
            <div className="text-center py-12">
              <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Error al generar quiniela</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleGenerar}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* Estado: Quiniela generada */}
          {quinielaGenerada && !editando && (
            <div className="space-y-6">
              {/* Alert de fuente */}
              <div className={`rounded-lg p-4 ${fuente === 'api' ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={fuente === 'api' ? 'text-blue-600' : 'text-yellow-600'} size={20} />
                  <div>
                    <p className={`text-sm font-semibold ${fuente === 'api' ? 'text-blue-900' : 'text-yellow-900'}`}>
                      {fuente === 'api' ? 'Datos obtenidos de API oficial' : 'Usando datos de ejemplo'}
                    </p>
                    <p className={`text-xs ${fuente === 'api' ? 'text-blue-700' : 'text-yellow-700'}`}>
                      {fuente === 'api'
                        ? 'Los partidos y horarios son reales'
                        : 'Los partidos son simulados. Puedes editarlos antes de crear la quiniela.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview de quiniela */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{quinielaGenerada.nombre}</h3>
                {quinielaGenerada.descripcion && (
                  <p className="text-gray-600 mb-4">{quinielaGenerada.descripcion}</p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Total de Partidos</p>
                    <p className="text-2xl font-bold text-gray-800">{quinielaGenerada.partidos.length}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Fecha Límite</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {quinielaGenerada.fechaLimite?.toLocaleString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Lista de partidos */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {quinielaGenerada.partidos.map((partido, index) => (
                    <div key={partido.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {partido.local} <span className="text-gray-400">vs</span> {partido.visitante}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(partido.fecha).toLocaleDateString('es-MX')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {partido.hora}
                          </span>
                        </div>
                      </div>
                      <Check className="text-green-600" size={20} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={() => setEditando(true)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} />
                  Editar Antes de Crear
                </button>
                <button
                  onClick={handleConfirmar}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Crear Quiniela
                </button>
              </div>
            </div>
          )}

          {/* Estado: Editando */}
          {editando && quinielaEditada && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Modo Edición:</strong> Puedes modificar los campos antes de crear la quiniela
                </p>
              </div>

              {/* Campos editables */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={quinielaEditada.nombre}
                  onChange={(e) => actualizarCampo('nombre', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={quinielaEditada.descripcion}
                  onChange={(e) => actualizarCampo('descripcion', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none resize-none"
                />
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <strong>Nota:</strong> Puedes editar los partidos desde el modal principal de quinielas después de crearla.
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={() => setEditando(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancelar Edición
                </button>
                <button
                  onClick={handleConfirmar}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Crear Quiniela
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrearRapidoLigaMX;
