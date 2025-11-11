import { useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

const useParticipantes = () => {
  const [loading, setLoading] = useState(false);
  const [quiniela, setQuiniela] = useState(null);
  const [participantes, setParticipantes] = useState([]);

  // Obtener quiniela por ID (para formulario público)
  const obtenerQuinielaPorId = useCallback(async (quinielaId) => {
    try {
      setLoading(true);
      const quinielaRef = doc(db, 'quinielas_activas', quinielaId);
      const quinielaSnap = await getDoc(quinielaRef);

      if (!quinielaSnap.exists()) {
        return { success: false, error: 'Quiniela no encontrada' };
      }

      const quinielaData = {
        id: quinielaSnap.id,
        ...quinielaSnap.data()
      };

      setQuiniela(quinielaData);
      return { success: true, data: quinielaData };
    } catch (error) {
      console.error('Error al obtener quiniela:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Generar folio único
  const generarFolio = useCallback(() => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `QUI-${timestamp}-${random}`;
  }, []);

  // Enviar respuesta de participante
  const enviarRespuesta = useCallback(async (quinielaId, datosParticipante, predicciones) => {
    try {
      setLoading(true);

      // Generar folio único
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const folio = `QUI-${timestamp}-${random}`;

      // Crear documento de respuesta
      const respuestaData = {
        quinielaId,
        folio,
        participante: {
          nombre: datosParticipante.nombre,
          email: datosParticipante.email || '',
          telefono: datosParticipante.telefono || ''
        },
        predicciones,
        timestamp: Timestamp.now()
      };

      // Guardar en Firestore
      const docRef = await addDoc(collection(db, 'respuestas_quinielas'), respuestaData);

      // Incrementar contador de respuestas en la quiniela
      const quinielaRef = doc(db, 'quinielas_activas', quinielaId);
      await updateDoc(quinielaRef, {
        respuestas: increment(1)
      });

      return {
        success: true,
        id: docRef.id,
        folio,
        data: respuestaData
      };
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener participantes de una quiniela específica
  const obtenerParticipantes = useCallback(async (quinielaId) => {
    try {
      setLoading(true);
      const respuestasRef = collection(db, 'respuestas_quinielas');
      const q = query(
        respuestasRef,
        where('quinielaId', '==', quinielaId),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);
      const participantesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setParticipantes(participantesData);
      return { success: true, data: participantesData };
    } catch (error) {
      console.error('Error al obtener participantes:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener todas las respuestas de todas las quinielas
  const obtenerTodasRespuestas = useCallback(async () => {
    try {
      setLoading(true);
      const respuestasRef = collection(db, 'respuestas_quinielas');
      const q = query(respuestasRef, orderBy('timestamp', 'desc'));

      const snapshot = await getDocs(q);
      const respuestasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { success: true, data: respuestasData };
    } catch (error) {
      console.error('Error al obtener todas las respuestas:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Validar si la quiniela aún acepta participaciones
  const validarFechaLimite = useCallback((quiniela) => {
    if (!quiniela.fechaLimite) return true; // Si no hay fecha límite, siempre acepta

    const fechaLimite = quiniela.fechaLimite.toDate();
    const ahora = new Date();

    return ahora < fechaLimite;
  }, []);

  // Calcular tiempo restante para participar
  const calcularTiempoRestante = useCallback((quiniela) => {
    if (!quiniela.fechaLimite) return null;

    const fechaLimite = quiniela.fechaLimite.toDate();
    const ahora = new Date();
    const diferencia = fechaLimite - ahora;

    if (diferencia <= 0) return { dias: 0, horas: 0, minutos: 0 };

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

    return { dias, horas, minutos };
  }, []);

  return {
    loading,
    quiniela,
    participantes,
    obtenerQuinielaPorId,
    enviarRespuesta,
    obtenerParticipantes,
    obtenerTodasRespuestas,
    validarFechaLimite,
    calcularTiempoRestante,
    generarFolio
  };
};

export default useParticipantes;
