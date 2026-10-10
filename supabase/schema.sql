-- ================================================================
-- BALI MOON FURNITURE - SUPABASE DATABASE SCHEMA MIGRATION SCRIPT
-- (Berbasis skema struktur user dengan penyesuaian RLS & Seed Data)
-- ================================================================

-- 1. TABEL ADMIN PROFILES (Terhubung dengan Supabase Auth)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABEL PRODUK
CREATE TABLE IF NOT EXISTS public.produk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  deskripsi TEXT,
  harga_dasar NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (harga_dasar >= 0),
  gambar_url TEXT,
  model_3d_url TEXT,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABEL PELANGGAN
CREATE TABLE IF NOT EXISTS public.pelanggan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  no_whatsapp TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABEL PESANAN
CREATE TABLE IF NOT EXISTS public.pesanan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_pesanan TEXT NOT NULL UNIQUE,
  pelanggan_id UUID NOT NULL REFERENCES public.pelanggan(id),
  produk_id UUID NOT NULL REFERENCES public.produk(id),
  panjang NUMERIC(10,2) NOT NULL CHECK (panjang > 0),
  lebar NUMERIC(10,2) NOT NULL CHECK (lebar > 0),
  tinggi NUMERIC(10,2) NOT NULL CHECK (tinggi > 0),
  satuan_ukuran TEXT NOT NULL DEFAULT 'cm' CHECK (satuan_ukuran IN ('cm', 'mm', 'm')),
  catatan TEXT,
  estimasi_harga NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (estimasi_harga >= 0),
  harga_final NUMERIC(14,2) CHECK (harga_final IS NULL OR harga_final >= 0),
  status TEXT NOT NULL DEFAULT 'menunggu_konfirmasi' CHECK (status IN (
    'menunggu_konfirmasi',
    'menunggu_persetujuan_harga',
    'dalam_produksi',
    'finishing',
    'siap_dikirim',
    'selesai',
    'dibatalkan'
  )),
  token_tracking UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABEL RIWAYAT STATUS
CREATE TABLE IF NOT EXISTS public.riwayat_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pesanan_id UUID NOT NULL REFERENCES public.pesanan(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN (
    'menunggu_konfirmasi',
    'menunggu_persetujuan_harga',
    'dalam_produksi',
    'finishing',
    'siap_dikirim',
    'selesai',
    'dibatalkan'
  )),
  catatan TEXT,
  diubah_oleh UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. INDEKS UNTUK PERFORMA QUERY
