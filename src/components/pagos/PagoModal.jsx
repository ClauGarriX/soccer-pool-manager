import React, { useState, useEffect } from 'react';
import { X, DollarSign, User, Calendar, CreditCard, FileText } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const PagoModal = ({ isOpen, onClose, onSave, pagoInicial, quinielas }) => {
  const [usuario, setUsuario] = useState('');
  const [quinielaId, setQuinielaId] = useState('');
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [fechaPago, setFechaPago] = useState('');
  const [estado, setEstado] = useState('pagado');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (pagoInicial) {
      setUsuario(pagoInicial.usuario || '');
      setQuinielaId(pagoInicial.quinielaId || '');
      setMonto(pagoInicial.monto || '');
      setMetodoPago(pagoInicial.metodoPago || 'efectivo');

      // Convertir timestamp a string de fecha
      if (pagoInicial.fechaPago) {
        const fecha = pagoInicial.fechaPago.toDate ? pagoInicial.fechaPago.toDate() : new Date(pagoInicial.fechaPago);
        setFechaPago(fecha.toISOString().split('T')[0]);
      } else {
        setFechaPago(new Date().toISOString().split('T')[0]);
      }

      setEstado(pagoInicial.estado || 'pagado');
      setNotas(pagoInicial.notas || '');
    } else {
      resetForm();
    }
  }, [pagoInicial, isOpen]);

  const resetForm = () => {
    setUsuario('');
    setQuinielaId('');
    setMonto('');
    setMetodoPago('efectivo');
    setFechaPago(new Date().toISOString().split('T')[0]);
    setEstado('pagado');
    setNotas('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!usuario.trim()) {
      alert('El nombre del usuario es requerido');
      return;
    }

    if (!quinielaId) {
      alert('Debes seleccionar una quiniela');
      return;
    }

    if (!monto || parseFloat(monto) <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    if (!fechaPago) {
      alert('La fecha de pago es requerida');
      return;
    }

    // Convertir fecha string a Timestamp
    const fechaTimestamp = Timestamp.fromDate(new Date(fechaPago));

    onSave({
      usuario: usuario.trim(),
      quinielaId,
      monto: parseFloat(monto),
      metodoPago,
      fechaPago: fechaTimestamp,
      estado,
      notas: notas.trim()
    });

    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {pagoInicial ? 'Editar Pago' : 'Registrar Pago'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Usuario */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User size={16} className="inline mr-2" />
              Nombre del Usuario
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Nombre del participante"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
            />
          </div>

          {/* Quiniela */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quiniela
            </label>
            <select
              value={quinielaId}
              onChange={(e) => setQuinielaId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
            >
              <option value="">Seleccionar quiniela...</option>
              {quinielas?.map((quiniela) => (
                <option key={quiniela.id} value={quiniela.id}>
                  {quiniela.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Monto y Método de Pago */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <DollarSign size={16} className="inline mr-2" />
                Monto
              </label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <CreditCard size={16} className="inline mr-2" />
                Método de Pago
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              >
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </div>
          </div>

          {/* Fecha y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Fecha de Pago
              </label>
              <input
                type="date"
                value={fechaPago}
                onChange={(e) => setFechaPago(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              >
                <option value="pagado">Pagado</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Notas (opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Observaciones adicionales..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            {pagoInicial ? 'Actualizar' : 'Registrar'} Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default PagoModal;
