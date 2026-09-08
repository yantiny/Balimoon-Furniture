'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface ParametricFurnitureProps {
  modelType: 'table' | 'dining-table' | 'coffee-table' | 'cabinet' | 'bookshelf' | 'tv-console' | 'chair' | 'sofa' | 'bed';
  length: number; // in cm

  width: number;  // in cm
  height: number; // in cm
  materialName?: string;
  showDimensions?: boolean;
}

export const ParametricFurniture: React.FC<ParametricFurnitureProps> = ({
  modelType,
  length,
  width,
  height,
  showDimensions = true
}) => {
  // Convert cm to 3D world units (100cm = 1.0 unit)
  const l = length / 100;
  const w = width / 100;
  const h = height / 100;

  // Natural warm wood material texture settings
  const woodMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8B5A2B'),
      roughness: 0.45,
      metalness: 0.05,
    });
  }, []);

  const darkWoodMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#5C3A1E'),
      roughness: 0.5,
      metalness: 0.05,
    });
  }, []);

  const rattanMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C89D7C'),
      roughness: 0.7,
      metalness: 0.0,
    });
  }, []);

  const legMetalAccent = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2C2A29'),
      roughness: 0.3,
      metalness: 0.8,
    });
  }, []);

  // 1. TABLE / DINING / COFFEE TABLE
  if (modelType === 'table' || modelType === 'dining-table' || modelType === 'coffee-table') {
    const isCoffee = modelType === 'coffee-table';
    const topThickness = isCoffee ? 0.035 : 0.045;
    const legRadius = isCoffee ? 0.025 : 0.035;
    const legOffset = legRadius + 0.05;

    const topPosY = h - topThickness / 2;
    const legHeight = h - topThickness;
    const legPosY = legHeight / 2;

    const legX = Math.max(0.1, l / 2 - legOffset);
    const legZ = Math.max(0.1, w / 2 - legOffset);

    return (
      <group position={[0, 0, 0]}>
        {/* Table Top Slab */}
        <mesh position={[0, topPosY, 0]} material={woodMaterial} castShadow receiveShadow>
          <boxGeometry args={[l, topThickness, w]} />
        </mesh>

        {/* Under-Top Support Apron Frame */}
        <mesh position={[0, topPosY - topThickness, 0]} material={darkWoodMaterial} castShadow receiveShadow>
          <boxGeometry args={[l * 0.85, 0.04, w * 0.85]} />
        </mesh>

        {/* 4 Corner Leg Posts */}
        {[
          [legX, legPosY, legZ],
          [-legX, legPosY, legZ],
          [legX, legPosY, -legZ],
          [-legX, legPosY, -legZ],
        ].map((pos, idx) => (
          <group key={idx} position={pos as [number, number, number]}>
            <mesh material={woodMaterial} castShadow receiveShadow>
              <cylinderGeometry args={[legRadius * 0.9, legRadius, legHeight, 16]} />
            </mesh>
            {/* Metallic foot cap */}
            <mesh position={[0, -legHeight / 2 + 0.015, 0]} material={legMetalAccent}>
              <cylinderGeometry args={[legRadius + 0.002, legRadius + 0.002, 0.03, 16]} />
            </mesh>
          </group>
        ))}

        {/* Dimension Overlay Badge Indicators */}
        {showDimensions && (
          <DimensionIndicators l={l} w={w} h={h} length={length} width={width} height={height} />
        )}
      </group>
    );
  }

  // 2. CABINET
  if (modelType === 'cabinet') {
    const wallThickness = 0.03;
    const legHeight = 0.15;
    const cabinetBodyH = h - legHeight;
    const cabinetPosY = legHeight + cabinetBodyH / 2;
    const doorW = (l - wallThickness * 3) / 2;

    return (
      <group position={[0, 0, 0]}>
        {/* Outer Cabinet Frame Box */}
        <mesh position={[0, cabinetPosY, 0]} material={woodMaterial} castShadow receiveShadow>
          <boxGeometry args={[l, cabinetBodyH, w]} />
        </mesh>

        {/* Left Rattan Panel Door */}
        <mesh position={[-l / 4, cabinetPosY, w / 2 + 0.005]} material={rattanMaterial} castShadow receiveShadow>
          <boxGeometry args={[doorW, cabinetBodyH - 0.06, 0.015]} />
        </mesh>

        {/* Right Rattan Panel Door */}
        <mesh position={[l / 4, cabinetPosY, w / 2 + 0.005]} material={rattanMaterial} castShadow receiveShadow>
          <boxGeometry args={[doorW, cabinetBodyH - 0.06, 0.015]} />
        </mesh>

        {/* Door Brass Handles */}
        <mesh position={[-0.03, cabinetPosY, w / 2 + 0.02]} material={legMetalAccent}>
          <cylinderGeometry args={[0.008, 0.008, 0.08, 12]} />
        </mesh>
        <mesh position={[0.03, cabinetPosY, w / 2 + 0.02]} material={legMetalAccent}>
          <cylinderGeometry args={[0.008, 0.008, 0.08, 12]} />
        </mesh>

        {/* 4 Base Legs */}
        {[
          [l / 2 - 0.06, legHeight / 2, w / 2 - 0.06],
          [-l / 2 + 0.06, legHeight / 2, w / 2 - 0.06],
          [l / 2 - 0.06, legHeight / 2, -w / 2 + 0.06],
          [-l / 2 + 0.06, legHeight / 2, -w / 2 + 0.06],
        ].map((pos, idx) => (
          <mesh key={idx} position={pos as [number, number, number]} material={darkWoodMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.025, 0.02, legHeight, 16]} />
          </mesh>
        ))}

        {showDimensions && (
          <DimensionIndicators l={l} w={w} h={h} length={length} width={width} height={height} />
        )}
      </group>
    );
  }

  // 3. BOOKSHELF
  if (modelType === 'bookshelf') {
    const postThickness = 0.04;
    const shelfThickness = 0.03;
    const numShelves = Math.max(3, Math.floor(h / 0.45));
    const shelfSpacing = (h - shelfThickness) / (numShelves - 1);

    return (
      <group position={[0, 0, 0]}>
        {/* Left Vertical Side Pillar */}
        <mesh position={[-l / 2 + postThickness / 2, h / 2, 0]} material={woodMaterial} castShadow receiveShadow>
          <boxGeometry args={[postThickness, h, w]} />
        </mesh>

        {/* Right Vertical Side Pillar */}
        <mesh position={[l / 2 - postThickness / 2, h / 2, 0]} material={woodMaterial} castShadow receiveShadow>
          <boxGeometry args={[postThickness, h, w]} />
        </mesh>

        {/* Horizontal Shelf Planks */}
        {Array.from({ length: numShelves }).map((_, idx) => {
          const posY = shelfThickness / 2 + idx * shelfSpacing;
          return (
            <mesh key={idx} position={[0, posY, 0]} material={darkWoodMaterial} castShadow receiveShadow>
              <boxGeometry args={[l - postThickness * 2, shelfThickness, w * 0.95]} />
            </mesh>
          );
        })}

        {showDimensions && (
          <DimensionIndicators l={l} w={w} h={h} length={length} width={width} height={height} />
        )}
      </group>
    );
  }

  // 4. TV CONSOLE
  if (modelType === 'tv-console') {
    const legH = 0.15;
    const bodyH = h - legH;
    const bodyPosY = legH + bodyH / 2;
    const doorW = (l * 0.6) / 2;

    return (
      <group position={[0, 0, 0]}>
        {/* Main TV Unit Cabinet Body */}
        <mesh position={[0, bodyPosY, 0]} material={woodMaterial} castShadow receiveShadow>
          <boxGeometry args={[l, bodyH, w]} />
        </mesh>

        {/* Open Center Compartment Bay */}
        <mesh position={[0, bodyPosY, 0.01]} material={darkWoodMaterial}>
          <boxGeometry args={[l * 0.35, bodyH - 0.06, w + 0.002]} />
        </mesh>

        {/* Sliding Front Slatted Doors */}
        <mesh position={[-l * 0.32, bodyPosY, w / 2 + 0.005]} material={woodMaterial} castShadow receiveShadow>
          <boxGeometry args={[doorW, bodyH - 0.05, 0.015]} />
        </mesh>
        <mesh position={[l * 0.32, bodyPosY, w / 2 + 0.005]} material={woodMaterial} castShadow receiveShadow>
          <boxGeometry args={[doorW, bodyH - 0.05, 0.015]} />
        </mesh>

        {/* 4 Tapered Console Legs */}
        {[
          [l / 2 - 0.1, legH / 2, w / 2 - 0.08],
          [-l / 2 + 0.1, legH / 2, w / 2 - 0.08],
          [l / 2 - 0.1, legH / 2, -w / 2 + 0.08],
          [-l / 2 + 0.1, legH / 2, -w / 2 + 0.08],
        ].map((pos, idx) => (
          <mesh key={idx} position={pos as [number, number, number]} material={darkWoodMaterial} castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.015, legH, 16]} />
          </mesh>
        ))}

        {showDimensions && (
          <DimensionIndicators l={l} w={w} h={h} length={length} width={width} height={height} />
        )}
      </group>
    );
  }

  return null;
};

