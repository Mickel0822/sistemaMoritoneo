"use client";

// frontend/components/HomePage.tsx
import React, { useState } from 'react';
import PreMonitoreo from './PreMonitoreo';
import Lectura from './Lectura';

// Define los tipos de documento disponibles
type DocKey = 'corto' | 'mediano' | 'extenso';

// Relaciona cada documento con su tiempo estimado
const tiempos: Record<DocKey, string> = {
  corto: '1-1.5 minutos',
  mediano: '2-2.5 minutos',
  extenso: '4-5 minutos',
};

const HomePage: React.FC = () => {
  // Estados para controlar la navegación y selección
  const [mostrarPreMonitoreo, setMostrarPreMonitoreo] = useState(false);
  const [mostrarLectura, setMostrarLectura] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocKey | ''>(''); // Guarda el documento seleccionado
  const [reiniciar, setReiniciar] = useState(false); // Controla el reinicio del flujo

  // Maneja el cambio en el select de documentos
  const handleSeleccionar = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value as DocKey;
    setSelectedDoc(valor);
  };

  // Muestra la pantalla de pre-monitoreo si hay documento seleccionado
  const handleIniciaLectura = () => {
    if (selectedDoc) setMostrarPreMonitoreo(true);
  };

  // Muestra la pantalla de lectura
  const handleIniciaMonitoreo = () => {
    setMostrarLectura(true);
  };

  // Reinicia todo el flujo para volver a la pantalla principal
  const handleVolver = () => {
    setMostrarPreMonitoreo(false);
    setMostrarLectura(false);
    setSelectedDoc('');
    setReiniciar(!reiniciar); // Cambia el estado para forzar el reinicio de Lectura
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Pantalla inicial: selección de documento */}
      {!mostrarPreMonitoreo && !mostrarLectura ? (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Sistema de Monitoreo de Atención
          </h1>
          <div className="w-full max-w-md">
            <label htmlFor="document-select" className="block text-lg font-medium text-gray-700 mb-2">
              Selecciona un documento:
            </label>
            <select
              id="document-select"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
              onChange={handleSeleccionar}
              value={selectedDoc}
            >
              <option value="">-- Elige --</option>
              <option value="corto">Corto (1-1.5 min)</option>
              <option value="mediano">Mediano (2-2.5 min)</option>
              <option value="extenso">Extenso (~4-5 min)</option>
            </select>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              onClick={handleIniciaLectura}
              disabled={!selectedDoc}
            >
              Seleccionar Documento
            </button>
          </div>
        </>
      ) : mostrarPreMonitoreo && !mostrarLectura ? (
        // Pantalla de pre-monitoreo, pasa el tiempo estimado y función para iniciar lectura
        <PreMonitoreo
          tiempo={selectedDoc ? tiempos[selectedDoc] : ''}
          onIniciaLectura={handleIniciaMonitoreo}
        />
      ) : (
        // Pantalla de lectura, pasa la clave del documento seleccionado y la función para volver
        <Lectura
          key={reiniciar ? 'lectura-reiniciar' : 'lectura'}
          documentKey={selectedDoc || 'corto'}
          onVolver={handleVolver}
        />
      )}
    </div>
  );
};

export default HomePage;