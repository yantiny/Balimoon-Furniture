# Folder Aset Model 3D (.glb)

Folder ini digunakan untuk menyimpan berkas 3D model berformat **.glb** atau **.gltf** untuk produk mebel Balimoon Furniture.

## Cara Penggunaan di Next.js:
Setiap berkas `.glb` yang ditaruh di folder ini dapat langsung diakses dari browser dengan path publik `/models/nama_file.glb`.

### Contoh:
- Tempatkan file: `public/models/custom-table.glb`
- Path akses di kode React / Three.js / R3F: `/models/custom-table.glb`

```tsx
import { useGLTF } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/models/custom-table.glb');
  return <primitive object={scene} />;
}
```
