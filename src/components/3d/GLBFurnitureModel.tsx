'use client';

import React, { useMemo } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

interface GLBFurnitureModelProps {
  modelUrl: string;
  length?: number; // current length in cm from slider
  width?: number;  // current width in cm from slider
  height?: number; // current height in cm from slider
  defaultLength?: number; // default product length in cm
  defaultWidth?: number;  // default product width in cm
  defaultHeight?: number; // default product height in cm
  showDimensions?: boolean;
}

export const GLBFurnitureModel: React.FC<GLBFurnitureModelProps> = ({
  modelUrl,
  length = 100,
  width = 50,
  height = 75,
  defaultLength,
  defaultWidth,
  defaultHeight,
  showDimensions = true
}) => {
  // Load GLB file using Drei useGLTF
  const { scene } = useGLTF(modelUrl);

  const { innerGroup, scaleX, scaleY, scaleZ, isXWidth, boundWidth, boundLength, boundHeight } = useMemo(() => {
    const cloned = scene.clone(true);

    // Compute original bounding box of unscaled GLB model
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Center model geometry inside an inner group so its local origin is (0,0,0) horizontally and at Y=0 (bottom)
    const inner = new THREE.Group();
    cloned.position.set(-center.x, -box.min.y, -center.z);
    inner.add(cloned);

    const defL = defaultLength || (size.x > 0 ? size.x * 100 : 100);
    const defW = defaultWidth || (size.z > 0 ? size.z * 100 : 100);
    const defH = defaultHeight || (size.y > 0 ? size.y * 100 : 100);

    // Optimal base framing scale so all GLB models fit nicely and balanced in the 3D viewport
    const maxDim = Math.max(size.x, size.y, size.z);
    const baseScale = maxDim > 0 ? 1.35 / maxDim : 1;

    // Compare GLB aspect ratio with default dimensions ratio to detect if X axis represents Width or Length
    const ratioActual = size.z > 0 ? size.x / size.z : 1;
    const ratioOptionA = defW > 0 ? defL / defW : 1; // X = Length, Z = Width
    const ratioOptionB = defL > 0 ? defW / defL : 1; // X = Width, Z = Length

    const errA = Math.abs(ratioActual - ratioOptionA);
    const errB = Math.abs(ratioActual - ratioOptionB);

    const isXWidth = errB < errA;

    let sX = 1;
    let sZ = 1;
    let sY = defH > 0 ? height / defH : 1;

    if (isXWidth) {
      sX = defW > 0 ? width / defW : 1;
      sZ = defL > 0 ? length / defL : 1;
    } else {
      sX = defL > 0 ? length / defL : 1;
      sZ = defW > 0 ? width / defW : 1;
    }

    // Enable shadows and adjust material roughness for natural matte wood finish (less glossy)
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if ('roughness' in mat) {
              // Increase roughness to 0.82 to make wood look natural matte rather than shiny/glossy
              (mat as THREE.MeshStandardMaterial).roughness = 0.82;
            }
            if ('metalness' in mat) {
              // Reduce metalness to 0.02 to avoid metallic specularity on wood
              (mat as THREE.MeshStandardMaterial).metalness = 0.02;
            }
          });
        }
      }
    });

    return {
      innerGroup: inner,
      scaleX: baseScale * sX,
      scaleY: baseScale * sY,
      scaleZ: baseScale * sZ,
      isXWidth,
      boundWidth: size.x * baseScale * sX,
      boundLength: size.z * baseScale * sZ,
      boundHeight: size.y * baseScale * sY,
    };
  }, [scene, length, width, height, defaultLength, defaultWidth, defaultHeight]);

  return (
    <group scale={[scaleX, scaleY, scaleZ]}>
      <primitive object={innerGroup} />
      {showDimensions && (
        <GLBDimensionIndicators
          length={length}
          width={width}
          height={height}
          isXWidth={isXWidth}
          boundWidth={boundWidth / scaleX}
          boundLength={boundLength / scaleZ}
          boundHeight={boundHeight / scaleY}
        />
      )}
    </group>
  );
};

const GLBDimensionIndicators: React.FC<{
  length: number;
  width: number;
  height: number;
  isXWidth: boolean;
  boundWidth: number;
  boundLength: number;
  boundHeight: number;
}> = ({ length, width, height, isXWidth, boundWidth, boundLength, boundHeight }) => {
  const posX = boundWidth / 2 + 0.15;
  const posZ = boundLength / 2 + 0.15;
  const posY = boundHeight / 2;

  return (
    <group>
      {/* Front Callout Badge */}
      <Html position={[0, 0, posZ]} center>
        <div className="px-2.5 py-1 bg-charcoal-900/90 text-white text-xs font-mono font-medium rounded-full shadow-lg border border-white/20 whitespace-nowrap backdrop-blur-sm select-none">
          <span className="text-amber-400 font-bold">{isXWidth ? 'P:' : 'L:'}</span> {isXWidth ? length : width} cm
        </div>
      </Html>

      {/* Side Callout Badge */}
      <Html position={[posX, 0, 0]} center>
        <div className="px-2.5 py-1 bg-charcoal-900/90 text-white text-xs font-mono font-medium rounded-full shadow-lg border border-white/20 whitespace-nowrap backdrop-blur-sm select-none">
          <span className="text-amber-400 font-bold">{isXWidth ? 'L:' : 'P:'}</span> {isXWidth ? width : length} cm
        </div>
      </Html>

      {/* Height Callout Badge */}
      <Html position={[posX, posY, -posZ]} center>
        <div className="px-2.5 py-1 bg-charcoal-900/90 text-white text-xs font-mono font-medium rounded-full shadow-lg border border-white/20 whitespace-nowrap backdrop-blur-sm select-none">
          <span className="text-amber-400 font-bold">T:</span> {height} cm
        </div>
      </Html>
    </group>
  );
};
