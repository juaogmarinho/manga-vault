'use client';

import React, { useCallback, useState, useRef } from 'react';
import { Cloud, Loader2 } from 'lucide-react';

export default function UploadDropzone({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (!files.length) return alert('Apenas PDFs são aceitos');
    await uploadFiles(files);
  }, []);

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files).filter(f => f.type === 'application/pdf') : [];
    if (!files.length) return;
    await uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    try {
      setUploading(true);
      setProgress(10);
      const form = new FormData();
      files.forEach(f => form.append('files', f));

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      // simple progress simulation
      for (let i = 20; i <= 100; i += 20) {
        await new Promise(r => setTimeout(r, 120));
        setProgress(i);
      }
      setUploading(false);
      setTimeout(() => setProgress(0), 600);
      onUploadComplete && onUploadComplete();
      return data;
    } catch (err) {
      setUploading(false);
      setProgress(0);
      alert('Falha no upload');
    }
  };

  return (
    <div>
      <div onDragOver={e => e.preventDefault()} onDrop={onDrop} className="card-21 p-5 flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/3 flex items-center justify-center p-3 rounded-lg bg-[rgba(255,255,255,0.01)]">
          <Cloud size={48} className="text-gray-300" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Arraste e solte seus PDFs</div>
              <div className="text-sm lead">Suporte a upload múltiplo — arquivos são armazenados em /public/uploads</div>
            </div>

            <div className="flex items-center gap-2">
              <button className="btn-ghost" onClick={() => inputRef.current?.click()}>Selecionar</button>
              <button className="btn-21" onClick={() => inputRef.current?.click()}>{uploading ? <Loader2 className="animate-spin" /> : 'Upload'}</button>
            </div>
          </div>

          <input ref={inputRef} type="file" accept="application/pdf" multiple onChange={onSelect} className="hidden" />

          {uploading && (
            <div className="mt-3 bg-[rgba(255,255,255,0.02)] rounded overflow-hidden h-3">
              <div style={{ width: `${progress}%` }} className="bg-[var(--accent)] h-full transition-all" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
