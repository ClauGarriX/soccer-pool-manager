import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const usePagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar pagos
  const cargarPagos = async () => {
    try {
      setLoading(true);
      const pagosRef = collection(db, 'pagos');
      const q = query(pagosRef, orderBy('fechaPago', 'desc'));
      const snapshot = await getDocs(q);

      const pagosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPagos(pagosData);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Registrar pago
  const registrarPago = async (pagoData) => {
    try {
      const docRef = await addDoc(collection(db, 'pagos'), {
        ...pagoData,
        fechaPago: pagoData.fechaPago || Timestamp.now()
      });

      await cargarPagos();
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error al registrar pago:', error);
      return { success: false, error: error.message };
    }
  };

  // Actualizar pago
  const actualizarPago = async (id, pagoData) => {
    try {
      const pagoRef = doc(db, 'pagos', id);
      await updateDoc(pagoRef, pagoData);
      await cargarPagos();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar pago:', error);
      return { success: false, error: error.message };
    }
  };

  // Eliminar pago
  const eliminarPago = async (id) => {
    try {
      await deleteDoc(doc(db, 'pagos', id));
      await cargarPagos();
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar pago:', error);
      return { success: false, error: error.message };
    }
  };

  // Obtener pago por ID
  const obtenerPago = (id) => {
    return pagos.find(p => p.id === id);
  };

  // Filtrar pagos por estado
  const pagosPagados = pagos.filter(p => p.estado === 'pagado');
  const pagosPendientes = pagos.filter(p => p.estado === 'pendiente');

  // Calcular total recaudado
  const totalRecaudado = pagos
    .filter(p => p.estado === 'pagado')
    .reduce((acc, p) => acc + (p.monto || 0), 0);

  useEffect(() => {
    cargarPagos();
  }, []);

  return {
    pagos,
    pagosPagados,
    pagosPendientes,
    totalRecaudado,
    loading,
    registrarPago,
    actualizarPago,
    eliminarPago,
    obtenerPago,
    cargarPagos
  };
};

export default usePagos;
