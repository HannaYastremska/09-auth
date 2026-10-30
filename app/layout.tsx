import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import TanStackProvider from '../components/TanStackProvider/TanStackProvider';
import AuthProvider from '../components/AuthProvider/AuthProvider';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './globals.css';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NoteHub - Manage Your Notes',
  description: 'A simple and efficient application designed for managing personal notes.',
  openGraph: {
    title: 'NoteHub - Manage Your Notes',
    description: 'A simple and efficient application designed for managing personal notes.',
    url: 'https://notehub.com',
    images: [
      {
        url: 'https://goit.global',
        width: 1200,
        height: 630,
        alt: 'NoteHub Banner',
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className} suppressHydrationWarning>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <div id="root-layout">
              {}
              {children}
              {modal}
            </div>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
