import React from 'react';
import Link from 'next/link';
import { Moon, Search, UploadCloud } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">MV</div>
          <div>
            <div className="text-lg font-bold">MangaVault</div>
            <div className="text-xs lead">Sua biblioteca de mangás</div>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-lg px-3 py-1 gap-2">
          <Search size={16} className="text-gray-300" />
          <input placeholder="Buscar mangás..." className="bg-transparent outline-none text-sm text-gray-200" />
        </div>

        <Link href="/" className="btn-ghost hidden sm:inline-flex">Biblioteca</Link>
        <button className="btn-21 flex items-center gap-2"><UploadCloud size={16} /> Upload</button>
        <button aria-label="toggle-theme" className="p-2 rounded bg-[rgba(255,255,255,0.02)]"><Moon size={16} /></button>
      </div>
    </header>
  );
}
