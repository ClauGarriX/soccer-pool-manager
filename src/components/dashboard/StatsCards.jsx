import React from 'react';
import { Trophy, List, Users, TrendingUp } from 'lucide-react';

const StatsCards = ({ quinielas, respuestas }) => {
  const quinielasActivas = quinielas.filter(q => q.activa).length;
  const totalRespuestas = respuestas.length;
  const totalPartidos = quinielas.reduce((acc, q) => acc + (q.partidos?.length || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Quinielas Totales</p>
            <p className="text-3xl font-bold mt-1">{quinielas.length}</p>
          </div>
          <Trophy size={40} className="text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Quinielas Activas</p>
            <p className="text-3xl font-bold mt-1">{quinielasActivas}</p>
          </div>
          <List size={40} className="text-purple-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Respuestas Totales</p>
            <p className="text-3xl font-bold mt-1">{totalRespuestas}</p>
          </div>
          <Users size={40} className="text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">Total Partidos</p>
            <p className="text-3xl font-bold mt-1">{totalPartidos}</p>
          </div>
          <TrendingUp size={40} className="text-orange-200" />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
