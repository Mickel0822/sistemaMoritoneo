// frontend/components/PreMonitoreo.tsx
import React from 'react';

const PreMonitoreo: React.FC<{ tiempo: string; onIniciaLectura: () => void }> = ({ tiempo, onIniciaLectura }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <p className="text-lg text-gray-700 mb-4">
        El documento seleccionado tiene un tiempo de lectura estimado de {tiempo}. No olvide dar clic en 'Terminé' cuando haya finalizado su lectura del documento.
      </p>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        onClick={onIniciaLectura}
      >
        Inicia lectura
      </button>
    </div>
  );
};

export default PreMonitoreo;