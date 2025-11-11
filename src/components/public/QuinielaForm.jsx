import React, { useState, useEffect } from 'react';
import { User, Phone, Send, AlertCircle } from 'lucide-react';
import PredictionCard from './PredictionCard';

const QuinielaForm = ({ quiniela, onSubmit, loading }) => {
  const [datosParticipante, setDatosParticipante] = useState({
    nombre: '',
    telefono: ''
  });

  const [predicciones, setPredicciones] = useState({});
  const [errores, setErrores] = useState({});
  const [partidosCompletos, setPartidosCompletos] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);

  // Calcular progreso de predicciones
  useEffect(() => {
    const completos = Object.keys(predicciones).length;
    const totalPartidos = quiniela.partidos?.length || 0;

    setPartidosCompletos(completos);

    // Detectar cuando se alcanza 100%
    if (completos === totalPartidos && totalPartidos > 0 && !justCompleted) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 500);

      // Si falta el nombre, hacer scroll suave al campo de nombre después de la animación
      if (!datosParticipante.nombre.trim()) {
        setTimeout(() => {
          const nombreInput = document.getElementById('nombre');
          if (nombreInput) {
            nombreInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 600);
      }
    }
  }, [predicciones, quiniela.partidos, justCompleted, datosParticipante.nombre]);

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar nombre
    if (!datosParticipante.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (datosParticipante.nombre.length > 30) {
      nuevosErrores.nombre = 'El nombre no puede exceder 30 caracteres';
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

  // Detectar si las predicciones están completas pero falta el nombre
  const prediccionesCompletasSinNombre = partidosCompletos === totalPartidos && totalPartidos > 0 && !datosParticipante.nombre.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32" style={{ WebkitTapHighlightColor: 'transparent' }}>
      {/* Sección 1: Datos del Participante */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <User className="text-blue-600" size={24} />
          Tus Datos
        </h2>

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-bold text-gray-700 mb-2">
              Nombre o Apodo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
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
                autoComplete="name"
                className={`block w-full pl-11 pr-4 py-3.5 text-base border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errores.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ fontSize: '16px' }}
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

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-bold text-gray-700 mb-2">
              Teléfono (opcional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={datosParticipante.telefono}
                onChange={handleInputChange}
                placeholder="1234567890"
                autoComplete="tel"
                className="block w-full pl-11 pr-4 py-3.5 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección 2: Predicciones */}
      <div>
        {errores.predicciones && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 font-semibold">{errores.predicciones}</p>
          </div>
        )}

        <div className="space-y-4">
          {quiniela.partidos?.map((partido) => (
            <PredictionCard
              key={partido.id}
              partido={partido}
              prediccion={predicciones[partido.id]}
              onPrediccionChange={handlePrediccionChange}
            />
          ))}
        </div>
      </div>

      {/* Footer con Progressbar y Botón de envío */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg -mx-4 sm:-mx-6 p-4 sm:p-6">
        {/* Progress Bar */}
        <div className={`mb-4 ${justCompleted ? 'progress-complete' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Predicciones: {partidosCompletos}/{totalPartidos}
            </span>
            <span className={`text-sm font-bold ${progresoPorcentaje === 100 ? 'text-green-600' : 'text-slate-700'}`}>
              {Math.round(progresoPorcentaje)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                progresoPorcentaje === 100
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-slate-600 to-blue-800'
              }`}
              style={{ width: `${progresoPorcentaje}%` }}
            />
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={!formularioCompleto || loading}
          className={`w-full py-4 px-6 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-200 ${
            formularioCompleto && !loading
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg active:scale-98 touch-manipulation button-ready'
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
              <Send size={20} className="sm:w-6 sm:h-6" />
              Enviar Predicciones
            </>
          )}
        </button>

        {!formularioCompleto && (
          <p className="mt-3 text-center text-xs sm:text-sm text-gray-600">
            {!datosParticipante.nombre.trim() && (
              <span className={prediccionesCompletasSinNombre ? 'name-reminder font-semibold' : ''}>
                Ingresa tu nombre{partidosCompletos < totalPartidos && ' • '}
              </span>
            )}
            {partidosCompletos < totalPartidos && `Completa ${totalPartidos - partidosCompletos} predicción(es) más`}
          </p>
        )}
      </div>
    </form>
  );
};

export default QuinielaForm;
