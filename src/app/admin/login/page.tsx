'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChairLogo } from '../../../components/ui/ChairLogo';
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Harap masukkan email dan password admin.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Login gagal. Periksa kembali email dan password Anda.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan jaringan saat berusaha login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-warm-border/80 p-8 shadow-elevated space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-wood text-white mx-auto flex items-center justify-center shadow-md p-2">
            <ChairLogo className="w-11 h-11 text-white" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest font-bold text-wood-medium">PORTAL ADMIN MEBEL</span>
            <h1 className="text-2xl font-serif font-bold text-charcoal-900">
              Bali Moon Furniture
            </h1>
          </div>
          <p className="text-xs text-warm-gray">
            Masuk ke panel admin untuk mengelola pesanan & status produksi mebel custom.
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm mb-0.5">Gagal Masuk</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-wood-medium" />
              <span>Email Admin</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@balimoon.com"
              className="w-full p-3.5 rounded-xl bg-cream-50 border border-warm-border text-sm text-charcoal-900 placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-wood-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-wood-medium" />
              <span>Kata Sandi</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3.5 pr-11 rounded-xl bg-cream-50 border border-warm-border text-sm text-charcoal-900 placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-wood-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal-900"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-charcoal-900 hover:bg-wood text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memverifikasi Admin...</span>
              </>
            ) : (
              <>
                <span>MASUK KE DASHBOARD</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-warm-gray border-t border-warm-border/60 pt-4">
          Default Dev Credentials: <code className="bg-cream-200 px-1.5 py-0.5 rounded text-charcoal-900 font-mono">admin@balimoon.com</code> / <code className="bg-cream-200 px-1.5 py-0.5 rounded text-charcoal-900 font-mono">balimoon2026</code>
        </div>

      </div>
    </div>
  );
}
