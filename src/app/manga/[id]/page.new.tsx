'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import useSWR from 'swr';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function MangaReader({ params }: { params: { id: string } }) {
  const { id } = params;
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [mode, setMode] = useState<'single'|'double'|'scroll'>('single');
  const [scale, setScale] = useState<number>(1.0);
  const saveTimer = useRef<number | null>(null);

  const { data: mangas } = useSWR('/api/mangas?q=', fetcher);

  useEffect(() => {
    if (mangas?.mangas) {
      const m = mangas.mangas.find((x: any) => String(x.id) === String(id));
      if (m) setFileUrl(m.filePath);
    }
  }, [mangas, id]);

  useEffect(() => {
    // load reading progress if exists
    async function loadProgress() {
      try {
        const res = await fetch('/api/reading?mangaId=' + id);
        const json = await res.json();
        if (json?.progress) {
          setPageNumber(json.progress.currentPage || 1);
        }
      } catch (e) {}
    }
    loadProgress();
  }, [id]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // save progress (debounced)
  useEffect(() => {
    if (!id) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      try {
        await fetch('/api/reading', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mangaId: Number(id), currentPage: pageNumber, percentage: Math.round((pageNumber / (numPages || 1)) * 100) }) });
      } catch (e) {}
    }, 800);
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [pageNumber, numPages, id]);

  return (
    <div className="min-h-screen py-6">
      <div className="card-21 max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between reader-toolbar p-2 rounded">
          <div className="flex items-center gap-3">
            <button onClick={() => setPageNumber(p => Math.max(1, p-1))} className="btn-ghost">←</button>
            <button onClick={() => setPageNumber(p => Math.min((numPages || 1), p+1))} className="btn-ghost">→</button>
            <div className="text-sm lead">Página {pageNumber} / {numPages}</div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-ghost" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>-</button>
            <div className="text-sm">Zoom {Math.round(scale * 100)}%</div>
            <button className="btn-ghost" onClick={() => setScale(s => Math.min(3, s + 0.1))}>+</button>
            <button className="btn-ghost" onClick={() => setMode('single')}>Single</button>
            <button className="btn-ghost" onClick={() => setMode('double')}>Dupla</button>
            <button className="btn-ghost" onClick={() => setMode('scroll')}>Scroll</button>
          </div>
        </div>

        <div className="mt-4">
          {fileUrl ? (
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
              {mode === 'scroll' ? (
                <div className="flex flex-col items-center gap-4">
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index+1}`} pageNumber={index+1} scale={scale} />
                  ))}
                </div>
              ) : mode === 'double' ? (
                <div className="flex gap-4 justify-center">
                  <Page pageNumber={pageNumber} scale={scale} />
                  <Page pageNumber={Math.min(pageNumber+1, numPages)} scale={scale} />
                </div>
              ) : (
                <div className="flex justify-center">
                  <Page pageNumber={pageNumber} scale={scale} />
                </div>
              )}
            </Document>
          ) : (
            <div className="text-gray-400">Carregando PDF...</div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input type="number" value={pageNumber} onChange={e => setPageNumber(Number(e.target.value))} className="w-28 p-2 rounded bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]" />
        </div>
      </div>
    </div>
  );
}
