import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Providers } from './Providers';

export const metadata = {
  title: 'Sports Calendar – F1, Calcio & NBA',
  description: 'Il tuo calendario personale per Formula 1, Juventus, Palermo e Lakers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
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
