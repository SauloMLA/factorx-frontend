import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import AppLayoutWrapper from '@/components/layout/app-layout-wrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'FactorCore | Terminal Originación',
  description: 'Portal de administración y originación de factoraje corporativo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground font-sans antialiased transition-colors duration-200" suppressHydrationWarning>
        <Providers>
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
          <Toaster position="top-right" closeButton />
        </Providers>
      </body>
    </html>
  );
}
