import React, { useState } from 'react';
import useQuinielas from '../hooks/useQuinielas';
import StatsCards from '../components/dashboard/StatsCards';
import QuickActions from '../components/dashboard/QuickActions';
import QuinielasTable from '../components/dashboard/QuinielasTable';
import Timeline from '../components/dashboard/Timeline';
import QuinielaModal from '../components/quinielas/QuinielaModal';

const DashboardPage = () => {
  const {
    quinielas,
    quinielasActivas,
    respuestas,
    loading,
    crearQuiniela,
    actualizarQuiniela,
    eliminarQuiniela,
    toggleActivaQuiniela,
    obtenerQuiniela
  } = useQuinielas();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quinielaEditando, setQuinielaEditando] = useState(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600 mt-1">Gestiona tus quinielas de Liga MX</p>
      </div>

      {/* Stats Cards */}
      <StatsCards quinielas={quinielas} respuestas={respuestas} />

      {/* Quick Actions */}
      <QuickActions
        onCrearQuiniela={() => setShowCreateModal(true)}
      />

      {/* Quinielas Table */}
      <QuinielasTable
        quinielas={quinielasActivas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />

      {/* Timeline */}
      <Timeline quinielas={quinielas} />

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

export default DashboardPage;
