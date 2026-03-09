import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Providers } from './Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sports Calendar – F1, Calcio & NBA',
  description: 'Il tuo calendario personale per Formula 1, Juventus, Palermo e Lakers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
