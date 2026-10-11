import { Testimonial, CreateTestimonialInput } from '../types/testimonial';
import { INITIAL_TESTIMONIALS } from '../data/testimonials';
import { supabase } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'balimoon_testimonials';
const DELETED_IDS_KEY = 'balimoon_deleted_testimonials';
const EVENT_ADDED = 'balimoon_testimonial_updated';
const EVENT_DELETED = 'balimoon_testimonial_deleted';

/**
 * Retrieve list of deleted testimonial IDs to prevent reappearing
 */
export function getDeletedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Mark a testimonial ID as deleted
 */
export function addDeletedId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const ids = getDeletedIds();
    if (!ids.includes(id)) {
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify([...ids, id]));
    }
  } catch (err) {
    console.error('Error saving deleted id to localStorage:', err);
  }
}

/**
 * Retrieve local testimonials stored in browser
 */
export function getLocalTestimonials(): Testimonial[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading testimonials from localStorage:', err);
    return [];
  }
}

/**
 * Helper to normalize string for duplicate detection
 */
function createFingerprint(t: { nama?: string; komentar?: string; produk_nama?: string }): string {
  const n = (t.nama || '').trim().toLowerCase();
  const k = (t.komentar || '').trim().toLowerCase();
  const p = (t.produk_nama || '').trim().toLowerCase();
  return `${n}___${p}___${k}`;
}

/**
 * Save testimonial to local storage (strictly prevents duplicates)
 */
export function saveLocalTestimonial(testi: Testimonial): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalTestimonials();
    const targetFingerprint = createFingerprint(testi);

    // Remove any item that matches either the same ID OR the same content fingerprint
    const filtered = existing.filter(
      (item) => item.id !== testi.id && createFingerprint(item) !== targetFingerprint
    );

    const updated = [testi, ...filtered];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event for real-time reactive sync across components
    window.dispatchEvent(new CustomEvent(EVENT_ADDED, { detail: testi }));
  } catch (err) {
    console.error('Error saving testimonial to localStorage:', err);
  }
}

/**
 * Fetch all testimonials (combines Supabase API, localStorage, and defaults without duplicates)
 */
export async function fetchAllTestimonials(): Promise<Testimonial[]> {
  let apiTestimonials: Testimonial[] = [];

  try {
    const res = await fetch('/api/testimonials', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        apiTestimonials = data.data;
      }
    }
  } catch (err) {
    console.warn('API /api/testimonials unreachable, falling back to local storage:', err);
  }

  const deletedIds = new Set(getDeletedIds());
  const localItems = getLocalTestimonials();

  // Deduplicate by content fingerprint and ID
  const fingerprintMap = new Map<string, Testimonial>();

  // 1. Initial defaults (skip any deleted by admin)
  INITIAL_TESTIMONIALS.forEach((t) => {
    if (!deletedIds.has(t.id)) {
      fingerprintMap.set(createFingerprint(t), t);
    }
  });

  // 2. Locally submitted items
  localItems.forEach((t) => {
    if (!deletedIds.has(t.id)) {
      fingerprintMap.set(createFingerprint(t), t);
    }
  });

  // 3. API items from Supabase (take highest authority)
  apiTestimonials.forEach((t) => {
    if (!deletedIds.has(t.id)) {
      fingerprintMap.set(createFingerprint(t), t);
    }
  });

  const all = Array.from(fingerprintMap.values());

  // Sort descending by created_at
  all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return all;
}

/**
 * Submit a new testimonial in real-time (prevents double input)
 */
export async function submitTestimonial(input: CreateTestimonialInput): Promise<{ success: boolean; data?: Testimonial; message?: string }> {
  const now = new Date().toISOString();

  const payload = {
    nama: input.nama.trim(),
    kota: input.kota?.trim() || 'Indonesia',
    produk_nama: input.produk_nama?.trim() || 'Mebel Custom',
    rating: Math.min(5, Math.max(1, Number(input.rating) || 5)),
    komentar: input.komentar.trim(),
    created_at: now,
    terverifikasi: true,
  };

  // 1. Try to send to API / Supabase first
  try {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        // Save ONLY the server record with verified ID
        saveLocalTestimonial(data.data);
        return { success: true, data: data.data };
      }
    }
  } catch (err) {
    console.warn('Network issue saving testimonial to Supabase API, local copy preserved:', err);
  }

  // 2. Fallback if offline or API unreachable: save only 1 local record
  const fallbackItem: Testimonial = {
    id: 'testi-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...payload,
  };
  saveLocalTestimonial(fallbackItem);

  return { success: true, data: fallbackItem };
}

/**
 * Delete a testimonial (admin action)
 */
export async function deleteTestimonial(id: string): Promise<{ success: boolean; message: string }> {
  // 1. Add to deleted tracking list
  addDeletedId(id);

  // 2. Remove from local storage
  if (typeof window !== 'undefined') {
    try {
      const existing = getLocalTestimonials();
      const updated = existing.filter((item) => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Error removing from localStorage:', err);
    }
  }

  // 3. Send DELETE request to API / Supabase
  try {
    const res = await fetch(`/api/testimonials?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      console.warn('API delete request did not return ok, local record was removed.');
    }
  } catch (err) {
    console.warn('Network issue deleting testimonial from server:', err);
  }

  // 4. Broadcast deleted event to real-time subscribers
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_DELETED, { detail: { id } }));
  }

  return { success: true, message: 'Testimoni berhasil dihapus.' };
}

/**
 * Listen for real-time testimonial updates (additions and deletions)
 */
export function onTestimonialUpdate(
  onAdd: (newTesti: Testimonial) => void,
  onDelete?: (deletedId: string) => void
): () => void {
  if (typeof window === 'undefined') return () => { };

  const handleAddEvent = (e: Event) => {
    const custom = e as CustomEvent<Testimonial>;
    if (custom.detail) {
      onAdd(custom.detail);
    }
  };

  const handleDeleteEvent = (e: Event) => {
    const custom = e as CustomEvent<{ id: string }>;
    if (custom.detail && onDelete) {
      onDelete(custom.detail.id);
    }
  };

  window.addEventListener(EVENT_ADDED, handleAddEvent);
  window.addEventListener(EVENT_DELETED, handleDeleteEvent);

  // Also listen to Supabase Realtime channel if available
  let channel: any = null;
  if (supabase) {
    try {
      channel = supabase
        .channel('public:testimoni')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'testimoni' }, (payload) => {
          if (payload.new) {
            const item: Testimonial = {
              id: payload.new.id,
              nama: payload.new.nama,
              kota: payload.new.kota || 'Indonesia',
              produk_nama: payload.new.produk_nama || 'Mebel Custom',
              rating: payload.new.rating || 5,
              komentar: payload.new.komentar,
              created_at: payload.new.created_at,
              terverifikasi: payload.new.terverifikasi ?? true,
            };
            onAdd(item);
          }
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'testimoni' }, (payload) => {
          if (payload.old && payload.old.id && onDelete) {
            onDelete(payload.old.id);
          }
        })
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription not active:', e);
    }
  }

  return () => {
    window.removeEventListener(EVENT_ADDED, handleAddEvent);
    window.removeEventListener(EVENT_DELETED, handleDeleteEvent);
    if (channel && supabase) {
      supabase.removeChannel(channel);
    }
  };
}
