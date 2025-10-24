import React, { useState } from 'react';
import { Lock } from 'lucide-react';

const PinLogin = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (pin.length !== 6) {
      setError('El PIN debe tener 6 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      const { db } = await import('../config/firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      
      const configDoc = await getDoc(doc(db, 'config', 'security'));
      
      if (configDoc.exists()) {
        const pinCorrecto = configDoc.data().pinAdmin;
        
        if (pin.toUpperCase() === pinCorrecto.toUpperCase()) {
          onSuccess();
        } else {
          setError('PIN incorrecto');
          setPin('');
        }
      } else {
        setError('Error de configuración');
      }
    } catch (e) {
      console.error('Error validando PIN:', e);
      setError('Error al validar PIN');
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setPin(value);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
            <Lock className="text-blue-600" size={32} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Administración
        </h2>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Ingresa tu código de acceso
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PIN Display */}
          <div className="flex justify-center gap-2 mb-6">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg font-bold transition-all ${
                  pin.length > index
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-300'
                }`}
              >
                {pin.length > index ? pin[index] : ''}
              </div>
            ))}
          </div>

          {/* Input */}
          <input
            type="text"
            value={pin}
            onChange={handleChange}
            placeholder="Ingresa el PIN"
            disabled={loading}
            autoFocus
            maxLength={6}
            className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed uppercase"
          />

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center animate-pulse">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || pin.length !== 6}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinLogin;