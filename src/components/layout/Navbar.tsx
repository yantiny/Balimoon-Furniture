'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hammer, Menu, X, Compass, Box, SlidersHorizontal, Search } from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Beranda', icon: Compass },
    { href: '/furniture', label: 'Katalog Mebel', icon: Box },
    { href: '/customize/kursi-kayu-01', label: 'Kustomisasi 3D', icon: SlidersHorizontal },

    { href: '/track', label: 'Cek Pesanan', icon: Search },
  ];


  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-cream-100/90 backdrop-blur-md border-b border-warm-border/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-wood text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <Hammer className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-charcoal-900 group-hover:text-wood transition-colors">
                BALIMOON FURNITURE
              </span>
              <span className="text-[10px] tracking-widest uppercase font-medium text-wood-medium">
                Mebel Kayu Custom
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-wood-medium text-white shadow-sm'
                      : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-200/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Header Action */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/furniture"
              className="px-5 py-2.5 rounded-xl bg-charcoal-900 text-cream-100 hover:bg-wood hover:text-white transition-all text-sm font-medium shadow-sm hover:shadow"
            >
              Pesan Custom
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-charcoal-700 hover:bg-cream-200 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-warm-border/80 bg-cream-100/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  active
                    ? 'bg-wood-medium text-white shadow-sm'
                    : 'text-charcoal-700 hover:bg-cream-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/furniture"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block px-4 py-3 rounded-xl bg-charcoal-900 text-white font-medium shadow-sm"
            >
              Lihat Katalog & Kustomisasi
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
