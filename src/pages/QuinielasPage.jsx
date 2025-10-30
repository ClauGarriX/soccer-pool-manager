import React, { useState } from 'react';
import useQuinielas from '../hooks/useQuinielas';
import { Plus, Filter } from 'lucide-react';
import QuinielaModal from '../components/quinielas/QuinielaModal';
import QuinielasTable from '../components/dashboard/QuinielasTable';

const QuinielasPage = () => {
  const {
    quinielas,
    quinielasActivas,
    quinielasInactivas,
    loading,
    crearQuiniela,
    actualizarQuiniela,
    eliminarQuiniela,
    toggleActivaQuiniela,
    obtenerQuiniela
  } = useQuinielas();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quinielaEditando, setQuinielaEditando] = useState(null);
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'activas', 'inactivas'

  const handleEdit = (id) => {
    const quiniela = obtenerQuiniela(id);
    setQuinielaEditando(quiniela);
    setShowCreateModal(true);
  };

  const handleSaveQuiniela = async (quinielaData) => {
    let result;
    if (quinielaEditando) {
      result = await actualizarQuiniela(quinielaEditando.id, quinielaData);
    } else {
      result = await crearQuiniela(quinielaData);
    }

    if (result.success) {
      alert(quinielaEditando ? 'Quiniela actualizada correctamente' : 'Quiniela creada correctamente');
      setShowCreateModal(false);
      setQuinielaEditando(null);
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setQuinielaEditando(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta quiniela?')) {
      const result = await eliminarQuiniela(id);
      if (result.success) {
        alert('Quiniela eliminada correctamente');
      } else {
        alert('Error al eliminar quiniela: ' + result.error);
      }
    }
  };

  const handleToggle = async (id, activa) => {
    const result = await toggleActivaQuiniela(id, activa);
    if (!result.success) {
      alert('Error al cambiar estado: ' + result.error);
    }
  };

  const quinielasFiltradas = () => {
    switch (filtro) {
      case 'activas':
        return quinielasActivas;
      case 'inactivas':
        return quinielasInactivas;
      default:
        return quinielas;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando quinielas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Quinielas</h2>
          <p className="text-gray-600 mt-1">Administra todas tus quinielas</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Nueva Quiniela
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md">
        <Filter size={20} className="text-gray-600" />
        <span className="text-sm font-semibold text-gray-700">Filtrar:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setFiltro('todas')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtro === 'todas'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({quinielas.length})
          </button>
          <button
            onClick={() => setFiltro('activas')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtro === 'activas'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Activas ({quinielasActivas.length})
          </button>
          <button
            onClick={() => setFiltro('inactivas')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtro === 'inactivas'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inactivas ({quinielasInactivas.length})
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-blue-100 text-sm">Total de Quinielas</p>
          <p className="text-3xl font-bold mt-1">{quinielas.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-green-100 text-sm">Activas</p>
          <p className="text-3xl font-bold mt-1">{quinielasActivas.length}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white">
          <p className="text-gray-100 text-sm">Inactivas</p>
          <p className="text-3xl font-bold mt-1">{quinielasInactivas.length}</p>
        </div>
      </div>

      {/* Table */}
      <QuinielasTable
        quinielas={quinielasFiltradas()}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />

      {/* Modal */}
      <QuinielaModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSave={handleSaveQuiniela}
        quinielaInicial={quinielaEditando}
      />
    </div>
  );
};

export default QuinielasPage;
