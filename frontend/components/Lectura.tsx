"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { documentos, DocKey } from './documentos';

// Define las props que recibe el componente
interface LecturaProps {
  documentKey: DocKey;
  onVolver?: () => void; // Prop opcional para volver al inicio
}

// Umbrales para los algoritmos
const EAR_THRESHOLD = 0.3; // Ojo abierto si EAR > 0.3
const HEADPOSE_THRESHOLD = 15; // Grados de desviación aceptable
const MOR_THRESHOLD = 25; // Ajusta este valor según tus pruebas

const VIDEO_WIDTH = 480;
const VIDEO_HEIGHT = 360;

const Lectura: React.FC<LecturaProps> = ({ documentKey, onVolver }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Estados para el monitoreo y resultados
  const [monitoring, setMonitoring] = useState(true);
  const [results, setResults] = useState<{
    ear: number;
    headPose: number;
    mor: number;
    mejor: string;
  } | null>(null);

  // Contadores para los algoritmos
  const totalFrames = useRef(0);
  const earOpenFrames = useRef(0);
  const headPoseGoodFrames = useRef(0);
  const mouthClosedFrames = useRef(0);

  // Función para apagar la cámara
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Cargar modelos y solicitar webcam
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68');
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({
        video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT }
      })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error('Error con webcam:', err));
    };

    loadModels();

    // Cleanup: Detener la cámara al desmontar el componente
    return () => {
      stopCamera();
    };
  }, []);

  // Procesar frames de la webcam y calcular métricas
  useEffect(() => {
    if (!monitoring) return;
    let interval: NodeJS.Timeout;

    const processFrame = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const context = canvasRef.current.getContext('2d');
      context?.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

      if (detections && detections.landmarks) {
        faceapi.draw.drawDetections(canvasRef.current, [detections]);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, [detections]);

        totalFrames.current++;

        // EAR (Eye Aspect Ratio)
        const leftEAR = computeEAR(detections.landmarks.getLeftEye());
        const rightEAR = computeEAR(detections.landmarks.getRightEye());
        const avgEAR = (leftEAR + rightEAR) / 2;
        if (avgEAR > EAR_THRESHOLD) {
          earOpenFrames.current++;
        }

        // Head Pose (estimación simple usando nariz)
        const nose = detections.landmarks.getNose();
        const jaw = detections.landmarks.getJawOutline();
        const faceCenterX = (jaw[0].x + jaw[16].x) / 2;
        const noseX = nose[3].x;
        const deviation = Math.abs(noseX - faceCenterX);
        if (deviation < HEADPOSE_THRESHOLD) {
          headPoseGoodFrames.current++;
        }

        // Mouth Opening Ratio (MOR)
        const mouth = detections.landmarks.getMouth();
        const mor = computeMOR(mouth);
        // Muestra el valor de MOR en consola para calibrar el umbral
        console.log('MOR actual:', mor);
        // Considera "atención" si la boca está cerrada (MOR < threshold)
        if (mor < MOR_THRESHOLD) {
          mouthClosedFrames.current++;
        }
      }
    };

    interval = setInterval(processFrame, 200); // 5 fps aprox.

    return () => clearInterval(interval);
  }, [monitoring]);

  // Función para calcular EAR de un ojo
  function computeEAR(eye: faceapi.Point[]) {
    const dist = (a: faceapi.Point, b: faceapi.Point) =>
      Math.hypot(a.x - b.x, a.y - b.y);
    return (
      (dist(eye[1], eye[5]) + dist(eye[2], eye[4])) /
      (2.0 * dist(eye[0], eye[3]))
    );
  }

  // Función para calcular MOR: distancia vertical entre labio superior (punto 51) e inferior (punto 57)
  function computeMOR(mouth: faceapi.Point[]) {
    // mouth[3] = punto 51, mouth[9] = punto 57
    return Math.hypot(mouth[3].x - mouth[9].x, mouth[3].y - mouth[9].y);
  }

  // Al pulsar "Terminé", calcula los porcentajes, apaga la cámara, muestra resultados y ENVÍA AL BACKEND
  const handleFinish = () => {
    setMonitoring(false);
    stopCamera();

    const total = totalFrames.current || 1; // Evita división por cero
    const earPct = (earOpenFrames.current / total) * 100;
    const headPosePct = (headPoseGoodFrames.current / total) * 100;
    const morPct = (mouthClosedFrames.current / total) * 100;

    const valores = [
      { nombre: 'EAR', valor: earPct },
      { nombre: 'Head Pose', valor: headPosePct },
      { nombre: 'MOR', valor: morPct },
    ];
    const mejor = valores.reduce((a, b) => (a.valor > b.valor ? a : b)).nombre;

    // Enviar resultados al backend Django
    fetch('http://localhost:8000/api/resultados/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documento: documentKey,
        ear: earPct,
        headPose: headPosePct,
        mor: morPct,
        mejor: mejor
      })
    })
      .then(res => res.json())
      .then(data => console.log('Respuesta del backend:', data))
      .catch(err => console.error('Error al enviar resultados:', err));

    setResults({
      ear: earPct,
      headPose: headPosePct,
      mor: morPct,
      mejor,
    });
  };

  // Al volver a leer otro documento, apaga la cámara antes de volver
  const handleVolverClick = () => {
    stopCamera();
    if (onVolver) onVolver();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Pantalla de Lectura</h1>
      <div className="w-full max-w-lg">
        {/* Webcam y canvas para mostrar detecciones */}
        <div
          style={{
            position: 'relative',
            width: VIDEO_WIDTH,
            height: VIDEO_HEIGHT,
            margin: '0 auto',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            style={{
              width: VIDEO_WIDTH,
              height: VIDEO_HEIGHT,
              objectFit: 'cover',
              background: '#000',
              borderRadius: '8px',
              display: 'block',
            }}
          />
          <canvas
            ref={canvasRef}
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: VIDEO_WIDTH,
              height: VIDEO_HEIGHT,
              pointerEvents: 'none',
              borderRadius: '8px',
            }}
          />
        </div>
        {/* Texto del documento seleccionado */}
        <div className="mt-4 p-4 bg-white rounded-md overflow-auto" style={{ maxHeight: '400px' }}>
          <p style={{ whiteSpace: 'pre-line', color: '#111' }}>{documentos[documentKey]}</p>
        </div>
        {/* Botón para finalizar la lectura */}
        {!results && (
          <button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4"
            onClick={handleFinish}
          >
            Terminé
          </button>
        )}
        {/* Resultados finales */}
        {results && (
          <div className="mt-6 bg-white rounded-md p-4 shadow">
            <h2 className="text-lg font-bold mb-2 text-gray-800">Resultados de Atención</h2>
            <table className="w-full text-center border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-2 py-1 text-gray-800 bg-gray-100">Algoritmo</th>
                  <th className="border border-gray-300 px-2 py-1 text-gray-800 bg-gray-100">Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                <tr className={results.mejor === 'EAR' ? 'bg-green-200 font-bold text-gray-900' : 'text-gray-900'}>
                  <td className="border border-gray-300 px-2 py-1">EAR</td>
                  <td className="border border-gray-300 px-2 py-1">{results.ear.toFixed(2)}%</td>
                </tr>
                <tr className={results.mejor === 'Head Pose' ? 'bg-green-200 font-bold text-gray-900' : 'text-gray-900'}>
                  <td className="border border-gray-300 px-2 py-1">Head Pose</td>
                  <td className="border border-gray-300 px-2 py-1">{results.headPose.toFixed(2)}%</td>
                </tr>
                <tr className={results.mejor === 'MOR' ? 'bg-green-200 font-bold text-gray-900' : 'text-gray-900'}>
                  <td className="border border-gray-300 px-2 py-1">Mouth Opening Ratio</td>
                  <td className="border border-gray-300 px-2 py-1">{results.mor.toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-green-700 font-bold">
            {`En este monitoreo, el mejor algoritmo es ${results.mejor} porque obtuvo el mayor nivel de atención registrado durante la lectura, alcanzando un porcentaje de ${(() => {
                if (results.mejor === 'EAR') return results.ear.toFixed(2);
                if (results.mejor === 'Head Pose') return results.headPose.toFixed(2);
                if (results.mejor === 'MOR') return results.mor.toFixed(2);
                return '';
            })()}%.`}
            </p>
            {/* Botón para volver a leer otro documento */}
            {onVolver && (
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4"
                onClick={handleVolverClick}
              >
                Volver a leer otro documento
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lectura;