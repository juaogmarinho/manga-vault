'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function MangaReader({ params }: { params: { id: string } }) {
  const { id } = params;
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [mode, setMode] = useState<'single'|'double'|'scroll'>('single');
n  useEffect(() => {
    async function load() {
      const res = await fetch('/api/mangas?q=');
      const json = await res.json();
      const manga = json.mangas.find((m: any) => String(m.id) === String(id));
      if (manga) setFileUrl(manga.filePath);
    }
    load();
  }, [id]);
n  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }
n  return (
    <div className="bg-gray-900 min-h-screen py-6">
      <div className="max-w-5xl mx-auto bg-gray-800 p-4 rounded">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            <button onClick={() => setMode('single')} className="px-2 py-1 bg-gray-700 rounded">Página única</button>
            <button onClick={() => setMode('double')} className="px-2 py-1 bg-gray-700 rounded">Dupla</button>
            <button onClick={() => setMode('scroll')} className="px-2 py-1 bg-gray-700 rounded">Scroll</button>
          </div>
          <div className="text-sm text-gray-400">Página {pageNumber} / {numPages}</div>
        </div>
n        <div>
          {fileUrl ? (
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
              {mode === 'scroll' ? (
                Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index+1}`} pageNumber={index+1} width={900} />
                ))
              ) : mode === 'double' ? (
                <div className="flex gap-4">
                  <Page pageNumber={pageNumber} width={450} />
                  <Page pageNumber={Math.min(pageNumber+1, numPages)} width={450} />
                </div>
              ) : (
                <Page pageNumber={pageNumber} width={900} />
              )}
            </Document>
          ) : (
            <div className="text-gray-400">Carregando PDF...</div>
          )}
        </div>
n        <div className="mt-4 flex items-center gap-2">
          <button onClick={() => setPageNumber(p => Math.max(1, p-1))} className="px-3 py-1 bg-gray-700 rounded">Anterior</button>
          <button onClick={() => setPageNumber(p => Math.min((numPages || 1), p+1))} className="px-3 py-1 bg-gray-700 rounded">Próxima</button>
          <input type="number" value={pageNumber} onChange={e => setPageNumber(Number(e.target.value))} className="w-20 p-1 rounded bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
