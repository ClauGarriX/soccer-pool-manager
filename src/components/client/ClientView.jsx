import React, { useState } from 'react';
import { Send, Trophy } from 'lucide-react';

const ClientView = ({
  jornada,
  partidos,
  onEnviarQuiniela,
  onMostrarNotificacion
}) => {
  const [nombre, setNombre] = useState('');
  const [predicciones, setPredicciones] = useState(Array(partidos.length).fill(''));
  const [enviado, setEnviado] = useState(false);

  const handlePrediccion = (idx, valor) => {
    const nuevas = [...predicciones];
    nuevas[idx] = valor;
    setPredicciones(nuevas);
  };

  const handleEnviar = () => {
    if (!nombre.trim()) {
      onMostrarNotificacion('Por favor ingresa tu nombre');
      return;
    }
    
    if (predicciones.some(p => !p)) {
      onMostrarNotificacion('Por favor completa todas las predicciones');
      return;
    }

    onEnviarQuiniela(nombre, predicciones);
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="text-center py-12">
        <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Trophy className="text-green-600" size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Quiniela Enviada!</h2>
        <p className="text-gray-600 mb-2">Gracias {nombre}, tu quiniela ha sido registrada</p>
        <button
          onClick={() => {
            setEnviado(false);
            setNombre('');
            setPredicciones(Array(partidos.length).fill(''));
          }}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mt-6"
        >
          Enviar otra quiniela
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">⚽ Quiniela Liga MX</h2>
        <p className="text-gray-600">Jornada {jornada}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tu Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ingresa tu nombre"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold mb-4">Tus Predicciones</h3>
        
        {partidos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay partidos configurados aún</p>
        ) : (
          partidos.map((partido, idx) => (
            <div key={partido.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="text-center mb-3">
                <p className="font-semibold text-gray-800 text-lg">
                  {partido.local} vs {partido.visitante}
                </p>
                {partido.fecha && (
                  <p className="text-sm text-gray-600">📅 {partido.fecha} {partido.hora && `• ${partido.hora}`}</p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handlePrediccion(idx, 'L')}
                  className={`py-3 rounded-lg font-semibold transition ${
                    predicciones[idx] === 'L'
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Local
                </button>
                <button
                  onClick={() => handlePrediccion(idx, 'E')}
                  className={`py-3 rounded-lg font-semibold transition ${
                    predicciones[idx] === 'E'
                      ? 'bg-yellow-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Empate
                </button>
                <button
                  onClick={() => handlePrediccion(idx, 'V')}
                  className={`py-3 rounded-lg font-semibold transition ${
                    predicciones[idx] === 'V'
                      ? 'bg-green-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Visitante
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {partidos.length > 0 && (
        <button
          onClick={handleEnviar}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 flex items-center justify-center gap-2 shadow-lg"
        >
          <Send size={20} />
          Enviar Quiniela
        </button>
      )}
    </div>
  );
};

export default ClientView;