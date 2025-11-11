import axios from 'axios';

/**
 * Servicio para obtener datos de partidos de fútbol
 * Incluye integración con API-Football y datos mockeados como fallback
 */

class APIFootballService {
  constructor() {
    // Configuración de la API
    this.apiKey = import.meta.env.VITE_FOOTBALL_API_KEY || null;
    this.baseURL = 'https://v3.football.api-sports.io';
    this.ligaMXId = 262; // ID de Liga MX en API-Football
    this.currentSeason = new Date().getFullYear();
  }

  /**
   * Obtener próximos partidos de Liga MX desde API real
   */
  async obtenerProximosPartidosAPI(cantidad = 10) {
    if (!this.apiKey) {
      console.warn('API Key no configurada, usando datos mockeados');
      return null;
    }

    try {
      const response = await axios.get(`${this.baseURL}/fixtures`, {
        headers: {
          'x-apisports-key': this.apiKey
        },
        params: {
          league: this.ligaMXId,
          season: this.currentSeason,
          next: cantidad
        }
      });

      if (response.data && response.data.response) {
        return this.formatearPartidosAPI(response.data.response);
      }

      return null;
    } catch (error) {
      console.error('Error al obtener partidos de la API:', error);
      return null;
    }
  }

  /**
   * Formatear partidos desde la API
   */
  formatearPartidosAPI(partidos) {
    return partidos.map(partido => ({
      id: partido.fixture.id.toString(),
      local: partido.teams.home.name,
      visitante: partido.teams.away.name,
      fecha: new Date(partido.fixture.date).toISOString().split('T')[0],
      hora: new Date(partido.fixture.date).toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      logoLocal: partido.teams.home.logo,
      logoVisitante: partido.teams.away.logo,
      estadio: partido.fixture.venue.name,
      jornada: partido.league.round
    }));
  }

  /**
   * Datos mockeados de equipos Liga MX
   */
  getEquiposLigaMX() {
    return [
      'América', 'Chivas', 'Cruz Azul', 'Pumas UNAM',
      'Tigres UANL', 'Monterrey', 'Santos Laguna', 'León',
      'Toluca', 'Atlas', 'Pachuca', 'Necaxa',
      'Puebla', 'Querétaro', 'San Luis', 'Tijuana',
      'Mazatlán', 'Juárez'
    ];
  }

  /**
   * Generar partidos aleatorios de Liga MX (fallback cuando no hay API)
   */
  generarPartidosMockeados(cantidad = 10, jornadaNumero = null) {
    const equipos = this.getEquiposLigaMX();
    const partidos = [];
    const equiposUsados = new Set();

    // Generar fecha base (próximo sábado)
    const fechaBase = new Date();
    const diasHastaSabado = (6 - fechaBase.getDay() + 7) % 7 || 7;
    fechaBase.setDate(fechaBase.getDate() + diasHastaSabado);

    // Horas típicas de partidos
    const horasPartidos = ['19:00', '19:05', '19:06', '21:00', '21:05', '21:06'];

    let partidosCreados = 0;
    let intentos = 0;
    const maxIntentos = 100;

    while (partidosCreados < cantidad && intentos < maxIntentos) {
      intentos++;

      // Seleccionar equipos aleatorios
      const equiposDisponibles = equipos.filter(e => !equiposUsados.has(e));
      if (equiposDisponibles.length < 2) {
        equiposUsados.clear(); // Resetear si no hay suficientes equipos
        continue;
      }

      const indexLocal = Math.floor(Math.random() * equiposDisponibles.length);
      const equipoLocal = equiposDisponibles[indexLocal];

      const equiposRestantes = equiposDisponibles.filter(e => e !== equipoLocal);
      const indexVisitante = Math.floor(Math.random() * equiposRestantes.length);
      const equipoVisitante = equiposRestantes[indexVisitante];

      // Marcar equipos como usados
      equiposUsados.add(equipoLocal);
      equiposUsados.add(equipoVisitante);

      // Determinar fecha (distribuir entre sábado y domingo)
      const fecha = new Date(fechaBase);
      if (partidosCreados % 2 === 1) {
        fecha.setDate(fecha.getDate() + 1); // Algunos el domingo
      }

      // Formatear fecha
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      const fechaFormateada = `${year}-${month}-${day}`;

      // Hora aleatoria
      const hora = horasPartidos[Math.floor(Math.random() * horasPartidos.length)];

      partidos.push({
        id: `mock-${Date.now()}-${partidosCreados}`,
        local: equipoLocal,
        visitante: equipoVisitante,
        fecha: fechaFormateada,
        hora: hora,
        logoLocal: null,
        logoVisitante: null,
        estadio: `Estadio ${equipoLocal}`,
        jornada: jornadaNumero || this.calcularJornadaActual()
      });

      partidosCreados++;
    }

    return partidos;
  }

