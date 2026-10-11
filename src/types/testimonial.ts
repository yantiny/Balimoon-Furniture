export interface Testimonial {
  id: string;
  nama: string;
  kota: string;
  produk_nama: string;
  rating: number; // 1 to 5
  komentar: string;
  created_at: string;
  terverifikasi?: boolean;
}

export interface CreateTestimonialInput {
  nama: string;
  kota?: string;
  produk_nama?: string;
  rating: number;
  komentar: string;
}
