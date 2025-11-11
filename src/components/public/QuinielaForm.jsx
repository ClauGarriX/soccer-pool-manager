import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Send, AlertCircle } from 'lucide-react';
import PredictionCard from './PredictionCard';

const QuinielaForm = ({ quiniela, onSubmit, loading }) => {
  const [datosParticipante, setDatosParticipante] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  const [predicciones, setPredicciones] = useState({});
  const [errores, setErrores] = useState({});
  const [partidosCompletos, setPartidosCompletos] = useState(0);

  // Calcular progreso de predicciones
  useEffect(() => {
    const completos = Object.keys(predicciones).length;
    setPartidosCompletos(completos);
  }, [predicciones]);

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar nombre
    if (!datosParticipante.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (datosParticipante.nombre.length > 30) {
      nuevosErrores.nombre = 'El nombre no puede exceder 30 caracteres';
    }

    // Validar email (opcional pero debe ser válido si se proporciona)
    if (datosParticipante.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosParticipante.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    // Validar que todos los partidos tengan predicción
    const totalPartidos = quiniela.partidos?.length || 0;
    if (Object.keys(predicciones).length !== totalPartidos) {
      nuevosErrores.predicciones = `Debes completar las predicciones de los ${totalPartidos} partidos`;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar cambio en predicción
  const handlePrediccionChange = (partidoId, valor) => {
    setPredicciones(prev => ({
      ...prev,
      [partidoId]: valor
    }));
  };

  // Manejar cambio en datos del participante
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosParticipante(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario escribe
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      // Transformar predicciones al formato requerido
      const prediccionesArray = quiniela.partidos.map(partido => ({
        partidoId: partido.id,
        equipoLocal: partido.local,
        equipoVisitante: partido.visitante,
        prediccion: predicciones[partido.id]
      }));

      onSubmit(datosParticipante, prediccionesArray);
    }
  };

  const totalPartidos = quiniela.partidos?.length || 0;
  const formularioCompleto = datosParticipante.nombre.trim() && partidosCompletos === totalPartidos;
  const progresoPorcentaje = totalPartidos > 0 ? (partidosCompletos / totalPartidos) * 100 : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sección 1: Datos del Participante */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="text-blue-600" />
          Tus Datos
        </h2>

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre o Apodo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={datosParticipante.nombre}
                onChange={handleInputChange}
                maxLength={30}
                placeholder="Ej: Juan Pérez"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errores.nombre && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errores.nombre}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {datosParticipante.nombre.length}/30 caracteres
            </p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email (opcional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={datosParticipante.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errores.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errores.email}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">
              Teléfono (opcional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={datosParticipante.telefono}
                onChange={handleInputChange}
                placeholder="1234567890"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección 2: Predicciones */}
      <div>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-3">
            Tus Predicciones
          </h2>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">
                Progreso: {partidosCompletos} de {totalPartidos} partidos
              </span>
              <span className="text-white font-bold">
                {Math.round(progresoPorcentaje)}%
              </span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-300"
                style={{ width: `${progresoPorcentaje}%` }}
              />
            </div>
          </div>
        </div>

        {errores.predicciones && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 font-semibold">{errores.predicciones}</p>
          </div>
        )}

        <div className="space-y-6">
          {quiniela.partidos?.map((partido, index) => (
            <div key={partido.id}>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-600 text-white font-bold text-sm px-3 py-1 rounded-full">
                  Partido {index + 1}
                </span>
              </div>
              <PredictionCard
                partido={partido}
                prediccion={predicciones[partido.id]}
                onPrediccionChange={handlePrediccionChange}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botón de envío */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 -mx-6 -mb-6 rounded-b-xl shadow-lg">
        <button
          type="submit"
          disabled={!formularioCompleto || loading}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-200 ${
            formularioCompleto && !loading
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              Enviando...
            </>
          ) : (
            <>
              <Send size={24} />
              Enviar mis Predicciones
            </>
          )}
        </button>

        {!formularioCompleto && (
          <p className="mt-3 text-center text-sm text-gray-600">
            Completa todos los campos requeridos y todas las predicciones para enviar
          </p>
        )}
      </div>
    </form>
  );
};

export default QuinielaForm;