  /**
   * Calcular jornada actual aproximada
   */
  calcularJornadaActual() {
    const mes = new Date().getMonth() + 1;

    // Estimación basada en el mes (Apertura: Jul-Dic, Clausura: Ene-Jun)
    if (mes >= 7) {
      // Apertura
      const semanaDelMes = Math.floor((new Date().getDate()) / 7);
      return Math.min(17, Math.max(1, (mes - 7) * 4 + semanaDelMes + 1));
    } else {
      // Clausura
      const semanaDelMes = Math.floor((new Date().getDate()) / 7);
      return Math.min(17, Math.max(1, mes * 3 + semanaDelMes));
    }
  }

  /**
   * Obtener torneo actual
   */
  getTorneoActual() {
    const mes = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    if (mes >= 7) {
      return `Apertura ${year}`;
    } else {
      return `Clausura ${year}`;
    }
  }

  /**
   * Método principal para obtener próximos partidos
   * Intenta usar API real primero, luego fallback a mockeados
   */
  async obtenerProximosPartidos(cantidad = 10) {
    // Intentar con API real si está configurada
    const partidosAPI = await this.obtenerProximosPartidosAPI(cantidad);

    if (partidosAPI && partidosAPI.length > 0) {
      return {
        success: true,
        fuente: 'api',
        torneo: this.getTorneoActual(),
        jornada: partidosAPI[0]?.jornada || `Jornada ${this.calcularJornadaActual()}`,
        partidos: partidosAPI
      };
    }

    // Fallback a datos mockeados
    const jornadaActual = this.calcularJornadaActual();
    const partidosMock = this.generarPartidosMockeados(cantidad, jornadaActual);

    return {
      success: true,
      fuente: 'mock',
      torneo: this.getTorneoActual(),
      jornada: `Jornada ${jornadaActual}`,
      partidos: partidosMock
    };
  }

  /**
   * Generar quiniela automática
   */
  async generarQuinielaAutomatica() {
    const datos = await this.obtenerProximosPartidos(10);

    if (!datos.success) {
      return {
        success: false,
        error: 'No se pudieron obtener partidos'
      };
    }

    // Calcular fecha límite (1 hora antes del primer partido)
    const primerPartido = datos.partidos[0];
    const fechaLimite = new Date(`${primerPartido.fecha}T${primerPartido.hora}`);
    fechaLimite.setHours(fechaLimite.getHours() - 1);

    return {
      success: true,
      fuente: datos.fuente,
      quiniela: {
        nombre: `Quiniela ${datos.jornada} - Liga MX`,
        descripcion: `${datos.torneo} - Partidos del ${new Date(primerPartido.fecha).toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'long'
        })}`,
        fechaLimite: fechaLimite,
        partidos: datos.partidos,
        activa: true,
        permitirEdicion: false,
        mostrarResultados: false
      }
    };
  }
}

// Exportar instancia singleton
const apiFootballService = new APIFootballService();
export default apiFootballService;
