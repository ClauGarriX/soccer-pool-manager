import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const useQuinielas = () => {
  const [quinielas, setQuinielas] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar quinielas activas
  const cargarQuinielas = async () => {
    try {
      setLoading(true);
      const quinielasRef = collection(db, 'quinielas_activas');
      const q = query(quinielasRef, orderBy('fechaCreacion', 'desc'));
      const snapshot = await getDocs(q);

      const quinielasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setQuinielas(quinielasData);
    } catch (error) {
      console.error('Error al cargar quinielas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar respuestas
  const cargarRespuestas = async () => {
    try {
      const respuestasRef = collection(db, 'quinielas');
      const snapshot = await getDocs(respuestasRef);

      const respuestasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setRespuestas(respuestasData);
    } catch (error) {
      console.error('Error al cargar respuestas:', error);
    }
  };

  // Crear quiniela
  const crearQuiniela = async (quinielaData) => {
    try {
      // Convertir fechaLimite a Timestamp si existe y es un Date
      const dataToSave = { ...quinielaData };
      if (dataToSave.fechaLimite && dataToSave.fechaLimite instanceof Date) {
        dataToSave.fechaLimite = Timestamp.fromDate(dataToSave.fechaLimite);
      }

      const docRef = await addDoc(collection(db, 'quinielas_activas'), {
        ...dataToSave,
        fechaCreacion: Timestamp.now(),
        respuestas: 0,
        activa: true
      });

      await cargarQuinielas();
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error al crear quiniela:', error);
      return { success: false, error: error.message };
    }
  };

  // Actualizar quiniela
  const actualizarQuiniela = async (id, quinielaData) => {
    try {
      const quinielaRef = doc(db, 'quinielas_activas', id);
      await updateDoc(quinielaRef, quinielaData);
      await cargarQuinielas();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar quiniela:', error);
      return { success: false, error: error.message };
    }
  };

  // Eliminar quiniela
  const eliminarQuiniela = async (id) => {
    try {
      await deleteDoc(doc(db, 'quinielas_activas', id));
      await cargarQuinielas();
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar quiniela:', error);
      return { success: false, error: error.message };
    }
  };

  // Toggle estado activo/inactivo
  const toggleActivaQuiniela = async (id, activa) => {
    try {
      const quinielaRef = doc(db, 'quinielas_activas', id);
      await updateDoc(quinielaRef, { activa });
      await cargarQuinielas();
      return { success: true };
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      return { success: false, error: error.message };
    }
  };

  // Obtener quiniela por ID
  const obtenerQuiniela = (id) => {
    return quinielas.find(q => q.id === id);
  };

  // Obtener quinielas activas
  const quinielasActivas = quinielas.filter(q => q.activa);

  // Obtener quinielas inactivas
  const quinielasInactivas = quinielas.filter(q => !q.activa);

  useEffect(() => {
    cargarQuinielas();
    cargarRespuestas();
  }, []);

  return {
    quinielas,
    quinielasActivas,
    quinielasInactivas,
    respuestas,
    loading,
    crearQuiniela,
    actualizarQuiniela,
    eliminarQuiniela,
    toggleActivaQuiniela,
    obtenerQuiniela,
    cargarQuinielas,
    cargarRespuestas
  };
};

export default useQuinielas;
