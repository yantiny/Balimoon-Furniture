'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { STATIC_PRODUCTS, getProductById } from '../../../data/products';
import { calculateEstimatedPrice } from '../../../utils/pricing';
import { submitOrderRequest } from '../../../services/n8nService';
import { FurnitureCanvas } from '../../../components/3d/FurnitureCanvas';
import { PriceEstimateWidget } from '../../../components/ui/PriceEstimateWidget';
import { CustomizationState } from '../../../types/furniture';
import {
  SlidersHorizontal,
  Ruler,
  Info,
  Send,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  FileText
} from 'lucide-react';

export default function CustomizerPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || 'kursi-kayu-01';


  const product = useMemo(() => {
    return getProductById(productId) || STATIC_PRODUCTS[0];
  }, [productId]);

  // Form State
  const [length, setLength] = useState<number>(product.length.default);
  const [width, setWidth] = useState<number>(product.width.default);
  const [height, setHeight] = useState<number>(product.height.default);
  const [selectedMaterial, setSelectedMaterial] = useState<string>(product.materials[0]?.id || 'teak');
  const [additionalRequest, setAdditionalRequest] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<string>('');

  // Customer Info State
  const [customerName, setCustomerName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync state when product changes
  useEffect(() => {
    setLength(product.length.default);
    setWidth(product.width.default);
    setHeight(product.height.default);
    if (product.materials[0]) {
      setSelectedMaterial(product.materials[0].id);
    }
  }, [product]);

  // Validation logic
  const isLengthValid = length >= product.length.min && length <= product.length.max;
  const isWidthValid = width >= product.width.min && width <= product.width.max;
  const isHeightValid = height >= product.height.min && height <= product.height.max;
  const isFormValid = isLengthValid && isWidthValid && isHeightValid;

  // Price Calculation
  const selectedMaterialObj = product.materials.find(m => m.id === selectedMaterial);
  const priceCalculation = useMemo(() => {
    return calculateEstimatedPrice(product, length, width, height, selectedMaterial);
  }, [product, length, width, height, selectedMaterial]);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isFormValid) {
      setFormError('Harap pastikan semua ukuran berada dalam batas minimum dan maksimum yang diizinkan.');
      return;
    }

    if (!customerName || !whatsapp || !email || !address) {
      setFormError('Harap lengkapi semua kolom informasi pelanggan.');
      return;
    }

    setIsSubmitting(true);

    try {
      const customizationData: CustomizationState = {
        productId: product.id,
        productName: product.name,
        length,
        width,
        height,
        selectedMaterial: selectedMaterialObj ? selectedMaterialObj.name : product.material,
        finishing: product.finishing,
        additionalRequest,
        referenceImage,
        customerName,
        whatsapp,
        email,
        address
      };

      const result = await submitOrderRequest(customizationData);


      if (result.success) {
        const finalId = result.data?.orderId || result.data?.["Id-Pemesanan"] || '';
        if (finalId) {
          router.push(`/order-success?orderId=${encodeURIComponent(finalId)}`);
        } else {
          setFormError('Pesanan berhasil dikirim tetapi ID Pesanan tidak diterima dari server n8n.');
        }
      } else {
        setFormError(result.message || 'Gagal mengirim pesanan. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setFormError('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-warm-border/60">
        <div>
          <div className="flex items-center gap-2 text-xs text-warm-gray mb-1">
            <Link href="/furniture" className="hover:text-charcoal-900 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>Katalog</span>
            </Link>
            <span>/</span>
            <span className="text-charcoal-900 font-semibold">Kustomisasi {product.name}</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-charcoal-900">
            Kustomisasi 3D Mebel Kayu
          </h1>
        </div>

        {/* Product Selector Switcher Dropdown */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-warm-border shadow-sm">
          <span className="text-xs font-semibold text-warm-gray uppercase tracking-wider">Model:</span>
          <select
            value={product.id}
            onChange={(e) => router.push(`/customize/${e.target.value}`)}
            className="bg-transparent font-serif font-bold text-charcoal-900 text-sm focus:outline-none cursor-pointer"
          >
            {STATIC_PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TWO COLUMN SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* LEFT COLUMN: Interactive 3D Furniture Viewer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-warm-border/80 shadow-soft">

              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2 text-xs font-bold text-charcoal-900 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-wood-medium" />
                  <span>Tampilan 3D Real-Time</span>
                </div>
                <span className="text-[11px] font-mono bg-cream-200 px-2.5 py-0.5 rounded-full text-wood-dark font-medium">
                  {length} x {width} x {height} cm
                </span>
              </div>

              {/* R3F Interactive Canvas */}
              <FurnitureCanvas
                modelType={product.modelType}
                modelUrl={product.model3D}
                length={length}
                width={width}
                height={height}
                defaultLength={product.length.default}
                defaultWidth={product.width.default}
                defaultHeight={product.height.default}
                showDimensions={true}
              />


            </div>

            {/* Quick Helper Banner */}
            <div className="p-4 bg-cream-200/60 rounded-2xl border border-warm-border/60 text-xs text-charcoal-700 space-y-1">
              <p className="font-semibold text-charcoal-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-wood-medium" />
                <span>Perhitungan Proporsi Kayu Presisi</span>
              </p>
              <p className="text-warm-gray text-[11px] leading-relaxed">
                Ketebalan kaki meja dan sambungan kayu secara otomatis menyesuaikan proporsi struktur agar tetap kokoh saat ukuran diubah.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customization Form */}
        <div className="lg:col-span-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-warm-border/80 shadow-soft space-y-8">

            {/* 1. PRODUCT INFORMATION */}
            <div className="space-y-3 pb-6 border-b border-warm-border/60">
              <span className="text-xs uppercase font-bold tracking-widest text-wood-medium">Langkah 1</span>
              <h3 className="text-xl font-serif font-bold text-charcoal-900">{product.name}</h3>
              <p className="text-xs text-warm-gray leading-relaxed">{product.tagline}</p>
            </div>

            {/* 2. DIMENSION INPUTS */}
            <div className="space-y-6 pb-6 border-b border-warm-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-wood-medium" />
                  <h3 className="font-serif font-bold text-lg text-charcoal-900">Atur Ukuran Custom</h3>
                </div>
                <span className="text-xs text-warm-gray">Satuan: Centimeter (cm)</span>
              </div>

              {/* Length Slider & Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-charcoal-800">Panjang (P)</label>
                  <span className="text-warm-gray text-[11px]">Min: {product.length.min}cm | Max: {product.length.max}cm</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={product.length.min}
                    max={product.length.max}
                    step={product.length.step || 1}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="flex-1 accent-wood-medium h-2 bg-cream-200 rounded-lg cursor-pointer"
                  />
                  <div className="w-24 relative">
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className={`w-full px-3 py-2 rounded-xl text-sm font-mono font-bold text-center border focus:outline-none ${isLengthValid ? 'border-warm-border bg-cream-100 text-charcoal-900' : 'border-red-500 bg-red-50 text-red-700'
                        }`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-warm-gray font-mono">cm</span>
                  </div>
                </div>
                {!isLengthValid && (
                  <p className="text-[11px] text-red-600 font-medium">Panjang harus antara {product.length.min} cm dan {product.length.max} cm.</p>
                )}
              </div>

              {/* Width Slider & Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-charcoal-800">Lebar (L)</label>
                  <span className="text-warm-gray text-[11px]">Min: {product.width.min}cm | Max: {product.width.max}cm</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={product.width.min}
                    max={product.width.max}
                    step={product.width.step || 1}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="flex-1 accent-wood-medium h-2 bg-cream-200 rounded-lg cursor-pointer"
                  />
                  <div className="w-24 relative">
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className={`w-full px-3 py-2 rounded-xl text-sm font-mono font-bold text-center border focus:outline-none ${isWidthValid ? 'border-warm-border bg-cream-100 text-charcoal-900' : 'border-red-500 bg-red-50 text-red-700'
                        }`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-warm-gray font-mono">cm</span>
                  </div>
                </div>
                {!isWidthValid && (
                  <p className="text-[11px] text-red-600 font-medium">Lebar harus antara {product.width.min} cm dan {product.width.max} cm.</p>
                )}
              </div>

              {/* Height Slider & Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-charcoal-800">Tinggi (T)</label>
                  <span className="text-warm-gray text-[11px]">Min: {product.height.min}cm | Max: {product.height.max}cm</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={product.height.min}
                    max={product.height.max}
                    step={product.height.step || 1}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="flex-1 accent-wood-medium h-2 bg-cream-200 rounded-lg cursor-pointer"
                  />
                  <div className="w-24 relative">
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className={`w-full px-3 py-2 rounded-xl text-sm font-mono font-bold text-center border focus:outline-none ${isHeightValid ? 'border-warm-border bg-cream-100 text-charcoal-900' : 'border-red-500 bg-red-50 text-red-700'
                        }`}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-warm-gray font-mono">cm</span>
                  </div>
                </div>
                {!isHeightValid && (
                  <p className="text-[11px] text-red-600 font-medium">Tinggi harus antara {product.height.min} cm dan {product.height.max} cm.</p>
                )}
              </div>
            </div>

            {/* 3. MATERIAL (FIXED - KAYU JATI SOLID) */}
            <div className="space-y-3 pb-6 border-b border-warm-border/60">
              <h3 className="font-serif font-bold text-lg text-charcoal-900">Bahan Kayu</h3>
              <div className="p-4 bg-cream-200/70 rounded-xl border border-warm-border text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-charcoal-900">Kayu Jati Solid</span>
                  <span className="px-2 py-0.5 bg-wood/10 text-wood-dark text-[10px] font-bold rounded-full border border-wood/20">Standar</span>
                </div>
                <p className="text-warm-gray text-[11px]">
                  Semua produk dibuat menggunakan kayu Jati solid oven kelas premium dengan daya tahan maksimal dan keindahan serat kayu alami.
                </p>
              </div>
            </div>

            {/* 4. FINISHING (FIXED - NO DROPDOWN) */}
            <div className="space-y-3 pb-6 border-b border-warm-border/60">
              <h3 className="font-serif font-bold text-lg text-charcoal-900">Finishing</h3>
              <div className="p-4 bg-cream-200/70 rounded-xl border border-warm-border text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-charcoal-900">{product.finishing}</span>
                  <span className="px-2 py-0.5 bg-wood/10 text-wood-dark text-[10px] font-bold rounded-full border border-wood/20">Standar</span>
                </div>
                <p className="text-warm-gray text-[11px]">
                  Lapisan pelindung kayu alami ramah lingkungan. Pilihan warna khusus tidak tersedia untuk mempertahankan tekstur serat kayu asli.
                </p>
              </div>
            </div>

            {/* 5. CATATAN KHUSUS / INSTRUKSI CUSTOM */}
            <div className="space-y-3 pb-6 border-b border-warm-border/60">
              <h3 className="font-serif font-bold text-lg text-charcoal-900">Catatan Khusus</h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-charcoal-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-wood-medium" />
                  <span>Catatan Custom / Instruksi Khusus (Opsional)</span>
                </label>
                <textarea
                  rows={3}
                  value={additionalRequest}
                  onChange={(e) => setAdditionalRequest(e.target.value)}
                  placeholder="Contoh: Sudut meja dibuat membulat halus 10mm, lubang kabel di bagian belakang..."
                  className="w-full p-3 rounded-xl bg-cream-100 border border-warm-border text-xs text-charcoal-900 placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-wood-medium"
                />
              </div>
            </div>

            {/* 6. CUSTOMER INFORMATION */}
            <div className="space-y-4 pb-6 border-b border-warm-border/60">
              <h3 className="font-serif font-bold text-lg text-charcoal-900">Data Pemesan</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-wood-medium" />
                    <span>Nama Lengkap *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Budi Santoso"
                    className="w-full p-3 rounded-xl bg-cream-100 border border-warm-border text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-800 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-wood-medium" />
                    <span>Nomor WhatsApp *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="08123456789"
                    className="w-full p-3 rounded-xl bg-cream-100 border border-warm-border text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-800 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-wood-medium" />
                  <span>Alamat Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@example.com"
                  className="w-full p-3 rounded-xl bg-cream-100 border border-warm-border text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-wood-medium" />
                  <span>Alamat Pengiriman *</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Sudirman No. 12, Jakarta Selatan, DKI Jakarta..."
                  className="w-full p-3 rounded-xl bg-cream-100 border border-warm-border text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-wood-medium"
                />
              </div>
            </div>

            {/* 7. PRICE ESTIMATION WIDGET */}
            <PriceEstimateWidget
              calculation={priceCalculation}
              selectedMaterialName={selectedMaterialObj?.name}
              isSubmitting={isSubmitting}
            />

            {/* ERROR BANNER */}
            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full py-4 px-6 rounded-2xl text-base font-semibold transition-all shadow-md flex items-center justify-center gap-2 ${isFormValid && !isSubmitting
                ? 'bg-charcoal-900 hover:bg-wood text-white shadow-elevated'
                : 'bg-warm-gray/40 text-white cursor-not-allowed'
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses Pesanan & Mengirim Data...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 text-amber-400" />
                  <span>KIRIM PERMINTAAN KUSTOMISASI</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
