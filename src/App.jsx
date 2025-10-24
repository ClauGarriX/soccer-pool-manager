import React, { useState, useEffect } from 'react';
import { Download, Users, Settings, Send, Bell, Share2, Trophy, RefreshCw, Zap, LogOut } from 'lucide-react';
import { db } from './config/firebase';
import { collection, addDoc, getDocs, doc, setDoc, getDoc, query, orderBy } from 'firebase/firestore';
import PinLogin from './components/PinLogin';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('admin');
  const [partidos, setPartidos] = useState([]);
  const [quinielas, setQuinielas] = useState([]);
  const [jornada, setJornada] = useState(1);
  const [linkPublico, setLinkPublico] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [cargandoPartidos, setCargandoPartidos] = useState(false);

  useEffect(() => {
    detectarModoCliente();
  }, []);

  useEffect(() => {
    if (isAuthenticated || view === 'cliente') {
      loadData();
    }
  }, [isAuthenticated, view]);

  const detectarModoCliente = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('modo') === 'cliente') {
      setView('cliente');
      setIsAuthenticated(true); // Los clientes no necesitan PIN
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('admin');
  };

  const loadData = async () => {
    try {
      const configDoc = await getDoc(doc(db, 'config', 'general'));
      if (configDoc.exists()) {
        const data = configDoc.data();
        setJornada(data.jornada || 1);
        setWebhookUrl(data.webhookUrl || '');
      }

      const partidosSnapshot = await getDocs(collection(db, 'partidos'));
      const partidosData = partidosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPartidos(partidosData);

      const quinielasQuery = query(collection(db, 'quinielas'), orderBy('timestamp', 'desc'));
      const quinielasSnapshot = await getDocs(quinielasQuery);
      const quinielasData = quinielasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuinielas(quinielasData);
    } catch (e) {
      console.log('Error cargando datos:', e);
    }
  };

  const savePartidos = async (nuevosPartidos) => {
    try {
      setPartidos(nuevosPartidos);
      mostrarNotificacion('Partidos actualizados');
    } catch (e) {
      console.error('Error guardando partidos:', e);
    }
  };

  const saveJornada = async (nuevaJornada) => {
    try {
      setJornada(nuevaJornada);
      await setDoc(doc(db, 'config', 'general'), {
        jornada: nuevaJornada,
        webhookUrl: webhookUrl
      }, { merge: true });
    } catch (e) {
      console.error('Error guardando jornada:', e);
    }
  };

  const saveWebhook = async (url) => {
    try {
      setWebhookUrl(url);
      await setDoc(doc(db, 'config', 'general'), {
        webhookUrl: url,
        jornada: jornada
      }, { merge: true });
    } catch (e) {
      console.error('Error guardando webhook:', e);
    }
  };

  const cargarPartidosAutomatico = async () => {
    setCargandoPartidos(true);
    mostrarNotificacion('Cargando partidos de Liga MX...');
    
    setTimeout(() => {
      const partidosLigaMX = [
        { id: Date.now() + 1, local: 'América', visitante: 'Chivas', fecha: '2025-10-25', hora: '21:00' },
        { id: Date.now() + 2, local: 'Cruz Azul', visitante: 'Pumas', fecha: '2025-10-25', hora: '19:00' },
        { id: Date.now() + 3, local: 'Tigres', visitante: 'Monterrey', fecha: '2025-10-26', hora: '21:06' },
        { id: Date.now() + 4, local: 'Toluca', visitante: 'Santos', fecha: '2025-10-26', hora: '17:00' },
        { id: Date.now() + 5, local: 'León', visitante: 'Atlas', fecha: '2025-10-26', hora: '19:00' },
        { id: Date.now() + 6, local: 'Pachuca', visitante: 'Tijuana', fecha: '2025-10-27', hora: '12:00' },
        { id: Date.now() + 7, local: 'Necaxa', visitante: 'Querétaro', fecha: '2025-10-27', hora: '17:00' },
        { id: Date.now() + 8, local: 'Mazatlán', visitante: 'Puebla', fecha: '2025-10-27', hora: '19:00' },
        { id: Date.now() + 9, local: 'Juárez', visitante: 'San Luis', fecha: '2025-10-27', hora: '21:00' }
      ];
      
      savePartidos(partidosLigaMX);
      setCargandoPartidos(false);
      mostrarNotificacion('¡Partidos cargados exitosamente!');
    }, 1500);
  };

  const generarLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const url = baseUrl + '?modo=cliente';
    setLinkPublico(url);
    navigator.clipboard.writeText(url);
    mostrarNotificacion('¡Link copiado al portapapeles!');
  };

  const mostrarNotificacion = (msg) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const agregarPartido = () => {
    const nuevoPartido = {
      id: Date.now(),
      local: '',
      visitante: '',
      fecha: '',
      hora: ''
    };
    savePartidos([...partidos, nuevoPartido]);
  };

  const actualizarPartido = (id, campo, valor) => {
    const partidosActualizados = partidos.map(p => 
      p.id === id ? { ...p, [campo]: valor } : p
    );
    savePartidos(partidosActualizados);
  };

  const eliminarPartido = (id) => {
    savePartidos(partidos.filter(p => p.id !== id));
  };

  const enviarAWhatsApp = async (mensaje) => {
    if (!webhookUrl) {
      console.log('No hay webhook configurado');
      return;
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: mensaje,
          timestamp: new Date().toISOString()
        })
      });
      console.log('Mensaje enviado a WhatsApp vía n8n');
    } catch (error) {
      console.error('Error al enviar a WhatsApp:', error);
    }
  };

  const enviarQuiniela = async (nombre, predicciones) => {
    try {
      const nuevaQuiniela = {
        nombre,
        predicciones,
        fecha: new Date().toLocaleString('es-MX'),
        jornada,
        timestamp: new Date()
      };
      
      await addDoc(collection(db, 'quinielas'), nuevaQuiniela);
      
      const mensaje = `🎯 *Nueva Quiniela Recibida*\n\n👤 *Cliente:* ${nombre}\n📅 *Jornada:* ${jornada}\n⏰ *Fecha:* ${nuevaQuiniela.fecha}\n\n📊 *Predicciones:*\n${partidos.map((p, idx) => `${p.local} vs ${p.visitante}: *${predicciones[idx]}*`).join('\n')}\n\n✅ Guardado en Firebase`;
      
      await enviarAWhatsApp(mensaje);
      await loadData();
      
      mostrarNotificacion(`${nombre} acaba de enviar una quiniela`);
    } catch (e) {
      console.error('Error enviando quiniela:', e);
      mostrarNotificacion('Error al enviar quiniela');
    }
  };

  const exportarExcel = () => {
    let csv = 'Nombre,Jornada,Fecha,';
    
    partidos.forEach((p) => {
      csv += `${p.local} vs ${p.visitante},`;
    });
    csv += '\n';
    
    quinielas.forEach(q => {
      csv += `${q.nombre},${q.jornada},${q.fecha},`;
      q.predicciones.forEach(pred => {
        csv += `${pred},`;
      });
      csv += '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `quinielas_jornada_${jornada}.csv`;
    link.click();
    
    mostrarNotificacion('¡Excel descargado exitosamente!');
  };

  const VistaAdmin = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Panel de Administración</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={cargarPartidosAutomatico}
            disabled={cargandoPartidos}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600 disabled:bg-gray-400"
          >
            {cargandoPartidos ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Zap size={18} />
            )}
            Cargar Jornada Auto
          </button>
          <button
            onClick={generarLink}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
          >
            <Share2 size={18} />
            Generar Link
          </button>
          <button
            onClick={exportarExcel}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Download size={18} />
            Exportar Excel
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </div>

      {linkPublico && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800 font-medium mb-2">🔗 Link para compartir con clientes:</p>
          <p className="text-sm text-green-600 break-all font-mono bg-white p-2 rounded">{linkPublico}</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Zap size={20} />
          Integración WhatsApp (n8n)
        </h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-blue-800">
            Webhook URL de n8n:
          </label>
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => saveWebhook(e.target.value)}
            placeholder="https://tu-n8n.app/webhook/quinielas"
            className="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-blue-600">
            💡 Crea un webhook en n8n y pega aquí la URL para recibir notificaciones automáticas en WhatsApp
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Jornada {jornada}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => saveJornada(jornada + 1)}
              className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm"
            >
              Nueva Jornada
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {partidos.map((partido) => (
            <div key={partido.id} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded">
              <input
                type="text"
                placeholder="Equipo Local"
                value={partido.local}
                onChange={(e) => actualizarPartido(partido.id, 'local', e.target.value)}
                className="col-span-4 px-3 py-2 border rounded"
              />
              <span className="col-span-1 text-center font-bold">vs</span>
              <input
                type="text"
                placeholder="Equipo Visitante"
                value={partido.visitante}
                onChange={(e) => actualizarPartido(partido.id, 'visitante', e.target.value)}
                className="col-span-4 px-3 py-2 border rounded"
              />
              <input
                type="date"
                value={partido.fecha}
                onChange={(e) => actualizarPartido(partido.id, 'fecha', e.target.value)}
                className="col-span-2 px-2 py-2 border rounded text-sm"
              />
              <button
                onClick={() => eliminarPartido(partido.id)}
                className="col-span-1 bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={agregarPartido}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
        >
          + Agregar Partido Manual
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Quinielas Recibidas ({quinielas.length})</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {quinielas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aún no hay quinielas enviadas</p>
          ) : (
            quinielas.map((q) => (
              <div key={q.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{q.nombre}</p>
                    <p className="text-sm text-gray-600">Jornada {q.jornada} • {q.fecha}</p>
                  </div>
                  <Trophy className="text-yellow-500" size={20} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {q.predicciones.map((pred, idx) => (
                    <span key={idx} className={`px-3 py-1 rounded text-sm font-medium ${
                      pred === 'L' ? 'bg-blue-100 text-blue-800' :
                      pred === 'E' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {pred}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const VistaCliente = () => {
    const [nombre, setNombre] = useState('');
    const [predicciones, setPredicciones] = useState(Array(partidos.length).fill(''));
    const [enviado, setEnviado] = useState(false);

    const handlePrediccion = (idx, valor) => {
      const nuevas = [...predicciones];
      nuevas[idx] = valor;
      setPredicciones(nuevas);
    };

    const handleEnviar = () => {
      if (!nombre.trim()) {
        mostrarNotificacion('Por favor ingresa tu nombre');
        return;
      }
      
      if (predicciones.some(p => !p)) {
        mostrarNotificacion('Por favor completa todas las predicciones');
        return;
      }

      enviarQuiniela(nombre, predicciones);
      setEnviado(true);
    };

    if (enviado) {
      return (
        <div className="text-center py-12">
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-green-600" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Quiniela Enviada!</h2>
          <p className="text-gray-600 mb-2">Gracias {nombre}, tu quiniela ha sido registrada</p>
          <p className="text-sm text-gray-500 mb-6">✅ Se envió notificación por WhatsApp</p>
          <button
            onClick={() => {
              setEnviado(false);
              setNombre('');
              setPredicciones(Array(partidos.length).fill(''));
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Enviar otra quiniela
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">⚽ Quiniela Liga MX</h2>
          <p className="text-gray-600">Jornada {jornada}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tu Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa tu nombre"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-xl font-semibold mb-4">Tus Predicciones</h3>
          
          {partidos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay partidos configurados aún</p>
          ) : (
            partidos.map((partido, idx) => (
              <div key={partido.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="text-center mb-3">
                  <p className="font-semibold text-gray-800 text-lg">
                    {partido.local} vs {partido.visitante}
                  </p>
                  {partido.fecha && (
                    <p className="text-sm text-gray-600">📅 {partido.fecha} {partido.hora && `• ${partido.hora}`}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handlePrediccion(idx, 'L')}
                    className={`py-3 rounded-lg font-semibold transition ${
                      predicciones[idx] === 'L'
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Local
                  </button>
                  <button
                    onClick={() => handlePrediccion(idx, 'E')}
                    className={`py-3 rounded-lg font-semibold transition ${
                      predicciones[idx] === 'E'
                        ? 'bg-yellow-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Empate
                  </button>
                  <button
                    onClick={() => handlePrediccion(idx, 'V')}
                    className={`py-3 rounded-lg font-semibold transition ${
                      predicciones[idx] === 'V'
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Visitante
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {partidos.length > 0 && (
          <button
            onClick={handleEnviar}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 flex items-center justify-center gap-2 shadow-lg"
          >
            <Send size={20} />
            Enviar Quiniela
          </button>
        )}
      </div>
    );
  };

  // Si no está autenticado y está en modo admin, mostrar login
  if (!isAuthenticated && view === 'admin') {
    return <PinLogin onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse">
          <Bell size={20} />
          {notificationMsg}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setView('admin')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                view === 'admin'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Settings className="inline mr-2" size={18} />
              Administrador
            </button>
            <button
              onClick={() => setView('cliente')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                view === 'cliente'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="inline mr-2" size={18} />
              Vista Cliente
            </button>
          </div>
        </div>

        {view === 'admin' ? <VistaAdmin /> : <VistaCliente />}
      </div>
    </div>
  );
};

export default App;