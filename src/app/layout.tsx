import type { Metadata } from 'next';
import { Poppins, Space_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppBubble from '../components/ui/WhatsAppBubble';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bali Moon Furniture | Custom Made-to-Request Furniture & 3D Visualizer',
  description: 'Design bespoke solid wood furniture tailored to your exact room dimensions. Interactive real-time 3D preview, master timber craftsmanship, and made-to-order quality.',
  keywords: 'custom furniture, solid wood furniture, bespoke dining table, 3D furniture customizer, furniture made to order, teak wood table',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${poppins.variable} ${spaceMono.variable}`}
    >
      <body className="bg-cream-100 text-charcoal-900 flex flex-col min-h-screen antialiased selection:bg-wood/20 selection:text-wood-dark font-sans">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppBubble />
      </body>
    </html>
  );
}
