import React, { useState, useRef } from 'react';
import { X, Copy, Download, Check, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeShare = ({ isOpen, onClose, quinielaId, quinielaNombre }) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const publicURL = `${window.location.origin}/quiniela/${quinielaId}`;

  // Copiar link al portapapeles
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
      alert('No se pudo copiar el link');
    }
  };

  // Descargar QR como imagen
  const handleDownloadQR = () => {
    try {
      const svg = qrRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      // Tamaño del canvas (más grande para mejor calidad)
      canvas.width = 1000;
      canvas.height = 1200;

      img.onload = () => {
        // Fondo blanco
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Título
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Escanea para participar', canvas.width / 2, 80);

        // Nombre de la quiniela
        ctx.font = '32px Arial';
        ctx.fillStyle = '#4B5563';
        const maxWidth = canvas.width - 100;
        const nombreLineas = wrapText(ctx, quinielaNombre, maxWidth);
        nombreLineas.forEach((linea, index) => {
          ctx.fillText(linea, canvas.width / 2, 140 + (index * 40));
        });

        // QR Code
        const qrSize = 600;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = 140 + (nombreLineas.length * 40) + 40;
        ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

        // URL debajo del QR
        ctx.font = '24px Arial';
        ctx.fillStyle = '#6B7280';
        ctx.fillText(publicURL, canvas.width / 2, qrY + qrSize + 50);

        // Footer
        ctx.font = 'italic 20px Arial';
        ctx.fillStyle = '#9CA3AF';
        ctx.fillText('Sistema de Quinielas - Liga MX', canvas.width / 2, qrY + qrSize + 100);

        // Convertir a blob y descargar
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `QR_${quinielaNombre.replace(/\s+/g, '_')}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Error al descargar QR:', error);
      alert('Error al generar la imagen');
    }
  };

  // Función helper para wrap text
  const wrapText = (context, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  // Compartir usando Web Share API (móvil)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: quinielaNombre,
          text: `¡Participa en la quiniela "${quinielaNombre}"!`,
          url: publicURL
        });
      } catch (error) {
        // Usuario canceló o no soportado
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink(); // Fallback a copiar
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Share2 className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Compartir Quiniela</h2>
              <p className="text-blue-100 text-sm">Código QR y Link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Nombre de la quiniela */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{quinielaNombre}</h3>
            <p className="text-sm text-gray-600">Escanea el código o comparte el link</p>
          </div>

          {/* QR Code */}
          <div ref={qrRef} className="flex justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg border-4 border-gray-100">
              <QRCodeSVG
                value={publicURL}
                size={200}
                level="H"
                includeMargin={true}
                bgColor="#FFFFFF"
                fgColor="#1F2937"
              />
            </div>
          </div>

          {/* URL */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-2 font-semibold">Link Público:</p>
            <p className="text-sm text-gray-800 font-mono break-all">{publicURL}</p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            {/* Copiar Link */}
            <button
              onClick={handleCopyLink}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {copied ? (
                <>
                  <Check size={20} />
                  ¡Link Copiado!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copiar Link
                </>
              )}
            </button>

            {/* Descargar QR */}
            <button
              onClick={handleDownloadQR}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Download size={20} />
              Descargar QR como Imagen
            </button>

            {/* Compartir Nativo (móvil) */}
            {navigator.share && (
              <button
                onClick={handleNativeShare}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Share2 size={20} />
                Compartir
              </button>
            )}
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong className="block mb-2">💡 Cómo compartir:</strong>
              1. Escanea el código QR con tu celular<br />
              2. O copia el link y compártelo por WhatsApp, email, etc.<br />
              3. Los participantes podrán acceder sin necesidad de login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeShare;
