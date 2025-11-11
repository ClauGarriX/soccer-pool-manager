import { useState } from 'react';
import apiFootballService from '../services/apiFootball';

const useLigaMX = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quinielaGenerada, setQuinielaGenerada] = useState(null);

  /**
   * Generar quiniela automática de Liga MX
   */
  const generarQuinielaLigaMX = async () => {
    setLoading(true);
    setError(null);
    setQuinielaGenerada(null);

    try {
      const resultado = await apiFootballService.generarQuinielaAutomatica();

      if (resultado.success) {
        setQuinielaGenerada(resultado.quiniela);
        return {
          success: true,
          quiniela: resultado.quiniela,
          fuente: resultado.fuente
        };
      } else {
        setError(resultado.error || 'Error al generar quiniela');
        return {
          success: false,
          error: resultado.error
        };
      }
    } catch (err) {
      const mensajeError = err.message || 'Error desconocido al generar quiniela';
      setError(mensajeError);
      return {
        success: false,
        error: mensajeError
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener próximos partidos (sin crear quiniela)
   */
  const obtenerProximosPartidos = async (cantidad = 10) => {
    setLoading(true);
    setError(null);

    try {
      const resultado = await apiFootballService.obtenerProximosPartidos(cantidad);

      if (resultado.success) {
        return {
          success: true,
          partidos: resultado.partidos,
          jornada: resultado.jornada,
          torneo: resultado.torneo,
          fuente: resultado.fuente
        };
      } else {
        setError('Error al obtener partidos');
        return {
          success: false,
          error: 'Error al obtener partidos'
        };
      }
    } catch (err) {
      const mensajeError = err.message || 'Error desconocido';
      setError(mensajeError);
      return {
        success: false,
        error: mensajeError
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpiar quiniela generada
   */
  const limpiarQuinielaGenerada = () => {
    setQuinielaGenerada(null);
    setError(null);
  };

  /**
   * Obtener lista de equipos Liga MX
   */
  const obtenerEquiposLigaMX = () => {
    return apiFootballService.getEquiposLigaMX();
  };

  /**
   * Obtener torneo y jornada actual
   */
  const obtenerInfoActual = () => {
    return {
      torneo: apiFootballService.getTorneoActual(),
      jornada: apiFootballService.calcularJornadaActual()
    };
  };

  return {
    loading,
    error,
    quinielaGenerada,
    generarQuinielaLigaMX,
    obtenerProximosPartidos,
    limpiarQuinielaGenerada,
    obtenerEquiposLigaMX,
    obtenerInfoActual
  };
};

export default useLigaMX;