// 3D Overlay Badges for real-time Length, Width, Height callout indicators
const DimensionIndicators: React.FC<{
  l: number;
  w: number;
  h: number;
  length: number;
  width: number;
  height: number;
}> = ({ l, w, h, length, width, height }) => {
  return (
    <group>
      {/* Length Badge (Panjang - Front Center X) */}
      <Html position={[0, -0.05, w / 2 + 0.12]} center>
        <div className="px-2.5 py-1 bg-charcoal-900/90 text-white text-xs font-mono font-medium rounded-full shadow-lg border border-white/20 whitespace-nowrap backdrop-blur-sm select-none">
          <span className="text-amber-400 font-bold">P:</span> {length} cm
        </div>
      </Html>

      {/* Width Badge (Lebar - Right Side Z) */}
      <Html position={[l / 2 + 0.12, -0.05, 0]} center>
        <div className="px-2.5 py-1 bg-charcoal-900/90 text-white text-xs font-mono font-medium rounded-full shadow-lg border border-white/20 whitespace-nowrap backdrop-blur-sm select-none">
          <span className="text-amber-400 font-bold">L:</span> {width} cm
        </div>
      </Html>

      {/* Height Badge (Tinggi - Top Right Corner Y) */}
      <Html position={[l / 2 + 0.1, h / 2, -w / 2]} center>
        <div className="px-2.5 py-1 bg-charcoal-900/90 text-white text-xs font-mono font-medium rounded-full shadow-lg border border-white/20 whitespace-nowrap backdrop-blur-sm select-none">
          <span className="text-amber-400 font-bold">T:</span> {height} cm
        </div>
      </Html>
    </group>
  );
};
