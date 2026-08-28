'use client';

import React, { useEffect, useState } from 'react';
import UploadDropzone from '../components/UploadDropzone';
import MangaCard from '../components/MangaCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function HomePage() {
  const [query, setQuery] = useState('');
  const { data, mutate } = useSWR('/api/mangas?q=' + encodeURIComponent(query), fetcher);

  useEffect(() => {
    mutate();
  }, [query]);

  return (
    <div>
      <section className="mb-6">
        <div className="card-21 p-6 flex items-center justify-between">
          <div>
            <h1 className="h1-21">MangaVault</h1>
            <p className="lead">Envie, organize e leia seus mangás em PDF — rápido e limpo.</p>
          </div>
          <div className="text-right">
            <div className="text-sm lead">Total: <strong>{data?.mangas?.length ?? 0}</strong></div>
            <div className="text-xs text-gray-400 mt-1">Tema: 21st.dev inspired</div>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <UploadDropzone onUploadComplete={() => mutate()} />
      </section>

      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <input value={query} onChange={e => setQuery(e.target.value)} className="w-full p-2 rounded bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]" placeholder="Buscar por título..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.mangas ? (
            data.mangas.length ? data.mangas.map((m: any) => <MangaCard key={m.id} manga={m} />) : <div className="col-span-full text-center text-gray-400">Nenhum mangá encontrado</div>
          ) : (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-21 p-4 skeleton pulse" style={{ height: 320 }} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
