import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Target, Clock, AlertTriangle } from 'lucide-react';
import useParticipantes from '../hooks/useParticipantes';
import QuinielaForm from '../components/public/QuinielaForm';
import ConfirmationModal from '../components/public/ConfirmationModal';
import SuccessScreen from '../components/public/SuccessScreen';

const QuinielaPublicPage = () => {
  const { quinielaId } = useParams();
  const {
    loading,
    quiniela,
    obtenerQuinielaPorId,
    enviarRespuesta,
    validarFechaLimite,
    calcularTiempoRestante
  } = useParticipantes();

  const [error, setError] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [datosTemporales, setDatosTemporales] = useState(null);
  const [prediccionesTemporales, setPrediccionesTemporales] = useState(null);
  const [respuestaEnviada, setRespuestaEnviada] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Cargar quiniela al montar
  useEffect(() => {
    const cargarQuiniela = async () => {
      console.log('Cargando quiniela con ID:', quinielaId);
      const resultado = await obtenerQuinielaPorId(quinielaId);
      console.log('Resultado de obtenerQuinielaPorId:', resultado);
      if (!resultado.success) {
        console.error('Error al cargar quiniela:', resultado.error);
        setError(resultado.error || 'Quiniela no encontrada');
      } else {
        console.log('Quiniela cargada exitosamente:', resultado.data);
        setError(null); // Clear any previous errors
      }
    };

    if (quinielaId) {
      cargarQuiniela();
    } else {
      setError('ID de quiniela no válido');
    }
    // obtenerQuinielaPorId is now stable (wrapped in useCallback), so we only depend on quinielaId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quinielaId]);

  // Actualizar tiempo restante cada minuto
  useEffect(() => {
    if (!quiniela) return;

    const actualizarTiempo = () => {
      const tiempo = calcularTiempoRestante(quiniela);
      setTiempoRestante(tiempo);
    };

    actualizarTiempo();
    const intervalo = setInterval(actualizarTiempo, 60000); // Cada minuto

    return () => clearInterval(intervalo);
    // calcularTiempoRestante is now stable (wrapped in useCallback), so we only depend on quiniela
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiniela]);

  // Manejar apertura del modal de confirmación
  const handleFormSubmit = (datosParticipante, predicciones) => {
    setDatosTemporales(datosParticipante);
    setPrediccionesTemporales(predicciones);
    setShowConfirmModal(true);
  };

  // Manejar confirmación final del envío
  const handleConfirmSubmit = async () => {
    setEnviando(true);
    setShowConfirmModal(false);

    const resultado = await enviarRespuesta(
      quinielaId,
      datosTemporales,
      prediccionesTemporales
    );

    setEnviando(false);

    if (resultado.success) {
      setRespuestaEnviada(resultado);
      setShowSuccessScreen(true);
    } else {
      setError(resultado.error || 'Error al enviar respuesta');
    }
  };

  // Pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Cargando quiniela...</p>
        </div>
      </div>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Quiniela no encontrada
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">
            Verifica que el enlace sea correcto o contacta al administrador
          </p>
        </div>
      </div>
    );
  }

  // Verificar si la quiniela está activa
  if (quiniela && !quiniela.activa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Quiniela Inactiva
          </h2>
          <p className="text-gray-600">
            Esta quiniela no está aceptando participaciones en este momento.
          </p>
        </div>
      </div>
    );
  }

  // Verificar fecha límite
  if (quiniela && !validarFechaLimite(quiniela)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <Clock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Tiempo Agotado
          </h2>
          <p className="text-gray-600">
            La fecha límite para participar en esta quiniela ha expirado.
          </p>
        </div>
      </div>
    );
  }

  // Verificar que la quiniela tenga partidos
  if (quiniela && (!quiniela.partidos || quiniela.partidos.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Quiniela sin Partidos
          </h2>
          <p className="text-gray-600">
            Esta quiniela no tiene partidos configurados. Contacta al administrador.
          </p>
        </div>
      </div>
    );
  }

  // Verificar si quiniela está disponible
  if (!quiniela) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Quiniela no disponible
          </h2>
          <p className="text-gray-600">
            No se pudo cargar la información de la quiniela. Por favor, intenta de nuevo.
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de éxito
  if (showSuccessScreen && respuestaEnviada) {
    return (
      <SuccessScreen
        respuesta={respuestaEnviada}
        quiniela={quiniela}
        onNuevaQuiniela={() => {
          setShowSuccessScreen(false);
          setRespuestaEnviada(null);
          setDatosTemporales(null);
          setPrediccionesTemporales(null);
        }}
      />
    );
  }

  // Formulario principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" style={{ WebkitTapHighlightColor: 'transparent' }}>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-6">
          {/* Background con gradiente azul oscuro y plateado */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-blue-900 to-slate-800"></div>

          {/* Glassmorphism overlay optimizado */}
          <div className="glass-header relative backdrop-blur-sm bg-white/10 p-5 sm:p-8 text-white">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="glass-icon bg-white/15 p-2.5 sm:p-3 rounded-xl border border-white/20">
                <Target size={28} className="sm:w-8 sm:h-8 drop-shadow-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight drop-shadow-md">{quiniela.nombre}</h1>
                {quiniela.descripcion && (
                  <p className="text-white/95 mt-1.5 sm:mt-2 text-sm sm:text-base drop-shadow-sm">{quiniela.descripcion}</p>
                )}
              </div>
            </div>

            {/* Contador de tiempo restante */}
            {tiempoRestante && (tiempoRestante.dias > 0 || tiempoRestante.horas > 0 || tiempoRestante.minutos > 0) && (
              <div className="glass-timer bg-white/15 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2.5">
                  <Clock size={18} className="sm:w-5 sm:h-5 drop-shadow" />
                  <span className="font-semibold text-sm sm:text-base drop-shadow">Tiempo restante:</span>
                </div>
                <div className="flex justify-center gap-3 sm:gap-4 text-center">
                  {tiempoRestante.dias > 0 && (
                    <div className="glass-time-unit bg-white/10 rounded-lg px-3 py-2 min-w-[60px]">
                      <div className="text-2xl sm:text-3xl font-bold drop-shadow-md">{tiempoRestante.dias}</div>
                      <div className="text-xs sm:text-sm text-white/90 drop-shadow-sm">
                        {tiempoRestante.dias === 1 ? 'día' : 'días'}
                      </div>
                    </div>
                  )}
                  <div className="glass-time-unit bg-white/10 rounded-lg px-3 py-2 min-w-[60px]">
                    <div className="text-2xl sm:text-3xl font-bold drop-shadow-md">{tiempoRestante.horas}</div>
                    <div className="text-xs sm:text-sm text-white/90 drop-shadow-sm">horas</div>
                  </div>
                  <div className="glass-time-unit bg-white/10 rounded-lg px-3 py-2 min-w-[60px]">
                    <div className="text-2xl sm:text-3xl font-bold drop-shadow-md">{tiempoRestante.minutos}</div>
                    <div className="text-xs sm:text-sm text-white/90 drop-shadow-sm">min</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Formulario */}
        <QuinielaForm
          quiniela={quiniela}
          onSubmit={handleFormSubmit}
          loading={enviando}
        />

        {/* Modal de confirmación */}
        {showConfirmModal && (
          <ConfirmationModal
            datosParticipante={datosTemporales}
            predicciones={prediccionesTemporales}
            quiniela={quiniela}
            onConfirm={handleConfirmSubmit}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default QuinielaPublicPage;