CREATE INDEX IF NOT EXISTS idx_pesanan_pelanggan ON public.pesanan(pelanggan_id);
CREATE INDEX IF NOT EXISTS idx_pesanan_produk ON public.pesanan(produk_id);
CREATE INDEX IF NOT EXISTS idx_pesanan_status ON public.pesanan(status);
CREATE INDEX IF NOT EXISTS idx_pesanan_created_at ON public.pesanan(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_riwayat_pesanan ON public.riwayat_status(pesanan_id, created_at DESC);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pelanggan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riwayat_status ENABLE ROW LEVEL SECURITY;

-- Helper Function is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Policy Publik: Katalog Produk Aktif
DROP POLICY IF EXISTS "Publik melihat produk aktif" ON public.produk;
CREATE POLICY "Publik melihat produk aktif" ON public.produk
FOR SELECT TO anon, authenticated USING (aktif = TRUE);

-- Policy Publik: Pelanggan & Pesanan (Agar Pelanggan bisa melakukan order via API/Anon)
DROP POLICY IF EXISTS "Publik membuat pelanggan" ON public.pelanggan;
CREATE POLICY "Publik membuat pelanggan" ON public.pelanggan FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Publik membuat pesanan" ON public.pesanan;
CREATE POLICY "Publik membuat pesanan" ON public.pesanan FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Publik lacak pesanan" ON public.pesanan;
CREATE POLICY "Publik lacak pesanan" ON public.pesanan FOR SELECT USING (true);

DROP POLICY IF EXISTS "Publik membaca riwayat status" ON public.riwayat_status;
CREATE POLICY "Publik membaca riwayat status" ON public.riwayat_status FOR SELECT USING (true);

-- Policy Admin
DROP POLICY IF EXISTS "Admin melihat profil admin" ON public.admin_profiles;
CREATE POLICY "Admin melihat profil admin" ON public.admin_profiles FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin melihat semua produk" ON public.produk;
CREATE POLICY "Admin melihat semua produk" ON public.produk FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin menambah produk" ON public.produk;
CREATE POLICY "Admin menambah produk" ON public.produk FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin mengubah produk" ON public.produk;
CREATE POLICY "Admin mengubah produk" ON public.produk FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin menghapus produk" ON public.produk;
CREATE POLICY "Admin menghapus produk" ON public.produk FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin melihat pelanggan" ON public.pelanggan;
CREATE POLICY "Admin melihat pelanggan" ON public.pelanggan FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin melihat pesanan" ON public.pesanan;
CREATE POLICY "Admin melihat pesanan" ON public.pesanan FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin mengubah pesanan" ON public.pesanan;
CREATE POLICY "Admin mengubah pesanan" ON public.pesanan FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin melihat riwayat status" ON public.riwayat_status;
CREATE POLICY "Admin melihat riwayat status" ON public.riwayat_status FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admin menambah riwayat status" ON public.riwayat_status;
CREATE POLICY "Admin menambah riwayat status" ON public.riwayat_status FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- 8. SEED DATA PRODUK MEBEL (7 PRODUK UTAMA)
INSERT INTO public.produk (id, nama, deskripsi, harga_dasar, gambar_url, model_3d_url, aktif)
VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Meja Rias Minimalis', 'Meja rias kayu jati perhutani pilihan dengan cermin dan laci penyimpanan yang rapi.', 1800000, '/models/asset foto/mejarias1.png', '/models/asset 3D/mejarias.glb', TRUE),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Kursi Sofa Custom (Chair Sofa)', 'Kursi sofa santai berbahan rangka kayu jati perhutani dengan bantalan empuk.', 2400000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80', '/models/asset 3D/chairsofa.glb', TRUE),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Dipan Tempat Tidur Jati (Bed Frame)', 'Tempat tidur kayu jati perhutani dengan konstruksi sambungan kayu presisi yang sangat kuat.', 4500000, '/models/asset foto/dipan1.png', '/models/asset 3D/dipann.glb', TRUE),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Lemari Sleding 2 Pintu', 'Lemari kayu jati perhutani dengan kapasitas luas, pintu kayu presisi, dan rak penyimpanan.', 3800000, '/models/asset foto/lemari1.png', '/models/asset 3D/lemarisleding.glb', TRUE),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Meja Nakas', 'Meja kecil serbaguna dengan permukaan kayu halus dan desain minimalis.', 1500000, '/models/asset foto/nakas1.png', '/models/asset 3D/nakas.glb', TRUE),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Meja Makan Tinggi', 'Meja makan kayu tinggi dengan papan kayu tebal untuk keluarga.', 3200000, '/models/asset foto/mejapendek1.png', '/models/asset 3D/mejatinggi.glb', TRUE),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Meja Tamu', 'Meja tamu kayu jati perhutani serbaguna untuk menata buku dan dekorasi.', 2800000, '/models/asset foto/rakdapur1.png', '/models/asset 3D/rak.glb', TRUE)
ON CONFLICT (id) DO UPDATE SET
  nama = EXCLUDED.nama,
  deskripsi = EXCLUDED.deskripsi,
  harga_dasar = EXCLUDED.harga_dasar,
  gambar_url = EXCLUDED.gambar_url,
  model_3d_url = EXCLUDED.model_3d_url,
  aktif = EXCLUDED.aktif;
