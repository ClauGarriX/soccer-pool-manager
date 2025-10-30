import React from 'react';
import useQuinielas from '../hooks/useQuinielas';
import usePagos from '../hooks/usePagos';
import { Trophy, Users, DollarSign, TrendingUp, Target, BarChart3 } from 'lucide-react';

const EstadisticasPage = () => {
  const { quinielas, quinielasActivas, respuestas, loading: loadingQuinielas } = useQuinielas();
  const { pagos, totalRecaudado, pagosPagados, loading: loadingPagos } = usePagos();

  // Calcular estadísticas
  const totalQuinielas = quinielas.length;
  const totalRespuestas = respuestas.length;
  const totalPagos = pagos.length;
  const totalPartidos = quinielas.reduce((acc, q) => acc + (q.partidos?.length || 0), 0);

  // Quiniela más popular
  const quinielaMasPopular = quinielas.reduce((max, q) =>
    (q.respuestas || 0) > (max.respuestas || 0) ? q : max
  , quinielas[0] || { nombre: 'N/A', respuestas: 0 });

  // Promedio de respuestas por quiniela
  const promedioRespuestas = totalQuinielas > 0
    ? (totalRespuestas / totalQuinielas).toFixed(1)
    : 0;

  // Promedio de monto por pago
  const promedioMonto = totalPagos > 0
    ? (totalRecaudado / totalPagos).toFixed(2)
    : 0;

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  };

  if (loadingQuinielas || loadingPagos) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Estadísticas</h2>
        <p className="text-gray-600 mt-1">Métricas y análisis de tu negocio</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Quinielas</p>
              <p className="text-3xl font-bold mt-1">{totalQuinielas}</p>
              <p className="text-blue-100 text-xs mt-2">{quinielasActivas.length} activas</p>
            </div>
            <Trophy size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Respuestas</p>
              <p className="text-3xl font-bold mt-1">{totalRespuestas}</p>
              <p className="text-purple-100 text-xs mt-2">Promedio: {promedioRespuestas}</p>
            </div>
            <Users size={40} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Recaudado</p>
              <p className="text-2xl font-bold mt-1">{formatearMonto(totalRecaudado)}</p>
              <p className="text-green-100 text-xs mt-2">{pagosPagados.length} pagos</p>
            </div>
            <DollarSign size={40} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Partidos</p>
              <p className="text-3xl font-bold mt-1">{totalPartidos}</p>
              <p className="text-orange-100 text-xs mt-2">En todas las quinielas</p>
            </div>
            <Target size={40} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Promedio por Quiniela</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{promedioRespuestas}</p>
          <p className="text-sm text-gray-600 mt-1">respuestas por quiniela</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Promedio de Pago</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{formatearMonto(promedioMonto)}</p>
          <p className="text-sm text-gray-600 mt-1">por participante</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Trophy className="text-purple-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Quiniela más Popular</h3>
          </div>
          <p className="text-xl font-bold text-purple-600">{quinielaMasPopular.nombre}</p>
          <p className="text-sm text-gray-600 mt-1">{quinielaMasPopular.respuestas || 0} respuestas</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Respuestas por Quiniela */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Respuestas por Quiniela</h3>
          </div>

          <div className="space-y-4">
            {quinielas.slice(0, 5).map((quiniela, index) => {
              const maxRespuestas = Math.max(...quinielas.map(q => q.respuestas || 0));
              const porcentaje = maxRespuestas > 0 ? ((quiniela.respuestas || 0) / maxRespuestas) * 100 : 0;

              return (
                <div key={quiniela.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                      {quiniela.nombre}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {quiniela.respuestas || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {quinielas.length === 0 && (
              <p className="text-center text-gray-500 py-8">No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Distribución de Pagos */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Estado de Pagos</h3>
          </div>

          <div className="space-y-6">
            {/* Pagados */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Pagados</span>
                <span className="text-sm font-bold text-green-600">
                  {pagosPagados.length} ({totalPagos > 0 ? ((pagosPagados.length / totalPagos) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${totalPagos > 0 ? (pagosPagados.length / totalPagos) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Pendientes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Pendientes</span>
                <span className="text-sm font-bold text-orange-600">
                  {pagos.length - pagosPagados.length} ({totalPagos > 0 ? (((pagos.length - pagosPagados.length) / totalPagos) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${totalPagos > 0 ? ((pagos.length - pagosPagados.length) / totalPagos) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Monto Total Recaudado</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatearMonto(totalRecaudado)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasPage;
