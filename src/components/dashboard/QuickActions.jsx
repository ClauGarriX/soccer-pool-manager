import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, DollarSign } from 'lucide-react';

const QuickActions = ({ onCrearQuiniela, onRegistrarPago }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <button
        onClick={() => onCrearQuiniela && onCrearQuiniela()}
        className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-lg">
            <Plus size={32} />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold">Crear Quiniela</h3>
            <p className="text-blue-100 text-sm mt-1">Nueva quiniela de la jornada</p>
          </div>
        </div>
      </button>

      <button
        onClick={() => navigate('/pagos')}
        className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-lg">
            <DollarSign size={32} />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold">Registrar Pago</h3>
            <p className="text-green-100 text-sm mt-1">Añadir pago de participante</p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default QuickActions;
