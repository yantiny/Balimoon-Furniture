import { Product } from '../types/furniture';

export const STATIC_PRODUCTS: Product[] = [
  {
    id: "kursi-kayu-01",
    name: "Meja Rias Minimalis",
    tagline: "Meja rias kayu jati perhutani berdesain anggun dan fungsional.",
    category: "living",
    basePrice: 1800000,
    description: "Meja rias kayu jati perhutani pilihan dengan cermin dan laci penyimpanan yang rapi untuk sudut rias kamar tidur Anda.",
    material: "Kayu Jati Perhutani",
    materials: [
      { id: "teak", name: "Kayu Jati Perhutani", description: "Jati kualitas premium dengan keindahan serat kayu alami.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/mejarias.glb",
    modelType: "chair",
    image: "/models/asset foto/mejarias1.png",
    gallery: [
      "/models/asset foto/mejarias1.png",
      "/models/asset foto/mejarias2.png",
      "/models/asset foto/mejarias3.png"
    ],
    productionTime: "10 - 14 Hari",
    length: { min: 50, max: 150, default: 90, step: 5 },
    width: { min: 35, max: 70, default: 45, step: 5 },
    height: { min: 110, max: 180, default: 140, step: 5 },
    recommendedDimensions: { length: 90, width: 45, height: 140 }
  },
  {
    id: "sofa-single-02",
    name: "Kursi Sofa Custom (Chair Sofa)",
    tagline: "Sofa santai dengan rangka kayu jati perhutani dan kenyamanan tinggi.",
    category: "living",
    basePrice: 2400000,
    description: "Kursi sofa santai berbahan rangka kayu jati perhutani dengan bantalan empuk dan desain modern untuk kenyamanan ruang tamu Anda.",
    material: "Kayu Jati Perhutani",
    materials: [
      { id: "teak", name: "Kayu Jati Perhutani", description: "Rangka kayu jati perhutani dipadu kain linen berkualitas.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/chairsofa.glb",
    modelType: "sofa",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80"
    ],
    productionTime: "14 - 18 Hari",
    length: { min: 60, max: 120, default: 65, step: 5 },
    width: { min: 60, max: 110, default: 80, step: 5 },
    height: { min: 60, max: 100, default: 80, step: 5 },
    recommendedDimensions: { length: 65, width: 80, height: 80 }
  },
  {
    id: "dipan-tempat-tidur-03",
    name: "Dipan Tempat Tidur Jati (Bed Frame)",
    tagline: "Dipan kayu jati perhutani berkualitas tinggi untuk kenyamanan tidur maksimal.",
    category: "living",
    basePrice: 4500000,
    description: "Tempat tidur kayu jati perhutani dengan konstruksi sambungan kayu presisi yang sangat kuat, tidak berderit, dan tahan puluhan tahun.",
    material: "Kayu Jati Perhutani",
    materials: [
      { id: "teak", name: "Kayu Jati Perhutani", description: "Kayu jati perhutani pilihan untuk stabilitas maksimal.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/dipann.glb",
    modelType: "bed",
    image: "/models/asset foto/dipan1.png",
    gallery: [
      "/models/asset foto/dipan1.png",
      "/models/asset foto/dipan2.png",
      "/models/asset foto/dipan3.png"
    ],
    productionTime: "21 - 30 Hari",
    length: { min: 160, max: 240, default: 200, step: 5 },
    width: { min: 120, max: 220, default: 160, step: 5 },
    height: { min: 30, max: 120, default: 40, step: 5 },
    recommendedDimensions: { length: 200, width: 160, height: 40 }
  },
  {
    id: "lemari-pakaian-04",
    name: "Lemari Sleding 2 Pintu",
    tagline: "Kabinet penyimpanan & lemari baju serbaguna yang elegan.",
    category: "storage",
    basePrice: 3800000,
    description: "Lemari kayu jati perhutani dengan kapasitas luas, pintu kayu presisi, dan rak penyimpanan yang dapat disesuaikan kebutuhan ruangan Anda.",
    material: "Kayu Jati Perhutani",
    materials: [
      { id: "teak", name: "Kayu Jati Perhutani", description: "Konstruksi kayu jati perhutani tebal dengan daya tahan kelembapan sangat baik.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/lemarisleding.glb",
    modelType: "cabinet",
    image: "/models/asset foto/lemari1.png",
    gallery: [
      "/models/asset foto/lemari1.png",
      "/models/asset foto/lemari2.png",
      "/models/asset foto/lemari3.png"
    ],
    productionTime: "18 - 25 Hari",
    length: { min: 100, max: 240, default: 150, step: 5 },
    width: { min: 45, max: 80, default: 60, step: 5 },
    height: { min: 150, max: 250, default: 210, step: 5 },
    recommendedDimensions: { length: 150, width: 60, height: 210 }
  },
  {
    id: "meja-kecil-coffee-05",
    name: "Meja Nakas",
    tagline: "Meja nakas minimalis yang menambah estetika ruang tidur.",
    category: "living",
    basePrice: 1500000,
    description: "Meja kecil serbaguna dengan permukaan kayu halus dan desain minimalis serbaguna sebagai meja sudut maupun meja samping sofa.",
    material: "Kayu Jati Perhutani",
    materials: [
      { id: "teak", name: "Kayu Jati Perhutani", description: "Kayu jati perhutani oven dengan warna alami serat kayu.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/nakas.glb",
    modelType: "coffee-table",
    image: "/models/asset foto/nakas1.png",
    gallery: [
      "/models/asset foto/nakas1.png",
      "/models/asset foto/nakas2.png",
      "/models/asset foto/nakas3.png"
    ],
    productionTime: "10 - 14 Hari",
    scale3D: 0.65,
    length: { min: 35, max: 70, default: 40, step: 5 },
    width: { min: 30, max: 60, default: 35, step: 5 },
    height: { min: 35, max: 65, default: 45, step: 5 },
    recommendedDimensions: { length: 40, width: 35, height: 45 }
  },
  {
    id: "meja-tinggi-makan-06",
    name: "Meja Makan Tinggi",
    tagline: "Meja makan tinggi berkonstruksi kokoh untuk keluarga.",
    category: "dining",
    basePrice: 3200000,
    description: "Meja makan kayu tinggi dengan papan kayu tebal. Dirancang khusus untuk ruang makan keluarga maupun meja kerja profesional.",
    material: "Kayu Jati Perhutani",
    materials: [
      { id: "teak", name: "Kayu Jati Perhutani", description: "Papan kayu jati perhutani pilihan tebal yang kuat dan stabil.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/mejatinggi.glb",
    modelType: "dining-table",
    image: "/models/asset foto/mejapendek1.png",
    gallery: [
      "/models/asset foto/mejapendek1.png",
      "/models/asset foto/mejapendek2.png",
      "/models/asset foto/mejapendek3.png"
    ],
    productionTime: "14 - 21 Hari",
    length: { min: 100, max: 260, default: 160, step: 5 },
    width: { min: 60, max: 120, default: 80, step: 5 },
    height: { min: 70, max: 100, default: 76, step: 2 },
    recommendedDimensions: { length: 160, width: 80, height: 76 }
  },
  {
    id: "meja-pendek-panjang-07",
    name: "Meja Tamu",
    tagline: "Meja tamu berkualitas tinggi untuk kenyamanan pengguna.",
    category: "living",
    basePrice: 2800000,
    description: "Meja tamu kayu jati perhutani serbaguna untuk menata buku, tanaman hias, dan koleksi aksoris interior rumah.",
    material: "Kayu Jati Perhutani",
    materials: [
      { id: "teak", name: "Kayu Jati Perhutani", description: "Rangka dan ambalan kayu jati perhutani oven berdaya tahan tinggi.", priceMultiplier: 1.0 }
    ],
    finishing: "Finishing Alami Kayu",
    model3D: "/models/asset 3D/rak.glb",
    modelType: "bookshelf",
    image: "/models/asset foto/rakdapur1.png",
    gallery: [
      "/models/asset foto/rakdapur1.png",
      "/models/asset foto/rakdapur2.png",
      "/models/asset foto/rakdapur3.png"
    ],
    productionTime: "14 - 20 Hari",
    length: { min: 60, max: 200, default: 100, step: 5 },
    width: { min: 30, max: 60, default: 40, step: 2 },
    height: { min: 100, max: 220, default: 160, step: 5 },
    recommendedDimensions: { length: 100, width: 40, height: 160 }
  },
  // {
  //   id: "rak-modular-tingkat-08",
  //   name: "Rak Modular Tingkat (Open Bookshelf)",
  //   tagline: "Rak buku & sekat ruangan kayu bertingkat berkapasitas besar.",
  //   category: "storage",
  //   basePrice: 3100000,
  //   description: "Rak kayu bertingkat arsitektural yang cocok digunakan sebagai pemisah ruangan (room divider) maupun tempat penyimpanan utama.",
  //   material: "Kayu Jati Perhutani",
  //   materials: [
  //     { id: "teak", name: "Kayu Jati Perhutani", description: "Struktur kayu jati perhutani tebal yang kokoh dan seimbang.", priceMultiplier: 1.0 }
  //   ],
  //   finishing: "Finishing Alami Kayu",
  //   model3D: "/models/asset 3D/rak1.glb",
  //   modelType: "bookshelf",
  //   image: "/models/asset foto/mejarias1.png",
  //   gallery: [
  //     "/models/asset foto/mejarias1.png",
  //     "/models/asset foto/mejarias2.png",
  //     "/models/asset foto/mejarias3.png"
  //   ],
  //   productionTime: "14 - 21 Hari",
  //   length: { min: 80, max: 240, default: 120, step: 5 },
  //   width: { min: 30, max: 65, default: 40, step: 2 },
  //   height: { min: 120, max: 240, default: 180, step: 5 },
  //   recommendedDimensions: { length: 120, width: 40, height: 180 }
  // }
];

export function getProductById(id: string): Product | undefined {
  return STATIC_PRODUCTS.find(p => p.id === id);
}
