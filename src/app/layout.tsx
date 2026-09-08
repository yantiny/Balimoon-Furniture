import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Balimoon Furniture | Custom Made-to-Request Furniture & 3D Visualizer',
  description: 'Design bespoke solid wood furniture tailored to your exact room dimensions. Interactive real-time 3D preview, master timber craftsmanship, and made-to-order quality.',
  keywords: 'custom furniture, solid wood furniture, bespoke dining table, 3D furniture customizer, furniture made to order, teak wood table',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-cream-100 text-charcoal-900 flex flex-col min-h-screen antialiased selection:bg-wood/20 selection:text-wood-dark">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
