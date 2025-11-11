import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

class PDFService {
  // Colores corporativos
  static colors = {
    primary: [37, 99, 235], // Azul
    secondary: [147, 51, 234], // Púrpura
    success: [34, 197, 94], // Verde
    text: [31, 41, 55], // Gris oscuro
    textLight: [107, 114, 128], // Gris claro
  };

  // Generar QR code como data URL
  static async generarQRCode(texto) {
    try {
      const qrDataURL = await QRCode.toDataURL(texto, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1F2937',
          light: '#FFFFFF'
        }
      });
      return qrDataURL;
    } catch (error) {
      console.error('Error al generar QR code:', error);
      return null;
    }
  }

  // Formatear fecha
  static formatearFecha(timestamp) {
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
      return 'Fecha no disponible';
    }
  }

  // Agregar header al PDF
  static agregarHeader(doc, titulo) {
    // Fondo del header
    doc.setFillColor(...this.colors.primary);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');

    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, doc.internal.pageSize.width / 2, 20, { align: 'center' });

    // Subtítulo
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Quinielas - Liga MX', doc.internal.pageSize.width / 2, 30, { align: 'center' });

    // Resetear color de texto
    doc.setTextColor(...this.colors.text);
  }

  // Agregar footer al PDF
  static agregarFooter(doc, numeroPagina = null) {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

    // Texto del footer
    doc.setFontSize(8);
    doc.setTextColor(...this.colors.textLight);
    doc.setFont('helvetica', 'normal');

    const textoFooter = 'Conserva este comprobante para verificar tus predicciones';
    doc.text(textoFooter, pageWidth / 2, pageHeight - 12, { align: 'center' });

    // Número de página si se proporciona
    if (numeroPagina) {
      doc.text(`Página ${numeroPagina}`, pageWidth - 30, pageHeight - 12, { align: 'right' });
    }

    // Resetear color
    doc.setTextColor(...this.colors.text);
  }

  // Obtener texto de predicción
  static getPrediccionTexto(prediccion) {
    switch (prediccion) {
      case 'local':
        return 'Gana Local';
      case 'empate':
        return 'Empate';
      case 'visitante':
        return 'Gana Visitante';
      default:
        return prediccion;
    }
  }

  // Generar comprobante individual para participante
  static async generarComprobanteIndividual(respuesta, quiniela) {
    const doc = new jsPDF();

    // Header
    this.agregarHeader(doc, 'COMPROBANTE DE QUINIELA');

    let yPos = 50;

    // Información de la quiniela
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.colors.primary);
    doc.text('Quiniela:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...this.colors.text);
    doc.text(quiniela.nombre, 50, yPos);

    yPos += 10;

    // Folio
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.colors.primary);
    doc.text('Folio:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...this.colors.text);
    doc.text(respuesta.folio, 50, yPos);

    yPos += 10;

    // Fecha de registro
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.colors.primary);
    doc.text('Fecha:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...this.colors.text);
    doc.text(this.formatearFecha(respuesta.data.timestamp), 50, yPos);

    yPos += 10;

    // Participante
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.colors.primary);
    doc.text('Participante:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...this.colors.text);
    doc.text(respuesta.data.participante.nombre, 50, yPos);

    yPos += 15;

    // Línea separadora
    doc.setDrawColor(...this.colors.primary);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);

    yPos += 10;

    // Título de predicciones
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.colors.primary);
    doc.text('TUS PREDICCIONES:', 20, yPos);

    yPos += 10;

    // Tabla de predicciones
    const prediccionesData = respuesta.data.predicciones.map((pred, index) => [
      (index + 1).toString(),
      `${pred.equipoLocal} vs ${pred.equipoVisitante}`,
      this.getPrediccionTexto(pred.prediccion)
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Partido', 'Tu Predicción']],
      body: prediccionesData,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9,
        textColor: this.colors.text
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 110 },
        2: { cellWidth: 50, halign: 'center', fontStyle: 'bold' }
      },
      margin: { left: 20, right: 20 }
    });

    // Generar QR code
    const qrCode = await this.generarQRCode(respuesta.folio);

    if (qrCode) {
      const finalY = doc.lastAutoTable.finalY + 15;

      // Centrar el QR code
      const qrSize = 40;
      const qrX = (doc.internal.pageSize.width - qrSize) / 2;

      doc.addImage(qrCode, 'PNG', qrX, finalY, qrSize, qrSize);

      // Texto debajo del QR
      doc.setFontSize(8);
      doc.setTextColor(...this.colors.textLight);
      doc.text('Escanea este código para verificar tu folio', doc.internal.pageSize.width / 2, finalY + qrSize + 5, { align: 'center' });
    }

    // Footer
    this.agregarFooter(doc);

    // Descargar
    doc.save(`Comprobante_${respuesta.folio}.pdf`);

    return doc;
  }

  // Generar reporte completo para admin (todas las participaciones)
  static async generarReporteCompleto(quiniela, participantes) {
    const doc = new jsPDF();
    let numeroPagina = 1;

    // Portada
    this.agregarHeader(doc, 'REPORTE COMPLETO DE QUINIELA');

    let yPos = 60;

    // Información de la quiniela
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.colors.text);
    doc.text(quiniela.nombre, doc.internal.pageSize.width / 2, yPos, { align: 'center' });

    yPos += 15;

    // Estadísticas generales
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    const stats = [
      ['Total de Participantes:', participantes.length.toString()],
      ['Total de Partidos:', quiniela.partidos.length.toString()],
      ['Estado:', quiniela.activa ? 'Activa' : 'Inactiva'],
      ['Fecha de Creación:', this.formatearFecha(quiniela.fechaCreacion)]
    ];

    stats.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...this.colors.primary);
      doc.text(label, 40, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...this.colors.text);
      doc.text(value, 120, yPos);
      yPos += 10;
    });

    this.agregarFooter(doc, numeroPagina);

    // Nueva página para participantes
    doc.addPage();
    numeroPagina++;

    this.agregarHeader(doc, 'LISTA DE PARTICIPANTES');

    yPos = 50;

    // Tabla de participantes
    const participantesData = participantes.map((part, index) => {
      const prediccionesTexto = part.predicciones
        .map(p => this.getPrediccionTexto(p.prediccion))
        .join(', ');

      return [
        (index + 1).toString(),
        part.participante.nombre,
        this.formatearFecha(part.timestamp),
        part.folio
      ];
    });

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Participante', 'Fecha Registro', 'Folio']],
      body: participantesData,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: this.colors.text
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 60 },
        2: { cellWidth: 50 },
        3: { cellWidth: 60, fontSize: 7 }
      },
      margin: { left: 20, right: 20 },
      didDrawPage: (data) => {
        this.agregarFooter(doc, numeroPagina);
      }
    });

    // Descargar
    const fileName = `Reporte_${quiniela.nombre.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(fileName);

    return doc;
  }

  // Generar PDF con predicciones detalladas de todos los participantes
  static async generarReporteDetallado(quiniela, participantes) {
    const doc = new jsPDF('landscape'); // Formato horizontal para más espacio
    let numeroPagina = 1;

    this.agregarHeader(doc, 'REPORTE DETALLADO - PREDICCIONES');

    let yPos = 50;

    // Crear matriz de predicciones
    const partidosHeaders = quiniela.partidos.map((p, i) => `P${i + 1}`);
    const tableHeaders = ['#', 'Participante', 'Fecha', ...partidosHeaders];

    const tableData = participantes.map((part, index) => {
      const prediccionesRow = quiniela.partidos.map(partido => {
        const pred = part.predicciones.find(p => p.partidoId === partido.id);
        if (!pred) return '-';

        // Abreviaciones
        switch (pred.prediccion) {
          case 'local': return 'L';
          case 'empate': return 'E';
          case 'visitante': return 'V';
          default: return '-';
        }
      });

      return [
        (index + 1).toString(),
        part.participante.nombre.substring(0, 20),
        this.formatearFecha(part.timestamp).substring(0, 16),
        ...prediccionesRow
      ];
    });

    doc.autoTable({
      startY: yPos,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7
      },
      bodyStyles: {
        fontSize: 6,
        textColor: this.colors.text,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40, halign: 'left' },
        2: { cellWidth: 35, halign: 'left' }
      },
      margin: { left: 10, right: 10 },
      didDrawPage: (data) => {
        this.agregarFooter(doc, numeroPagina);
        numeroPagina++;
      }
    });

    // Leyenda
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...this.colors.textLight);
    doc.text('Leyenda: L = Local, E = Empate, V = Visitante', 15, finalY);

    // Descargar
    const fileName = `Reporte_Detallado_${quiniela.nombre.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(fileName);

    return doc;
  }
}

export default PDFService;
