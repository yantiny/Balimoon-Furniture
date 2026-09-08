'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Center } from '@react-three/drei';
import { ParametricFurniture } from './ParametricFurniture';
import { GLBFurnitureModel } from './GLBFurnitureModel';
import { RefreshCw, RotateCcw, Move3d } from 'lucide-react';

interface FurnitureCanvasProps {
  modelType: 'table' | 'dining-table' | 'coffee-table' | 'cabinet' | 'bookshelf' | 'tv-console' | 'chair' | 'sofa' | 'bed';
  modelUrl?: string;
  length: number;
  width: number;
  height: number;
  defaultLength?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  showDimensions?: boolean;
  hideUIControls?: boolean;
  cameraPosition?: [number, number, number];
  enableControls?: boolean;
}

export const FurnitureCanvas: React.FC<FurnitureCanvasProps> = ({
  modelType,
  modelUrl,
  length,
  width,
  height,
  defaultLength,
  defaultWidth,
  defaultHeight,
  showDimensions = true,
  hideUIControls = false,
  cameraPosition,
  enableControls = true
}) => {

  const [autoRotate, setAutoRotate] = useState(false);
  const [key, setKey] = useState(0);

  const resetView = () => {
    setKey(prev => prev + 1);
  };

  const initialCamPos = cameraPosition || [2.0, 1.2, 2.2];
  const controlsActive = enableControls && !hideUIControls;

  return (
    <div className={`relative w-full h-full bg-gradient-to-b from-cream-100 via-cream-200 to-cream-300/80 overflow-hidden group ${
      hideUIControls ? 'rounded-t-2xl' : 'h-[400px] md:h-[550px] rounded-2xl shadow-inner border border-warm-border/60'
    }`}>
      {/* Top Floating Control Bar (Only shown on full customizer view when controls enabled) */}
      {!hideUIControls && enableControls && (
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-warm-border/40 text-charcoal-900 text-xs font-medium pointer-events-auto">
            <Move3d className="w-3.5 h-3.5 text-wood-medium animate-pulse" />
            <span>Tampilan 3D Model Real-Time</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title="Putar Otomatis"
              className={`p-2 rounded-full backdrop-blur-md shadow-sm border transition-all text-xs flex items-center gap-1.5 ${
                autoRotate
                  ? 'bg-wood-medium text-white border-wood-medium'
                  : 'bg-white/80 hover:bg-white text-charcoal-700 border-warm-border/60'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline font-medium">{autoRotate ? 'Berputar' : 'Putar Otomatis'}</span>
            </button>

            <button
              onClick={resetView}
              title="Reset Tampilan Kamera"
              className="p-2 rounded-full bg-white/80 hover:bg-white text-charcoal-700 backdrop-blur-md shadow-sm border border-warm-border/60 transition-all text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* R3F Canvas Viewport */}
      <Canvas
        key={`${key}-${initialCamPos.join('-')}-${enableControls}`}
        shadows
        camera={{ position: initialCamPos, fov: 38 }}
        className={`w-full h-full ${enableControls ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      >
        <ambientLight intensity={0.95} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.3}
          castShadow
          shadow-mapSize={2048}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />

        <Suspense fallback={null}>
          <Center>
            {modelUrl ? (
              <GLBFurnitureModel
                modelUrl={modelUrl}
                length={length}
                width={width}
                height={height}
                defaultLength={defaultLength}
                defaultWidth={defaultWidth}
                defaultHeight={defaultHeight}
                showDimensions={showDimensions}
              />

            ) : (
              <ParametricFurniture
                modelType={modelType}
                length={length}
                width={width}
                height={height}
                showDimensions={showDimensions}
              />
            )}
          </Center>

          <ContactShadows
            position={[0, -0.75, 0]}
            opacity={0.4}
            scale={4.5}
            blur={1.5}
            far={1}
          />
          <Environment preset="apartment" />
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping={enableControls}
          enableRotate={enableControls}
          enableZoom={enableControls}
          enablePan={enableControls}
          dampingFactor={0.05}
          autoRotate={enableControls && autoRotate}
          autoRotateSpeed={1.0}
          minDistance={1.0}
          maxDistance={6.0}
          maxPolarAngle={Math.PI / 2 + 0.05}
        />
      </Canvas>

      {/* Bottom Hint (Only shown when controls enabled and UI visible) */}
      {!hideUIControls && enableControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="px-3 py-1 bg-charcoal-900/60 backdrop-blur-md text-white text-[11px] rounded-full shadow-sm flex items-center gap-2">
            <span>Klik & Geser untuk Memutar</span>
            <span className="text-cream-300">•</span>
            <span>Scroll untuk Zoom</span>
            <span className="text-cream-300">•</span>
            <span>Klik Kanan untuk Menggeser</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FurnitureCanvas;
