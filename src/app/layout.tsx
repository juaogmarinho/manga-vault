import '../styles/globals.css';
import React from 'react';
import Header from '../components/header';

export const metadata = {
  title: 'MangaVault',
  description: 'Ler e gerenciar mangás em PDF'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">
        <div className="container-21">
          <Header />
          <main className="mt-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
