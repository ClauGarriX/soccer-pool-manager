import React, { useState, useMemo } from 'react';
import { Search, Download, FileText, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PDFComprobante from '../public/PDFComprobante';

const ParticipantesTable = ({ participantes, quiniela }) => {
  const [busqueda, setBusqueda] = useState('');
  const [ordenPor, setOrdenPor] = useState('fecha'); // 'fecha' o 'nombre'
  const [generandoPDF, setGenerandoPDF] = useState(null);

  // Formatear fecha
  const formatearFecha = (timestamp) => {
    try {
      let fecha;
      if (timestamp.toDate) {
        fecha = timestamp.toDate();
      } else if (typeof timestamp === 'string') {
        fecha = new Date(timestamp);
      } else {
        fecha = timestamp;
      }
      return format(fecha, "d 'de' MMM, HH:mm", { locale: es });
    } catch (error) {
      return 'N/A';
    }
  };

  // Obtener texto de predicción
  const getPrediccionTexto = (prediccion) => {
    switch (prediccion) {
      case 'local':
        return 'L';
      case 'empate':
        return 'E';
      case 'visitante':
        return 'V';
      default:
        return '-';
    }
  };

  // Obtener color de predicción
  const getPrediccionColor = (prediccion) => {
    switch (prediccion) {
      case 'local':
        return 'bg-blue-100 text-blue-700';
      case 'empate':
        return 'bg-yellow-100 text-yellow-700';
      case 'visitante':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  // Filtrar y ordenar participantes
  const participantesFiltrados = useMemo(() => {
    let filtrados = [...participantes];

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      filtrados = filtrados.filter(p =>
        p.participante.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.folio.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Ordenar
    filtrados.sort((a, b) => {
      if (ordenPor === 'nombre') {
        return a.participante.nombre.localeCompare(b.participante.nombre);
      } else {
        // Por fecha (más recientes primero)
        const fechaA = a.timestamp.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const fechaB = b.timestamp.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return fechaB - fechaA;
      }
    });

    return filtrados;
  }, [participantes, busqueda, ordenPor]);

  // Descargar PDF individual
  const handleDescargarPDF = async (participante) => {
    setGenerandoPDF(participante.id);
    try {
      await PDFComprobante.generar(
        {
          folio: participante.folio,
          data: participante
        },
        quiniela
      );
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF');
    } finally {
      setGenerandoPDF(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controles de búsqueda y filtrado */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o folio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Ordenar */}
        <select
          value={ordenPor}
          onChange={(e) => setOrdenPor(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="fecha">Ordenar por Fecha</option>
          <option value="nombre">Ordenar por Nombre</option>
        </select>
      </div>

      {/* Resultados */}
      <div className="text-sm text-gray-600">
        Mostrando {participantesFiltrados.length} de {participantes.length} participantes
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Participante
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Folio
                </th>
                {quiniela.partidos.map((partido, index) => (
                  <th
                    key={partido.id}
                    className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider"
                    title={`${partido.local} vs ${partido.visitante}`}
                  >
                    P{index + 1}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participantesFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={5 + quiniela.partidos.length}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {busqueda.trim() ? 'No se encontraron participantes' : 'No hay participantes aún'}
                  </td>
                </tr>
              ) : (
                participantesFiltrados.map((participante, index) => (
                  <tr key={participante.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {participante.participante.nombre}
                          </div>
                          {participante.participante.email && (
                            <div className="text-xs text-gray-500">
                              {participante.participante.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar size={14} className="text-gray-400" />
                        {formatearFecha(participante.timestamp)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-600">
                      {participante.folio}
                    </td>
                    {quiniela.partidos.map((partido) => {
                      const pred = participante.predicciones.find(
                        p => p.partidoId === partido.id
                      );
                      const prediccion = pred ? pred.prediccion : null;
                      return (
                        <td key={partido.id} className="px-2 py-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${getPrediccionColor(prediccion)}`}
                          >
                            {getPrediccionTexto(prediccion)}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDescargarPDF(participante)}
                        disabled={generandoPDF === participante.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Descargar comprobante PDF"
                      >
                        {generandoPDF === participante.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            <span className="hidden sm:inline">Generando...</span>
                          </>
                        ) : (
                          <>
                            <FileText size={14} />
                            <span className="hidden sm:inline">PDF</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Leyenda:</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
              L
            </span>
            <span className="text-gray-600">Gana Local</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
              E
            </span>
            <span className="text-gray-600">Empate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">
              V
            </span>
            <span className="text-gray-600">Gana Visitante</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantesTable;
