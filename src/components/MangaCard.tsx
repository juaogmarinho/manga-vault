'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function MangaCard({ manga }: { manga: any }) {
  return (
    <div className="card-21 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <Link href={`/manga/${manga.id}`}>
        <div className="relative h-64 bg-black/5">
          {manga.coverPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={manga.coverPath} alt={`${manga.title} cover`} className="object-cover h-full w-full" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Sem preview</div>
          )}

          <div className="absolute left-3 top-3 bg-[rgba(0,0,0,0.4)] px-2 py-1 rounded text-xs">{manga.totalPages} páginas</div>
          <div className="absolute right-3 top-3">
            <button title="Favoritar" className="p-2 bg-[rgba(0,0,0,0.35)] rounded"><Heart size={16} /></button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{manga.title}</h3>
        <div className="text-sm lead mt-1">Adicionado em {new Date(manga.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  );
}
