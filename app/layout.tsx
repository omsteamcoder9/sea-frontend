import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import HeaderWrapper from '@/components/ui/HeaderWrapper';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

// 🎯 Static images base URL (R2)
const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={`${STATIC_URL}/logoo.webp`} type="image/png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <HeaderWrapper />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}