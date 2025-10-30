import React, { useState, useEffect } from 'react';
import { Lock, Save, Info } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const ConfiguracionPage = () => {
  const [pinActual, setPinActual] = useState('');
  const [pinNuevo, setPinNuevo] = useState('');
  const [pinConfirmar, setPinConfirmar] = useState('');
  const [jornada, setJornada] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);

      // Cargar jornada actual
      const generalDoc = await getDoc(doc(db, 'config', 'general'));
      if (generalDoc.exists()) {
        setJornada(generalDoc.data().jornadaActual || '');
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      alert('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarPIN = async (e) => {
    e.preventDefault();

    if (!pinActual || !pinNuevo || !pinConfirmar) {
      alert('Todos los campos son requeridos');
      return;
    }

    if (pinNuevo.length !== 6) {
      alert('El nuevo PIN debe tener 6 caracteres');
      return;
    }

    if (pinNuevo !== pinConfirmar) {
      alert('Los PINs nuevos no coinciden');
      return;
    }

    try {
      setSaving(true);

      // Verificar PIN actual
      const securityDoc = await getDoc(doc(db, 'config', 'security'));
      if (securityDoc.exists()) {
        const pinGuardado = securityDoc.data().pinAdmin;

        if (pinActual.toUpperCase() !== pinGuardado.toUpperCase()) {
          alert('El PIN actual es incorrecto');
          return;
        }

        // Actualizar PIN
        await updateDoc(doc(db, 'config', 'security'), {
          pinAdmin: pinNuevo.toUpperCase()
        });

        alert('PIN actualizado correctamente');
        setPinActual('');
        setPinNuevo('');
        setPinConfirmar('');
      } else {
        alert('Error: No se encontró la configuración de seguridad');
      }
    } catch (error) {
      console.error('Error al cambiar PIN:', error);
      alert('Error al cambiar el PIN');
    } finally {
      setSaving(false);
    }
  };

  const handleGuardarJornada = async (e) => {
    e.preventDefault();

    if (!jornada) {
      alert('La jornada es requerida');
      return;
    }

    try {
      setSaving(true);

      // Verificar si el documento existe
      const generalDoc = await getDoc(doc(db, 'config', 'general'));

      if (generalDoc.exists()) {
        // Actualizar
        await updateDoc(doc(db, 'config', 'general'), {
          jornadaActual: parseInt(jornada)
        });
      } else {
        // Crear documento si no existe
        await updateDoc(doc(db, 'config', 'general'), {
          jornadaActual: parseInt(jornada)
        });
      }

      alert('Jornada actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar jornada:', error);
      alert('Error al guardar la jornada');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Configuración</h2>
        <p className="text-gray-600 mt-1">Administra la configuración de la aplicación</p>
      </div>

      {/* Cambiar PIN */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Lock className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Cambiar PIN de Acceso</h3>
            <p className="text-sm text-gray-600">Actualiza tu código de seguridad</p>
          </div>
        </div>

        <form onSubmit={handleCambiarPIN} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PIN Actual
            </label>
            <input
              type="text"
              value={pinActual}
              onChange={(e) => setPinActual(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="Ingresa tu PIN actual"
              maxLength={6}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-mono tracking-widest uppercase"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nuevo PIN
              </label>
              <input
                type="text"
                value={pinNuevo}
                onChange={(e) => setPinNuevo(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="Nuevo PIN (6 caracteres)"
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-mono tracking-widest uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Nuevo PIN
              </label>
              <input
                type="text"
                value={pinConfirmar}
                onChange={(e) => setPinConfirmar(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="Confirma el nuevo PIN"
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-mono tracking-widest uppercase"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {saving ? 'Guardando...' : 'Cambiar PIN'}
          </button>
        </form>
      </div>

      {/* Jornada Actual */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Info className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Jornada Actual</h3>
            <p className="text-sm text-gray-600">Define la jornada de Liga MX</p>
          </div>
        </div>

        <form onSubmit={handleGuardarJornada} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Número de Jornada
            </label>
            <input
              type="number"
              value={jornada}
              onChange={(e) => setJornada(e.target.value)}
              placeholder="Ej: 15"
              min="1"
              max="20"
              className="w-full md:w-1/2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar Jornada'}
          </button>
        </form>
      </div>

      {/* Información de la App */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Información de la Aplicación</h3>
        <div className="space-y-2 text-blue-50">
          <p><span className="font-semibold">Nombre:</span> Sistema de Quinielas Liga MX</p>
          <p><span className="font-semibold">Versión:</span> 2.0.0</p>
          <p><span className="font-semibold">Desarrollado con:</span> React + Firebase</p>
          <p className="text-sm mt-4 opacity-80">
            Sistema completo de gestión de quinielas con administración de pagos y estadísticas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionPage;
