import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Target,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Share2,
  Copy,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useParticipantes from '../hooks/useParticipantes';
import useQuinielas from '../hooks/useQuinielas';
import ParticipantesTable from '../components/admin/ParticipantesTable';
import QRCodeShare from '../components/shared/QRCodeShare';
import PDFService from '../services/pdfService';

const QuinielaDetailsPage = () => {
  const { quinielaId } = useParams();
  const navigate = useNavigate();
  const { obtenerQuinielaPorId, obtenerParticipantes, loading } = useParticipantes();
  const { quinielas } = useQuinielas();

  const [quiniela, setQuiniela] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Cargar datos
  useEffect(() => {
    const cargarDatos = async () => {
      // Intentar obtener de quinielas cargadas
      const quinielaLocal = quinielas.find(q => q.id === quinielaId);
      if (quinielaLocal) {
        setQuiniela(quinielaLocal);
      } else {
        // Si no está, cargar desde Firestore
        const resultado = await obtenerQuinielaPorId(quinielaId);
        if (resultado.success) {
          setQuiniela(resultado.data);
        }
      }

      // Cargar participantes
      const resultadoParticipantes = await obtenerParticipantes(quinielaId);
      if (resultadoParticipantes.success) {
        setParticipantes(resultadoParticipantes.data);
      }
    };

    cargarDatos();
  }, [quinielaId, quinielas]);

  // Calcular estadísticas por partido
  const estadisticasPartidos = useMemo(() => {
    if (!quiniela || participantes.length === 0) return [];

    return quiniela.partidos.map(partido => {
      const prediccionesPartido = participantes.reduce(
        (acc, participante) => {
          const pred = participante.predicciones.find(p => p.partidoId === partido.id);
          if (pred) {
            acc[pred.prediccion] = (acc[pred.prediccion] || 0) + 1;
          }
          return acc;
        },
        { local: 0, empate: 0, visitante: 0 }
      );

      const total = participantes.length;
      return {
        partido,
        predicciones: prediccionesPartido,
        porcentajes: {
          local: total > 0 ? (prediccionesPartido.local / total) * 100 : 0,
          empate: total > 0 ? (prediccionesPartido.empate / total) * 100 : 0,
          visitante: total > 0 ? (prediccionesPartido.visitante / total) * 100 : 0
        }
      };
    });
  }, [quiniela, participantes]);

  // Formatear fecha
  const formatearFecha = (timestamp) => {
    try {
      let fecha;
      if (timestamp.toDate) {
        fecha = timestamp.toDate();
      } else if (typeof timestamp === 'string') {
        fecha = new Date(timestamp);
      } else {
        fecha = timestamp;
      }
      return format(fecha, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
    } catch (error) {
      return 'N/A';
    }
  };

  // Copiar link público
  const copiarLinkPublico = () => {
    const linkPublico = `${window.location.origin}/quiniela/${quinielaId}`;
    navigator.clipboard.writeText(linkPublico);
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 2000);
  };

  // Generar PDF reporte completo
  const generarReporteCompleto = async () => {
    setGenerandoPDF(true);
    try {
      await PDFService.generarReporteCompleto(quiniela, participantes);
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte PDF');
    } finally {
      setGenerandoPDF(false);
    }
  };

  // Generar PDF reporte detallado
  const generarReporteDetallado = async () => {
    setGenerandoPDF(true);
    try {
      await PDFService.generarReporteDetallado(quiniela, participantes);
    } catch (error) {
      console.error('Error al generar reporte detallado:', error);
      alert('Error al generar el reporte detallado PDF');
    } finally {
      setGenerandoPDF(false);
    }
  };

  if (loading || !quiniela) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/quinielas')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{quiniela.nombre}</h1>
          {quiniela.descripcion && (
            <p className="text-gray-600 mt-1">{quiniela.descripcion}</p>
          )}
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users size={24} />
            <span className="text-3xl font-bold">{participantes.length}</span>
          </div>
          <p className="text-blue-100">Total Participantes</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Target size={24} />
            <span className="text-3xl font-bold">{quiniela.partidos?.length || 0}</span>
          </div>
          <p className="text-purple-100">Total Partidos</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={24} />
            <span className="text-3xl font-bold">{quiniela.activa ? 'Activa' : 'Inactiva'}</span>
          </div>
          <p className="text-green-100">Estado</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Calendar size={24} />
            <span className="text-sm font-semibold">{formatearFecha(quiniela.fechaCreacion)}</span>
          </div>
          <p className="text-orange-100">Fecha Creación</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowQRModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <Share2 size={18} />
          Compartir con QR
        </button>

        <button
          onClick={generarReporteCompleto}
          disabled={generandoPDF || participantes.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generandoPDF ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generando...
            </>
          ) : (
            <>
              <FileText size={18} />
              Exportar PDF Resumen
            </>
          )}
        </button>

        <button
          onClick={generarReporteDetallado}
          disabled={generandoPDF || participantes.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet size={18} />
          Exportar PDF Detallado
        </button>
      </div>

      {/* Estadísticas de partidos */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-blue-600" />
          Estadísticas por Partido
        </h2>

        {participantes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay participantes aún para mostrar estadísticas
          </p>
        ) : (
          <div className="space-y-4">
            {estadisticasPartidos.map((stat, index) => (
              <div key={stat.partido.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-600 text-white font-bold text-sm px-3 py-1 rounded-full">
                    {index + 1}
                  </span>
                  <p className="font-semibold text-gray-800">
                    {stat.partido.local} vs {stat.partido.visitante}
                  </p>
                </div>

                <div className="space-y-2">
                  {/* Local */}
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-sm text-gray-600">Gana Local:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full flex items-center justify-end pr-2 text-white text-xs font-semibold transition-all duration-300"
                        style={{ width: `${stat.porcentajes.local}%` }}
                      >
                        {stat.porcentajes.local > 10 && `${Math.round(stat.porcentajes.local)}%`}
                      </div>
                    </div>
                    <span className="w-16 text-sm text-gray-700 font-semibold">
                      {stat.predicciones.local} votos
                    </span>
                  </div>

                  {/* Empate */}
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-sm text-gray-600">Empate:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-yellow-500 h-full flex items-center justify-end pr-2 text-white text-xs font-semibold transition-all duration-300"
                        style={{ width: `${stat.porcentajes.empate}%` }}
                      >
                        {stat.porcentajes.empate > 10 && `${Math.round(stat.porcentajes.empate)}%`}
                      </div>
                    </div>
                    <span className="w-16 text-sm text-gray-700 font-semibold">
                      {stat.predicciones.empate} votos
                    </span>
                  </div>

                  {/* Visitante */}
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-sm text-gray-600">Gana Visitante:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-green-500 h-full flex items-center justify-end pr-2 text-white text-xs font-semibold transition-all duration-300"
                        style={{ width: `${stat.porcentajes.visitante}%` }}
                      >
                        {stat.porcentajes.visitante > 10 && `${Math.round(stat.porcentajes.visitante)}%`}
                      </div>
                    </div>
                    <span className="w-16 text-sm text-gray-700 font-semibold">
                      {stat.predicciones.visitante} votos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabla de participantes */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="text-purple-600" />
          Participantes y Predicciones
        </h2>

        <ParticipantesTable participantes={participantes} quiniela={quiniela} />
      </div>

      {/* Modal QR Code */}
      {showQRModal && (
        <QRCodeShare
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          quinielaId={quinielaId}
          quinielaNombre={quiniela.nombre}
        />
      )}
    </div>
  );
};

export default QuinielaDetailsPage;
