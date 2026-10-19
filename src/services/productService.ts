import { Product } from '../types/furniture';
import { STATIC_PRODUCTS } from '../data/products';

const PRODUCTS_CACHE_KEY = 'balimoon_products_override_v1';

export const SLUG_TO_UUID: Record<string, string> = {
  'kursi-kayu-01': 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'sofa-single-02': 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'dipan-tempat-tidur-03': 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'lemari-pakaian-04': 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
  'meja-kecil-coffee-05': 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
  'meja-tinggi-makan-06': 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
  'meja-pendek-panjang-07': '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
};

export const UUID_TO_SLUG: Record<string, string> = {
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': 'kursi-kayu-01',
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22': 'sofa-single-02',
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33': 'dipan-tempat-tidur-03',
  'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44': 'lemari-pakaian-04',
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55': 'meja-kecil-coffee-05',
  'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66': 'meja-tinggi-makan-06',
  '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77': 'meja-pendek-panjang-07',
};

export interface ProductOverride {
  id: string; // can be slug or uuid
  name: string;
  description: string;
  basePrice: number;
}

/**
 * Get locally stored overrides from localStorage (if any)
 */
export function getLocalProductOverrides(): Record<string, ProductOverride> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PRODUCTS_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save product override to localStorage for instantaneous client cache
 */
export function saveLocalProductOverride(override: ProductOverride): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalProductOverrides();
    // store by both slug and uuid if available
    const slug = UUID_TO_SLUG[override.id] || override.id;
    const uuid = SLUG_TO_UUID[override.id] || override.id;
    current[slug] = { ...override, id: slug };
    current[uuid] = { ...override, id: uuid };
    localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(current));

    // Dispatch event so other components listening re-render
    window.dispatchEvent(new CustomEvent('balimoon_products_updated', { detail: override }));
  } catch (e) {
    console.error('Failed to save product override:', e);
  }
}

/**
 * Merge a single product with local override
 */
export function applyProductOverride(product: Product): Product {
  const overrides = getLocalProductOverrides();
  const override = overrides[product.id] || (product.id ? overrides[SLUG_TO_UUID[product.id] || ''] : undefined);
  if (!override) return product;

  return {
    ...product,
    name: override.name ?? product.name,
    description: override.description ?? product.description,
    basePrice: override.basePrice !== undefined ? Number(override.basePrice) : product.basePrice,
  };
}

/**
 * Get all products merged with local cache
 */
export function getCachedProducts(): Product[] {
  return STATIC_PRODUCTS.map(applyProductOverride);
}

/**
 * Fetch products from API (and Supabase)
 */
export async function fetchCatalogProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.products)) {
        // Cache them in localStorage
        if (typeof window !== 'undefined') {
          json.products.forEach((p: Product) => {
            saveLocalProductOverride({
              id: p.id,
              name: p.name,
              description: p.description,
              basePrice: p.basePrice,
            });
          });
        }
        return json.products;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch products from API, using cached/static:', err);
  }
  return getCachedProducts();
}

/**
 * Update product via API
 */
export async function updateCatalogProduct(
  id: string,
  payload: { name: string; description: string; basePrice: number }
): Promise<{ success: boolean; message?: string; product?: Product }> {
  try {
    const res = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...payload }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      // Update local storage
      saveLocalProductOverride({
        id,
        name: payload.name,
        description: payload.description,
        basePrice: payload.basePrice,
      });
      return { success: true, message: data.message || 'Produk berhasil diperbarui.', product: data.product };
    }
    return { success: false, message: data.message || 'Gagal memperbarui produk.' };
  } catch (err: any) {
    console.error('Update catalog product error:', err);
    return { success: false, message: 'Terjadi kesalahan saat menyimpan perubahan produk.' };
  }
}
