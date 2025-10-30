import React, { useState } from 'react';
import usePagos from '../hooks/usePagos';
import useQuinielas from '../hooks/useQuinielas';
import { Plus, Filter, Edit2, Trash2, DollarSign, Users, CheckCircle, Clock } from 'lucide-react';
import PagoModal from '../components/pagos/PagoModal';

const PagosPage = () => {
  const {
    pagos,
    pagosPagados,
    pagosPendientes,
    totalRecaudado,
    loading: loadingPagos,
    registrarPago,
    actualizarPago,
    eliminarPago,
    obtenerPago
  } = usePagos();

  const { quinielas, loading: loadingQuinielas } = useQuinielas();

  const [showPagoModal, setShowPagoModal] = useState(false);
  const [pagoEditando, setPagoEditando] = useState(null);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'pagados', 'pendientes'

  const handleEdit = (id) => {
    const pago = obtenerPago(id);
    setPagoEditando(pago);
    setShowPagoModal(true);
  };

  const handleSavePago = async (pagoData) => {
    let result;
    if (pagoEditando) {
      result = await actualizarPago(pagoEditando.id, pagoData);
    } else {
      result = await registrarPago(pagoData);
    }

    if (result.success) {
      alert(pagoEditando ? 'Pago actualizado correctamente' : 'Pago registrado correctamente');
      setShowPagoModal(false);
      setPagoEditando(null);
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleCloseModal = () => {
    setShowPagoModal(false);
    setPagoEditando(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pago?')) {
      const result = await eliminarPago(id);
      if (result.success) {
        alert('Pago eliminado correctamente');
      } else {
        alert('Error al eliminar pago: ' + result.error);
      }
    }
  };

  const pagosFiltrados = () => {
    switch (filtro) {
      case 'pagados':
        return pagosPagados;
      case 'pendientes':
        return pagosPendientes;
      default:
        return pagos;
    }
  };

  const formatearFecha = (timestamp) => {
    if (!timestamp) return 'Sin fecha';
    const fecha = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return fecha.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  };

  const obtenerNombreQuiniela = (quinielaId) => {
    const quiniela = quinielas.find(q => q.id === quinielaId);
    return quiniela ? quiniela.nombre : 'Desconocida';
  };

  if (loadingPagos || loadingQuinielas) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Pagos</h2>
          <p className="text-gray-600 mt-1">Administra los pagos de participantes</p>
        </div>
        <button
          onClick={() => setShowPagoModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Registrar Pago
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Recaudado</p>
              <p className="text-2xl font-bold mt-1">{formatearMonto(totalRecaudado)}</p>
            </div>
            <DollarSign size={40} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Pagos</p>
              <p className="text-3xl font-bold mt-1">{pagos.length}</p>
            </div>
            <Users size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Pagados</p>
              <p className="text-3xl font-bold mt-1">{pagosPagados.length}</p>
            </div>
            <CheckCircle size={40} className="text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Pendientes</p>
              <p className="text-3xl font-bold mt-1">{pagosPendientes.length}</p>
            </div>
            <Clock size={40} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md">
        <Filter size={20} className="text-gray-600" />
        <span className="text-sm font-semibold text-gray-700">Filtrar por estado:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtro === 'todos'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({pagos.length})
          </button>
          <button
            onClick={() => setFiltro('pagados')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtro === 'pagados'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pagados ({pagosPagados.length})
          </button>
          <button
            onClick={() => setFiltro('pendientes')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtro === 'pendientes'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendientes ({pagosPendientes.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quiniela
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha
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
              {pagosFiltrados().length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No hay pagos registrados.
                  </td>
                </tr>
              ) : (
                pagosFiltrados().map((pago) => (
                  <tr key={pago.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {pago.usuario}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {obtenerNombreQuiniela(pago.quinielaId)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-green-600">
                        {formatearMonto(pago.monto)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                        {pago.metodoPago}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {formatearFecha(pago.fechaPago)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        pago.estado === 'pagado'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {pago.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(pago.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(pago.id)}
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

      {/* Modal */}
      <PagoModal
        isOpen={showPagoModal}
        onClose={handleCloseModal}
        onSave={handleSavePago}
        pagoInicial={pagoEditando}
        quinielas={quinielas}
      />
    </div>
  );
};

export default PagosPage;
