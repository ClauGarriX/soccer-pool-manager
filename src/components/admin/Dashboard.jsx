import React from 'react';
import { Download, Users, LogOut, Plus, List, Share2, Trophy } from 'lucide-react';

const Dashboard = ({ 
  jornada, 
  partidos, 
  quinielas, 
  linkPublico,
  onNavigate,
  onLogout,
  onGenerarLink,
  onExportarExcel
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-600 mt-1">Gestiona tus quinielas de Liga MX</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Salir</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Jornada Actual</p>
              <p className="text-3xl font-bold mt-1">{jornada}</p>
            </div>
            <Trophy size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Partidos Activos</p>
              <p className="text-3xl font-bold mt-1">{partidos.length}</p>
            </div>
            <List size={40} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Quinielas Recibidas</p>
              <p className="text-3xl font-bold mt-1">{quinielas.length}</p>
            </div>
            <Users size={40} className="text-green-200" />
          </div>
        </div>
      </div>

      {/* Acciones Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('crear-quiniela')}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500 group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-lg group-hover:bg-blue-500 transition-colors">
              <Plus size={28} className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Crear Quiniela</h3>
              <p className="text-gray-600 text-sm">Configura partidos y jornadas</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('ver-quinielas')}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-500 group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-4 rounded-lg group-hover:bg-purple-500 transition-colors">
              <List size={28} className="text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Ver Quinielas</h3>
              <p className="text-gray-600 text-sm">Revisa quinielas recibidas</p>
            </div>
          </div>
        </button>

        <button
          onClick={onGenerarLink}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-green-500 group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-4 rounded-lg group-hover:bg-green-500 transition-colors">
              <Share2 size={28} className="text-green-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Compartir Link</h3>
              <p className="text-gray-600 text-sm">Genera link para clientes</p>
            </div>
          </div>
        </button>

        <button
          onClick={onExportarExcel}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-orange-500 group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-4 rounded-lg group-hover:bg-orange-500 transition-colors">
              <Download size={28} className="text-orange-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-800">Exportar Excel</h3>
              <p className="text-gray-600 text-sm">Descarga todas las quinielas</p>
            </div>
          </div>
        </button>
      </div>

      {linkPublico && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-800 font-medium mb-2">🔗 Link para compartir:</p>
          <p className="text-sm text-green-600 break-all font-mono bg-white p-3 rounded-lg">{linkPublico}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;