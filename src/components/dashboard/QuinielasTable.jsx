import React from 'react';
import { Edit2, Trash2, Eye, EyeOff, Share2, Copy } from 'lucide-react';

const QuinielasTable = ({
  quinielas,
  onEdit,
  onDelete,
  onToggle,
  onShare
}) => {
  const copiarLink = (quinielaId) => {
    const link = `${window.location.origin}/?quiniela=${quinielaId}`;
    navigator.clipboard.writeText(link);
    // Aquí podrías añadir una notificación toast
    alert('Link copiado al portapapeles');
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600">
        <h3 className="text-xl font-bold text-white">Quinielas Activas</h3>
        <p className="text-blue-100 text-sm mt-1">Gestiona tus quinielas disponibles</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Partidos
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Respuestas
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!quinielas || quinielas.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No hay quinielas creadas. Crea tu primera quiniela.
                </td>
              </tr>
            ) : (
              quinielas.map((quiniela) => (
                <tr key={quiniela.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {quiniela.nombre}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {quiniela.partidos?.length || 0} partidos
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {quiniela.respuestas || 0} respuestas
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggle(quiniela.id, !quiniela.activa)}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        quiniela.activa
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {quiniela.activa ? (
                        <>
                          <Eye size={14} />
                          Activa
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          Inactiva
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copiarLink(quiniela.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Compartir"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={() => onEdit(quiniela.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(quiniela.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuinielasTable;
